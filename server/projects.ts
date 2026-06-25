"use server";

import prisma from "@/lib/db";
import { sendPortalUrl } from "@/lib/sendPortalUrl";
import { auth } from "../auth";
import { getAgencyLimits, checkStorageLimit } from "@/lib/planLimits";

export const getAllProjects = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId || user.role !== "OWNER") {
    return { error: "You must belong to an agency to create projects" };
  }

  const projects = await prisma.project.findMany({
    where: {
      agencyId: user.agencyId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      deadline: true,
      status: true,
      client: {
        select: {
          name: true,
          email: true,
        },
      },
      milestones: {
        select: {
          status: true,
        },
      },
      projectMembers: {
        select: {
          user: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          projectMembers: true,
        },
      },
    },
  });

  return { success: true, projects };
};

export async function createProject(data: { projectName: string; projectDescription?: string; clientName: string; clientEmail: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId || user.role !== "OWNER") {
    return { error: "You must belong to an agency to create projects" };
  }

  // Check active projects limit
  const activeProjectsCount = await prisma.project.count({
    where: {
      agencyId: user.agencyId,
      status: "ACTIVE",
    },
  });

  const limits = await getAgencyLimits(user.agencyId);
  if (activeProjectsCount >= limits.maxProjects) {
    const maxProjectsStr = limits.maxProjects >= 999999 ? "unlimited" : `${limits.maxProjects} active projects`;
    return { error: `Project limit reached. Your current plan allows up to ${maxProjectsStr}.` };
  }

  const { projectName, projectDescription, clientName, clientEmail } = data;

  try {
    // 1. Find or create client for this agency
    let client = await prisma.client.findUnique({
      where: {
        agencyId_email: {
          agencyId: user.agencyId,
          email: clientEmail,
        },
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: clientEmail,
          agencyId: user.agencyId,
        },
      });
    }

    // 2. Create the project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: projectDescription || null,
        agencyId: user.agencyId,
        clientId: client.id,
      },
    });

    // 3. Create a Magic Link for the client
    const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    await prisma.magicLink.create({
      data: {
        token,
        agencyId: user.agencyId,
        projectId: project.id,
        clientId: client.id,
        clientEmail: client.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    const portalUrl = `${process.env.NEXT_PUBLIC_URL_SCHEME}${session.user.agencySlug}.${process.env.NEXT_PUBLIC_URL_DOMAIN}/portal/${token}`;
    await sendPortalUrl(clientEmail, clientName, portalUrl);
    await prisma.activityLog.create({
      data: {
        agencyId: project.agencyId,
        projectId: project.id,
        actorUserId: session.user.id,
        action: "portal link generated",
        entityType: "PROJECT",
        entityId: project.id,
        metadata: {
          clientEmail: clientEmail,
        },
      },
    });
    // 4. Initialize Onboarding Items
    const defaultLabels = ["Company Logo (SVG/PNG)", "Brand Guidelines (PDF)", "Website Copy/Content", "Hosting Access Details", "Domain Access Details"];

    await prisma.onboardingItem.createMany({
      data: defaultLabels.map((label) => ({
        label,
        projectId: project.id,
        agencyId: user.agencyId as string,
        status: "PENDING",
      })),
    });

    return { success: true, projectId: project.id, magicToken: token };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create project" };
  }
}

export const getProjectById = async (id: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  const project = await prisma.project.findUnique({
    where: {
      id,
      agencyId: user.agencyId,
    },
    include: {
      client: true,
      milestones: {
        orderBy: { orderIndex: "asc" },
      },
      onboardingItem: true,
      projectMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          actorUser: {
            select: {
              name: true,
            },
          },
          actorClient: {
            select: {
              name: true,
            },
          },
        },
      },
      tasks: {
        where: {
          status: {
            in: ["PENDING", "IN_PROGRESS"],
          },
        },
        include: {
          assignee: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  return { success: true, project };
};

import { revalidatePath } from "next/cache";

export const getMilestonesByProjectId = async (projectId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  const milestones = await prisma.milestone.findMany({
    where: {
      projectId,
      agencyId: user.agencyId,
    },
    include: {
      payments: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  return { success: true, milestones };
};

export const createMilestone = async (projectId: string, data: { title: string; description?: string; amount: number; dueDate?: Date }) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  try {
    const lastMilestone = await prisma.milestone.findFirst({
      where: { projectId },
      orderBy: { orderIndex: "desc" },
    });

    const nextOrderIndex = (lastMilestone?.orderIndex ?? -1) + 1;

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        agencyId: user.agencyId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate,
        orderIndex: nextOrderIndex,
        status: "PENDING",
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true, milestone };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create milestone" };
  }
};
export const createTask = async (
  projectId: string,
  data: {
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    milestoneId: string;
    assigneeId?: string;
  },
) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "PENDING",
        projectId,
        milestoneId: data.milestoneId,
        assigneeId: data.assigneeId || null,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        agencyId: user.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `created task: ${data.title}`,
        entityType: "TASK",
        entityId: task.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create task" };
  }
};

export const getFilesByProjectId = async (projectId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  const files = await prisma.file.findMany({
    where: {
      projectId,
      agencyId: user.agencyId,
    },
    include: {
      uploader: {
        select: {
          name: true,
        },
      },
      milestone: {
        select: {
          title: true,
        },
      },
      fileVersions: {
        select: {
          fileSizeBytes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { success: true, files };
};

export const getPortalFilesByProjectId = async (projectId: string, agencyId: string) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        projectId,
        agencyId,
      },
      include: {
        uploader: {
          select: {
            name: true,
          },
        },
        milestone: {
          select: {
            title: true,
          },
        },
        fileVersions: {
          select: {
            fileSizeBytes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, files };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch files" };
  }
};

export const getLatestMagicLink = async (projectId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });
  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }
  const magicLink = await prisma.magicLink.findFirst({
    where: {
      projectId,
      agencyId: user.agencyId,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      expiresAt: "desc",
    },
  });

  if (!magicLink) return { success: true, portalUrl: null };

  const portalUrl = `${process.env.NEXT_PUBLIC_URL_SCHEME}${session.user.agencySlug}.${process.env.NEXT_PUBLIC_URL_DOMAIN}/portal/${magicLink.token}`;
  return { success: true, portalUrl };
};

export const uploadFile = async (
  projectId: string,
  data: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    url: string;
    milestoneId?: string;
  }
) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Agency not found" };
  }

  // Enforce storage limits
  const storageCheck = await checkStorageLimit(user.agencyId, data.fileSizeBytes);
  if (!storageCheck.allowed) {
    return { error: storageCheck.error };
  }

  try {
    const file = await prisma.file.create({
      data: {
        fileName: data.fileName,
        fileType: data.fileType,
        url: data.url,
        projectId,
        agencyId: user.agencyId,
        uploaderId: session.user.id,
        milestoneId: data.milestoneId || null,
        status: "UPLOADED",
      },
    });

    const fileVersion = await prisma.fileVersion.create({
      data: {
        fileId: file.id,
        versionNumber: 1,
        storageKey: data.url,
        fileName: data.fileName,
        fileSizeBytes: BigInt(data.fileSizeBytes),
        uploadedById: session.user.id,
        agencyId: user.agencyId,
      },
    });

    await prisma.file.update({
      where: { id: file.id },
      data: {
        currentVersionId: fileVersion.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: user.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `uploaded file: ${data.fileName}`,
        entityType: "FILE",
        entityId: file.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/files`);
    return { success: true, file };
  } catch (error) {
    console.error("Failed to upload file:", error);
    return { error: "Failed to upload file" };
  }
};
