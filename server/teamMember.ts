"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";

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
      action: "team_member.accepted_invitation",
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
