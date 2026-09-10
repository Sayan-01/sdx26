"use server";

import prisma from "@/lib/db";
import { sendPortalUrl } from "@/lib/sendPortalUrl";
import { auth } from "../auth";
import { getAgencyLimits, checkStorageLimit } from "@/lib/planLimits";
import { revalidatePath } from "next/cache";
import { MilestoneStatus, TaskStatus, TaskPriority } from "@/generated/prisma";

export const getAllProjects = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId) {
    return { error: "You must belong to an agency" };
  }

  const isOwner = user.role === "OWNER";

  const projects = await prisma.project.findMany({
    where: isOwner
      ? {
          agencyId: user.agencyId,
        }
      : {
          agencyId: user.agencyId,
          projectMembers: {
            some: {
              userId: session.user.id,
            },
          },
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

  return { success: true, projects, userRole: user.role };
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

    await prisma.projectMember.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        agencyId: user.agencyId,
        role: "OWNER",
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

// Project access and role helper
async function getProjectAccess(sessionUserId: string, projectId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId) return null;

  const projectMember = await prisma.projectMember.findFirst({
    where: { projectId, userId: sessionUserId },
  });

  const isAgencyOwner = user.role === "OWNER";
  const isProjectOwner = projectMember?.role === "OWNER";
  const isOwner = isAgencyOwner || isProjectOwner;
  const isMember = projectMember?.role === "MEMBER";
  const isViewer = projectMember?.role === "VIEWER";

  if (!isAgencyOwner && !projectMember) return null;

  return {
    user,
    projectMember,
    agencyId: user.agencyId,
    isOwner,
    isMember,
    isViewer,
    canManageMilestones: isOwner,
    canManageTasks: isOwner || isMember,
    canPostMessages: isOwner || isMember,
    effectiveRole: (isOwner ? "OWNER" : (projectMember?.role || "MEMBER")) as "OWNER" | "MEMBER" | "VIEWER",
  };
}

export const updateProject = async (
  projectId: string,
  statusOrData: "ACTIVE" | "PENDING" | "ON_HOLD" | "COMPLETED" | "ARCHIVED" | { status: "ACTIVE" | "PENDING" | "ON_HOLD" | "COMPLETED" | "ARCHIVED" }
) => {
  const status = typeof statusOrData === "object" ? statusOrData.status : statusOrData;
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId || user.role !== "OWNER") {
    return { error: "You must be the owner of the agency to update project status" };
  }

  // Check if project exists in this agency
  const currentProject = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, agencyId: true, status: true },
  });

  if (!currentProject || currentProject.agencyId !== user.agencyId) {
    return { error: "Project not found in your agency" };
  }

  // If changing to ACTIVE, check active project limit
  if (status === "ACTIVE" && currentProject.status !== "ACTIVE") {
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
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      status: status,
    },
  });

  await prisma.activityLog.create({
    data: {
      agencyId: user.agencyId,
      projectId: updatedProject.id,
      actorUserId: session.user.id,
      action: `project status changed to ${status}`,
      entityType: "PROJECT",
      entityId: updatedProject.id,
      metadata: { status },
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/dashboard/projects`);
  revalidatePath(`/dashboard`);

  return { success: true, project: updatedProject };
};


export const getMilestonesByProjectId = async (projectId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access) {
    return { error: "You do not have access to this project" };
  }

  const milestones = await prisma.milestone.findMany({
    where: {
      projectId,
      agencyId: access.agencyId,
    },
    include: {
      payments: true,
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      messages: {
        include: {
          senderUser: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              role: true,
            },
          },
          senderClient: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  const projectMembers = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    success: true,
    milestones,
    userRole: {
      isOwner: access.isOwner,
      isMember: access.isMember,
      isViewer: access.isViewer,
      canManageMilestones: access.canManageMilestones,
      canManageTasks: access.canManageTasks,
      canPostMessages: access.canPostMessages,
      effectiveRole: access.effectiveRole,
    },
    currentUserId: session.user.id,
    teamMembers: projectMembers.map((pm) => ({
      id: pm.id,
      role: pm.role,
      user: pm.user,
    })),
  };
};

export const createMilestone = async (
  projectId: string,
  data: { title: string; description?: string; amount: number; dueDate?: Date }
) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageMilestones) {
    return { error: "Only project owners can create milestones" };
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
        agencyId: access.agencyId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate,
        orderIndex: nextOrderIndex,
        status: "PENDING",
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `created milestone: ${data.title}`,
        entityType: "MILESTONE",
        entityId: milestone.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, milestone };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create milestone" };
  }
};

export const updateMilestone = async (
  projectId: string,
  milestoneId: string,
  data: {
    title?: string;
    description?: string;
    amount?: number;
    dueDate?: Date | null;
  }
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageMilestones) {
    return { error: "Only project owners can edit milestone details" };
  }

  try {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId, projectId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `updated milestone: ${milestone.title}`,
        entityType: "MILESTONE",
        entityId: milestone.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, milestone };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update milestone" };
  }
};

export const updateMilestoneStatus = async (
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access) return { error: "Unauthorized" };

  // If not owner, member cannot mark as APPROVED or PAID
  if (!access.isOwner && (status === "APPROVED" || status === "PAID")) {
    return { error: "Only project owners can approve or mark milestones as paid" };
  }

  try {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId, projectId },
      data: { status },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `changed status of milestone "${milestone.title}" to ${status.replace("_", " ")}`,
        entityType: "MILESTONE",
        entityId: milestone.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, milestone };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update milestone status" };
  }
};

export const deleteMilestone = async (projectId: string, milestoneId: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageMilestones) {
    return { error: "Only project owners can delete milestones" };
  }

  try {
    const existing = await prisma.milestone.findUnique({
      where: { id: milestoneId, projectId },
      select: { title: true },
    });

    if (!existing) return { error: "Milestone not found" };

    await prisma.milestone.delete({
      where: { id: milestoneId, projectId },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `deleted milestone: ${existing.title}`,
        entityType: "MILESTONE",
        entityId: milestoneId,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete milestone" };
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
  }
) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageTasks) {
    return { error: "You do not have permission to create tasks" };
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
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `created task: ${data.title}`,
        entityType: "TASK",
        entityId: task.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create task" };
  }
};

export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  status: TaskStatus
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageTasks) {
    return { error: "You do not have permission to update tasks" };
  }

  try {
    const task = await prisma.task.update({
      where: { id: taskId, projectId },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `marked task "${task.title}" as ${status.replace("_", " ").toLowerCase()}`,
        entityType: "TASK",
        entityId: task.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update task status" };
  }
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string | null;
    milestoneId?: string;
  }
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageTasks) {
    return { error: "You do not have permission to edit this task" };
  }

  try {
    const task = await prisma.task.update({
      where: { id: taskId, projectId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.milestoneId !== undefined && { milestoneId: data.milestoneId }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update task" };
  }
};

export const deleteTask = async (projectId: string, taskId: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canManageTasks) {
    return { error: "You do not have permission to delete tasks" };
  }

  try {
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
      select: { title: true, assigneeId: true },
    });

    if (!existing) return { error: "Task not found" };

    // If not owner, only assignee can delete
    if (!access.isOwner && existing.assigneeId !== session.user.id) {
      return { error: "Only project owners or assigned members can delete this task" };
    }

    await prisma.task.delete({
      where: { id: taskId, projectId },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `deleted task: ${existing.title}`,
        entityType: "TASK",
        entityId: taskId,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete task" };
  }
};

export const createMilestoneMessage = async (
  projectId: string,
  milestoneId: string,
  content: string
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const trimmed = content?.trim();
  if (!trimmed) return { error: "Message content cannot be empty" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access || !access.canPostMessages) {
    return { error: "You do not have permission to post messages on this project" };
  }

  try {
    const message = await prisma.message.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        milestoneId,
        senderId: session.user.id,
        senderUserId: session.user.id,
        content: trimmed,
      },
      include: {
        senderUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        senderClient: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: access.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `commented on milestone`,
        entityType: "MESSAGE",
        entityId: message.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true, message };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post message" };
  }
};

export const deleteMilestoneMessage = async (projectId: string, messageId: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getProjectAccess(session.user.id, projectId);
  if (!access) return { error: "Unauthorized" };

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { senderUserId: true, senderId: true },
    });

    if (!message) return { error: "Message not found" };

    if (!access.isOwner && message.senderUserId !== session.user.id && message.senderId !== session.user.id) {
      return { error: "You cannot delete someone else's message" };
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    revalidatePath(`/dashboard/projects/${projectId}/milestones`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete message" };
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
