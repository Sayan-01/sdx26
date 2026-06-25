"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";
import { getAgencyLimits } from "@/lib/planLimits";

export const getAllTeamMembers = async () => {
  const session = await auth();
  if(!session?.user) return { success: false, teamMembers: [] };
  const agency = await prisma.agency.findUnique({
    where: { id: session.user.agencyId as string },
  });
  if(!agency) return { success: false, teamMembers: [] };
  const teamMembers = await prisma.user.findMany({
    where: { agencyId: session.user.agencyId },
  });
  return {success: true, teamMembers};
  
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

  return { invitation, user };
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
