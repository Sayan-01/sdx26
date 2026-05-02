"use server";

import prisma from "@/lib/db";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { ProjectMemberRole } from "@/generated/prisma";

export async function getProjectMembers(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const members = await prisma.projectMember.findMany({
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

    return { success: true, members };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch project members" };
  }
}

export async function getAvailableAgencyMembers(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true },
    });

    if (!user?.agencyId) return { error: "Agency not found" };

    // Get all users in the agency
    const agencyUsers = await prisma.user.findMany({
      where: { agencyId: user.agencyId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        teamMembers: {
          where: { agencyId: user.agencyId },
          select: { designation: true },
          take: 1
        }
      },
    });

    const projectMembers = await prisma.projectMember.findMany({
      where: { projectId },
      select: { userId: true },
    });

    const projectUserIds = new Set(projectMembers.map(m => m.userId));

    // Map and filter users
    const availableMembers = agencyUsers
      .filter(u => !projectUserIds.has(u.id))
      .map(u => ({
        ...u,
        designation: u.teamMembers[0]?.designation || ""
      }));

    return { success: true, availableMembers };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch available members" };
  }
}

export async function addProjectMember(projectId: string, userId: string, role: ProjectMemberRole = "MEMBER", designation: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true },
    });

    if (!user?.agencyId) return { error: "Agency not found" };

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
        designation,
        agencyId: user.agencyId,
      },
      include: {
        user: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        agencyId: user.agencyId,
        projectId,
        actorUserId: session.user.id,
        action: `added ${(member as any).user?.name || (member as any).user?.email || "member"} to project`,
        entityType: "MEMBER",
        entityId: member.id,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/members`);
    return { success: true, member };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add member to project" };
  }
}

export async function removeProjectMember(memberId: string, projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const member = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: { user: true }
    });

    if (!member) return { error: "Member not found" };

    await prisma.projectMember.delete({
      where: { id: memberId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        agencyId: member.agencyId,
        projectId: member.projectId,
        actorUserId: session.user.id,
        action: `removed ${member.user.name || member.user.email} from project`,
        entityType: "MEMBER",
        entityId: memberId,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/members`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove member from project" };
  }
}

export async function updateProjectMemberRole(memberId: string, projectId: string, role: ProjectMemberRole) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const member = await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
      include: { user: true }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        agencyId: member.agencyId,
        projectId: member.projectId,
        actorUserId: session.user.id,
        action: `updated ${member.user.name || member.user.email}'s role to ${role}`,
        entityType: "MEMBER",
        entityId: memberId,
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/members`);
    return { success: true, member };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update member role" };
  }
}
