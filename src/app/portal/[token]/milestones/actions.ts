"use server";

import prisma from "@/lib/db";
import { getClientSession } from "@/lib/client-session";
import { revalidatePath } from "next/cache";

export async function createPortalMilestoneMessage(milestoneId: string, content: string) {
  const session = await getClientSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const trimmed = content?.trim();
  if (!trimmed) {
    return { error: "Message content cannot be empty" };
  }

  try {
    // Verify milestone belongs to client's project
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        projectId: session.projectId,
        agencyId: session.agencyId,
      },
    });

    if (!milestone) {
      return { error: "Milestone not found" };
    }

    const message = await prisma.message.create({
      data: {
        agencyId: session.agencyId,
        projectId: session.projectId,
        milestoneId,
        senderId: session.clientId,
        senderClientId: session.clientId,
        content: trimmed,
      },
      include: {
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
        agencyId: session.agencyId,
        projectId: session.projectId,
        actorClientId: session.clientId,
        action: `posted feedback on milestone "${milestone.title}"`,
        entityType: "MESSAGE",
        entityId: message.id,
      },
    });

    revalidatePath(`/portal/${session.token}/milestones`);
    revalidatePath(`/dashboard/projects/${session.projectId}/milestones`);
    return { success: true, message };
  } catch (error) {
    console.error("Portal milestone message error:", error);
    return { error: "Failed to post message" };
  }
}

export async function approvePortalMilestone(milestoneId: string) {
  const session = await getClientSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        projectId: session.projectId,
        agencyId: session.agencyId,
      },
    });

    if (!milestone) {
      return { error: "Milestone not found" };
    }

    if (milestone.status === "PAID") {
      return { error: "Milestone is already completed and paid" };
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: "APPROVED" },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: session.agencyId,
        projectId: session.projectId,
        actorClientId: session.clientId,
        action: `approved milestone "${milestone.title}"`,
        entityType: "MILESTONE",
        entityId: milestone.id,
      },
    });

    revalidatePath(`/portal/${session.token}/milestones`);
    revalidatePath(`/dashboard/projects/${session.projectId}/milestones`);
    return { success: true, milestone: updated };
  } catch (error) {
    console.error("Portal milestone approve error:", error);
    return { error: "Failed to approve milestone" };
  }
}
