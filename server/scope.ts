"use server";

import prisma from "@/lib/db";
import { auth } from "../auth";
import { getClientSession } from "@/lib/client-session";
import { revalidatePath } from "next/cache";
import { ChangeRequestStatus, ScopeType, ChangeRequestCreator } from "@/generated/prisma";

// Helper: Verify agency project access
async function getAgencyProjectAccess(userId: string, projectId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId) return null;

  const projectMember = await prisma.projectMember.findFirst({
    where: { projectId, userId },
  });

  const isAgencyOwner = user.role === "OWNER";
  const isProjectOwner = projectMember?.role === "OWNER";
  const isMember = projectMember?.role === "MEMBER";

  if (!isAgencyOwner && !projectMember) return null;

  return {
    agencyId: user.agencyId,
    canManage: isAgencyOwner || isProjectOwner || isMember,
  };
}

/**
 * 1. Fetch all change requests for a project (Supports Agency and Client)
 */
export async function getProjectScopeRequests(projectId: string) {
  try {
    const session = await auth();
    let isAgency = false;
    let isClient = false;

    if (session?.user?.id) {
      const access = await getAgencyProjectAccess(session.user.id, projectId);
      if (access) isAgency = true;
    }

    if (!isAgency) {
      const clientSession = await getClientSession();
      if (clientSession && clientSession.projectId === projectId) {
        isClient = true;
      }
    }

    if (!isAgency && !isClient) {
      return { error: "Unauthorized" };
    }

    const requests = await prisma.changeRequest.findMany({
      where: { projectId },
      include: {
        convertedMilestone: {
          select: {
            id: true,
            title: true,
            status: true,
            amount: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, requests };
  } catch (error) {
    console.error("Error fetching scope requests:", error);
    return { error: "Failed to fetch change requests" };
  }
}

/**
 * 2. Agency creates a Change Request (Directly with official cost & timeline)
 */
export async function createAgencyChangeRequest(data: {
  projectId: string;
  title: string;
  description?: string;
  scopeType: "IN_SCOPE" | "NEW_REQUEST";
  costImpact?: number;
  timelineImpact?: string;
  agencyNote?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const access = await getAgencyProjectAccess(session.user.id, data.projectId);
  if (!access || !access.canManage) {
    return { error: "Permission denied" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { clientId: true, agencyId: true },
    });

    if (!project) return { error: "Project not found" };

    const request = await prisma.changeRequest.create({
      data: {
        agencyId: project.agencyId,
        projectId: data.projectId,
        clientId: project.clientId,
        requestedByRole: "AGENCY",
        title: data.title.trim(),
        description: data.description?.trim() || null,
        scopeType: data.scopeType as ScopeType,
        status: "PENDING_CLIENT_APPROVAL",
        costImpact: data.costImpact ?? 0,
        timelineImpact: data.timelineImpact?.trim() || null,
        agencyNote: data.agencyNote?.trim() || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: project.agencyId,
        projectId: data.projectId,
        actorUserId: session.user.id,
        action: `logged change request proposal: "${request.title}"`,
        entityType: "CHANGE_REQUEST",
        entityId: request.id,
      },
    });

    revalidatePath(`/dashboard/projects/${data.projectId}/scope`);
    return { success: true, request };
  } catch (error) {
    console.error("Error creating agency change request:", error);
    return { error: "Failed to create change request" };
  }
}

/**
 * 3. Client initiates a Change Request from Client Portal (Status: SUBMITTED)
 */
export async function createClientChangeRequest(data: {
  projectId: string;
  title: string;
  description?: string;
}) {
  const clientSession = await getClientSession();
  if (!clientSession || clientSession.projectId !== data.projectId) {
    return { error: "Unauthorized client session" };
  }

  try {
    const request = await prisma.changeRequest.create({
      data: {
        agencyId: clientSession.agencyId,
        projectId: clientSession.projectId,
        clientId: clientSession.clientId,
        requestedByRole: "CLIENT",
        title: data.title.trim(),
        description: data.description?.trim() || null,
        scopeType: "NEW_REQUEST",
        status: "SUBMITTED",
        costImpact: 0,
        timelineImpact: null,
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: clientSession.agencyId,
        projectId: clientSession.projectId,
        actorClientId: clientSession.clientId,
        action: `client requested change: "${request.title}"`,
        entityType: "CHANGE_REQUEST",
        entityId: request.id,
      },
    });

    revalidatePath(`/dashboard/projects/${clientSession.projectId}/scope`);
    revalidatePath(`/portal/${clientSession.token}/scope`);
    return { success: true, request };
  } catch (error) {
    console.error("Error creating client change request:", error);
    return { error: "Failed to submit request" };
  }
}

/**
 * 4. Agency reviews request and proposes official cost & timeline
 */
export async function reviewChangeRequestByAgency(data: {
  requestId: string;
  scopeType: "IN_SCOPE" | "NEW_REQUEST";
  costImpact: number;
  timelineImpact: string;
  agencyNote?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const existing = await prisma.changeRequest.findUnique({
      where: { id: data.requestId },
    });

    if (!existing) return { error: "Request not found" };

    const access = await getAgencyProjectAccess(session.user.id, existing.projectId);
    if (!access || !access.canManage) return { error: "Permission denied" };

    const updated = await prisma.changeRequest.update({
      where: { id: data.requestId },
      data: {
        scopeType: data.scopeType as ScopeType,
        costImpact: Number(data.costImpact) || 0,
        timelineImpact: data.timelineImpact.trim(),
        agencyNote: data.agencyNote?.trim() || null,
        status: "PENDING_CLIENT_APPROVAL",
      },
    });

    await prisma.activityLog.create({
      data: {
        agencyId: existing.agencyId,
        projectId: existing.projectId,
        actorUserId: session.user.id,
        action: `proposed scope & estimate for: "${existing.title}" ($${data.costImpact}, ${data.timelineImpact})`,
        entityType: "CHANGE_REQUEST",
        entityId: existing.id,
      },
    });

    revalidatePath(`/dashboard/projects/${existing.projectId}/scope`);
    return { success: true, request: updated };
  } catch (error) {
    console.error("Error reviewing change request:", error);
    return { error: "Failed to update change request" };
  }
}

/**
 * 5. Client accepts, declines, or requests revision on proposal
 * If APPROVE: Automatically creates Milestone/Task once and marks CONVERTED.
 */
export async function respondToChangeRequestByClient(data: {
  requestId: string;
  decision: "APPROVE" | "REJECT" | "NEEDS_REVISION";
  clientNote?: string;
}) {
  const clientSession = await getClientSession();
  if (!clientSession) return { error: "Unauthorized client session" };

  try {
    const request = await prisma.changeRequest.findUnique({
      where: { id: data.requestId },
    });

    if (!request) return { error: "Change request not found" };
    if (request.projectId !== clientSession.projectId) {
      return { error: "Project mismatch" };
    }

    if (request.status === "CONVERTED" || request.status === "APPROVED") {
      return { error: "Request has already been approved" };
    }

    if (data.decision === "APPROVE") {
      // Transaction to ensure milestone is created exactly once
      const result = await prisma.$transaction(async (tx) => {
        // Find highest orderIndex
        const lastMilestone = await tx.milestone.findFirst({
          where: { projectId: request.projectId },
          orderBy: { orderIndex: "desc" },
        });

        const nextOrderIndex = (lastMilestone?.orderIndex ?? -1) + 1;

        // Create the milestone
        const milestone = await tx.milestone.create({
          data: {
            projectId: request.projectId,
            agencyId: request.agencyId,
            title: request.title,
            description: request.description
              ? `${request.description}${request.timelineImpact ? `\n\nEstimated Timeline: ${request.timelineImpact}` : ""}`
              : request.timelineImpact ? `Estimated Timeline: ${request.timelineImpact}` : null,
            amount: request.costImpact && request.costImpact > 0 ? request.costImpact : null,
            orderIndex: nextOrderIndex,
            status: "PENDING",
          },
        });

        // Update change request to CONVERTED
        const updatedRequest = await tx.changeRequest.update({
          where: { id: request.id },
          data: {
            status: "CONVERTED",
            convertedMilestoneId: milestone.id,
            clientNote: data.clientNote?.trim() || null,
          },
        });

        // Activity log
        await tx.activityLog.create({
          data: {
            agencyId: request.agencyId,
            projectId: request.projectId,
            actorClientId: clientSession.clientId,
            action: `approved change request: "${request.title}". Converted to Milestone #${nextOrderIndex + 1}`,
            entityType: "MILESTONE",
            entityId: milestone.id,
          },
        });

        return { request: updatedRequest, milestone };
      });

      revalidatePath(`/dashboard/projects/${request.projectId}/scope`);
      revalidatePath(`/dashboard/projects/${request.projectId}/milestones`);
      revalidatePath(`/portal/${clientSession.token}/scope`);
      revalidatePath(`/portal/${clientSession.token}/milestones`);
      return { success: true, ...result };
    }

    if (data.decision === "REJECT") {
      const updated = await prisma.changeRequest.update({
        where: { id: request.id },
        data: {
          status: "REJECTED",
          clientNote: data.clientNote?.trim() || null,
        },
      });

      await prisma.activityLog.create({
        data: {
          agencyId: request.agencyId,
          projectId: request.projectId,
          actorClientId: clientSession.clientId,
          action: `declined change request: "${request.title}"`,
          entityType: "CHANGE_REQUEST",
          entityId: request.id,
        },
      });

      revalidatePath(`/dashboard/projects/${request.projectId}/scope`);
      revalidatePath(`/portal/${clientSession.token}/scope`);
      return { success: true, request: updated };
    }

    if (data.decision === "NEEDS_REVISION") {
      const updated = await prisma.changeRequest.update({
        where: { id: request.id },
        data: {
          status: "NEEDS_REVISION",
          clientNote: data.clientNote?.trim() || null,
        },
      });

      await prisma.activityLog.create({
        data: {
          agencyId: request.agencyId,
          projectId: request.projectId,
          actorClientId: clientSession.clientId,
          action: `requested revision on change request: "${request.title}"`,
          entityType: "CHANGE_REQUEST",
          entityId: request.id,
        },
      });

      revalidatePath(`/dashboard/projects/${request.projectId}/scope`);
      revalidatePath(`/portal/${clientSession.token}/scope`);
      return { success: true, request: updated };
    }

    return { error: "Invalid decision" };
  } catch (error) {
    console.error("Error processing client response to change request:", error);
    return { error: "Failed to record response" };
  }
}

/**
 * 6. Agency or Client cancels a request
 */
export async function cancelChangeRequest(requestId: string, reason?: string) {
  try {
    const existing = await prisma.changeRequest.findUnique({
      where: { id: requestId },
    });
    if (!existing) return { error: "Request not found" };

    const session = await auth();
    const clientSession = await getClientSession();

    if (!session?.user?.id && !clientSession) {
      return { error: "Unauthorized" };
    }

    const updated = await prisma.changeRequest.update({
      where: { id: requestId },
      data: {
        status: "CANCELLED",
        agencyNote: reason ? `${existing.agencyNote ? `${existing.agencyNote}\n` : ""}Cancelled: ${reason}` : existing.agencyNote,
      },
    });

    revalidatePath(`/dashboard/projects/${existing.projectId}/scope`);
    return { success: true, request: updated };
  } catch (error) {
    console.error("Error cancelling change request:", error);
    return { error: "Failed to cancel request" };
  }
}
