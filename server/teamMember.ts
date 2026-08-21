"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";
import { getAgencyLimits } from "@/lib/planLimits";
import { InviteStatus } from "@/generated/prisma";

export const getAllTeamMembers = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Unauthorized", teamMembers: [] };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true },
    });

    if (!user?.agencyId) return { success: false, message: "Agency not found", teamMembers: [] };

    // আগে teamMembers fetch করো
    const teamMembers = await prisma.teamMember.findMany({
      where: { agencyId: user.agencyId },
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
      orderBy: { joinedAt: "desc" },
    });

    // তারপর invitations fetch করো
    const invitations = await prisma.invitation.findMany({
      where: {
        agencyId: user.agencyId,
        status: InviteStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        email: true,
        name :true,
        designation: true,
        status: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const activeMembers = teamMembers.map((member) => ({
      id: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      avatarUrl: member.user.avatarUrl,
      designation: member.designation,
      role: member.role,
      status: "ACCEPTED",
      joinedAt: member.joinedAt,
    }));

    const pendingMembers = invitations.map((invitation) => ({
      id: invitation.id,
      userId: null,
      name: invitation.name,
      email: invitation.email,
      avatarUrl: null,
      designation: invitation.designation,
      role: null,
      status: "PENDING" as const,
      joinedAt: null,
      expiresAt: invitation.expiresAt,
    }));

    return { success: true, teamMembers: [...activeMembers, ...pendingMembers] };
  } catch (error) {
    console.error("getAllTeamMembers error:", error);
    return { success: false, message: "Failed to fetch team members", teamMembers: [] };
  }
};

export const verifyInvitationToken = async (token: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { agency: true },
  });

  if (!invitation || invitation.expiresAt < new Date() || invitation.acceptedAt) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  return { email: invitation.email, name: invitation.name, agencyName: invitation.agency.name };
};

export const completeInvitation = async (token: string, password: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.expiresAt < new Date() || invitation.acceptedAt) {
    throw new Error("Invalid or expired invitation");
  }

  // Check team member limits
  const currentMemberCount = await prisma.teamMember.count({
    where: { agencyId: invitation.agencyId },
  });
  const limits = await getAgencyLimits(invitation.agencyId);
  if (currentMemberCount >= limits.maxTeamMembers) {
    const maxSeatsStr = limits.maxTeamMembers >= 999999 ? "unlimited" : `${limits.maxTeamMembers} seats`;
    throw new Error(`Team member limit reached (${maxSeatsStr}). Cannot accept invitation.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: invitation.email },
      data: { password: hashedPassword },
    }),
    prisma.invitation.update({
      where: { token },
      data: { acceptedAt: new Date() },
    }),
  ]);

  await prisma.activityLog.create({
    data: {
      agencyId: invitation.agencyId,
      actorUserId: user.id,
      action: "accepted invitation",
      entityType: "TEAM_MEMBER",
      entityId: user.id,
      metadata: {
        email: user.email,
        name: user.name,
        role: "TEAM",
        designation: invitation.designation,
      },
    },
  });

  return { success: true };
};

export const updateMemberRole = async (memberId: string, role: "OWNER" | "TEAM", designation: string) => {
  const session = await auth();
  if (!session?.user?.agencyId) return { success: false, error: "Unauthorized" };

  // Prevent modifying yourself
  if (memberId === session.user.id) return { success: false, error: "You cannot change your own role" };

  const target = await prisma.user.findFirst({
    where: { id: memberId, agencyId: session.user.agencyId },
  });
  if (!target) return { success: false, error: "Member not found" };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: memberId },
      data: { role },
    }),
    prisma.teamMember.updateMany({
      where: { userId: memberId, agencyId: session.user.agencyId },
      data: { role, designation },
    }),
  ]);

  return { success: true };
};

export const updateMemberName = async (memberId: string, name: string) => {
  const session = await auth();
  if (!session?.user?.agencyId) return { success: false, error: "Unauthorized" };

  const target = await prisma.user.findFirst({
    where: { id: memberId, agencyId: session.user.agencyId },
  });
  if (!target) return { success: false, error: "Member not found" };

  await prisma.user.update({
    where: { id: memberId },
    data: { name: name.trim() },
  });

  return { success: true };
};

export const removeMember = async (memberId: string) => {
  const session = await auth();
  if (!session?.user?.agencyId) return { success: false, error: "Unauthorized" };

  if (memberId === session.user.id) return { success: false, error: "You cannot remove yourself" };

  const target = await prisma.user.findFirst({
    where: { id: memberId, agencyId: session.user.agencyId },
  });
  if (!target) return { success: false, error: "Member not found" };
  if (target.role === "OWNER") return { success: false, error: "Cannot remove the agency owner" };

  await prisma.$transaction([
    prisma.teamMember.deleteMany({
      where: { userId: memberId, agencyId: session.user.agencyId },
    }),
    prisma.user.update({
      where: { id: memberId },
      data: { agencyId: null },
    }),
  ]);

  return { success: true };
};
