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

    const invitations = await prisma.invitation.findMany({
      where: {
        agencyId: user.agencyId,
        status: InviteStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        email: true,
        name: true,
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
      status: "ACCEPTED" as const,
      joinedAt: member.joinedAt,
    }));

    const pendingMembers = invitations.map((invitation) => ({
      id: invitation.id,
      userId: null,
      name: invitation.name,
      email: invitation.email,
      avatarUrl: null,
      designation: invitation.designation,
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

  return { email: invitation.email, name: invitation.name, agencyName: invitation.agency.name, userExist: !!user };
};

export const completeInvitationForNewUser = async (token: string, name: string, password: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  // 🔧 1. Invitation exists check
  if (!invitation) {
    return {
      success: false,
      message: "Invalid invitation",
    };
  }

  // 🔧 2. Invitation status check
  if (invitation.status !== "PENDING") {
    return {
      success: false,
      message: "Invitation is no longer valid",
    };
  }

  // 🔧 3. Expiry check
  if (invitation.expiresAt < new Date()) {
    await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    return {
      success: false,
      message: "Invitation has expired",
    };
  }

  // 🔧 4. Accepted check
  if (invitation.acceptedAt) {
    return {
      success: false,
      message: "Invitation has already been accepted",
    };
  }

  // 🔧 6. Check agency member limit
  const currentMemberCount = await prisma.teamMember.count({
    where: {
      agencyId: invitation.agencyId,
    },
  });

  const limits = await getAgencyLimits(invitation.agencyId);

  if (currentMemberCount >= limits.maxTeamMembers) {
    return {
      success: false,
      message: "Your agency has reached its team member limit.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email: invitation.email,
        password: hashedPassword,
        role: "TEAM",
        agencyId: invitation.agencyId,
      },
    });

    const teamMember = await tx.teamMember.create({
      data: {
        agencyId: invitation.agencyId,
        userId: user.id,
        designation: invitation.designation,
        role: "TEAM",
      },
    });

    await tx.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    });

    await tx.activityLog.create({
      data: {
        agencyId: invitation.agencyId,
        actorUserId: user.id,
        action: "ACCEPTED_INVITATION",
        entityType: "TEAM_MEMBER",
        entityId: teamMember.id,
        metadata: {
          email: user.email,
          name: user.name,
          role: "TEAM",
          designation: invitation.designation,
        },
      },
    });

    return {
      user,
      teamMember,
    };
  });

  return {
    success: true,
    message: "Account created successfully",
    userId: result.user.id,
  };
};

export const acceptExistingUserInvitation = async (token: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return {
        success: false,
        message: "Please login first",
      };
    }

    const invitation = await prisma.invitation.findUnique({
      where: {
        token,
      },
    });

    if (!invitation) {
      return {
        success: false,
        message: "Invalid invitation",
      };
    }

    if (invitation.status !== "PENDING") {
      return {
        success: false,
        message: "Invitation is no longer valid",
      };
    }

    if (invitation.expiresAt < new Date()) {
      return {
        success: false,
        message: "Invitation has expired",
      };
    }

    // 🔥 Important: logged-in email must match invitation email
    if (session.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return {
        success: false,
        message: "This invitation belongs to another email.",
      };
    }

    const currentMemberCount = await prisma.teamMember.count({
      where: {
        agencyId: invitation.agencyId,
      },
    });

    const limits = await getAgencyLimits(invitation.agencyId);

    // ⚠️ Use your actual limit property
    if (currentMemberCount >= limits.maxTeamMembers) {
      return {
        success: false,
        message: "Agency team member limit reached.",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingMember = await tx.teamMember.findUnique({
        where: {
          agencyId_userId: {
            agencyId: invitation.agencyId,
            userId: session.user.id,
          },
        },
      });

      if (existingMember) {
        throw new Error("You are already a member of this agency.");
      }

      const teamMember = await tx.teamMember.create({
        data: {
          agencyId: invitation.agencyId,
          userId: session.user.id,
          designation: invitation.designation,
          role: "TEAM",
        },
      });

      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          agencyId: invitation.agencyId,
          role: "TEAM",
        },
      });

      await tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      await tx.activityLog.create({
        data: {
          agencyId: invitation.agencyId,
          actorUserId: session.user.id,
          action: "ACCEPTED_INVITATION",
          entityType: "TEAM_MEMBER",
          entityId: teamMember.id,
          metadata: {
            email: session.user.email,
            role: "TEAM",
            designation: invitation.designation,
          },
        },
      });

      return teamMember;
    });

    return {
      success: true,
      message: "You have successfully joined the agency.",
      teamMemberId: result.id,
    };
  } catch (error) {
    console.error("acceptExistingUserInvitation error:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to accept invitation.",
    };
  }
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
