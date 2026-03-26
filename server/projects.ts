"use server";

import prisma from "@/lib/db";
import { sendPortalUrl } from "@/lib/sendPortalUrl";
import { auth } from "../auth";

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
    const magicLink = await prisma.magicLink.create({
      data: {
        token,
        agencyId: user.agencyId,
        projectId: project.id,
        clientId: client.id,
        clientEmail: client.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    const agencySlug = session.user.agencySlug;
    const portalUrl = `${process.env.NEXT_PUBLIC_URL_SCHEME}${agencySlug}.${process.env.NEXT_PUBLIC_URL_DOMAIN}/portal/${token}`;
    await sendPortalUrl(clientEmail, clientName, portalUrl);

    return { success: true, projectId: project.id, magicToken: token };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create project" };
  }
}
