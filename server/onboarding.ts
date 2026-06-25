"use server";

import prisma from "@/lib/db";
import { auth } from "../auth";
import { getClientSession } from "@/lib/client-session";
import { OnboardingStatus } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { checkStorageLimit } from "@/lib/planLimits";

export async function getOnboardingItems(projectId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const items = await prisma.onboardingItem.findMany({
      where: {
        projectId,
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return { success: true, items };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch onboarding items" };
  }
}

export async function updateOnboardingStatus(itemId: string, status: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const item = await prisma.onboardingItem.update({
      where: { id: itemId },
      data: { 
        status: status as OnboardingStatus,
        reviewedById: session.user.id
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        agencyId: item.agencyId,
        projectId: item.projectId,
        actorUserId: session.user.id,
        action: status === "APPROVED" ? "Approved onboarding item" : "Rejected onboarding item",
        entityType: "ONBOARDING",
        entityId: item.id,
        metadata: { label: item.label, status }
      }
    });

    revalidatePath(`/dashboard/projects/${item.projectId}/onboarding`);
    return { success: true, item };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update status" };
  }
}

export async function addOnboardingItem(projectId: string, label: string) {
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
    const item = await prisma.onboardingItem.create({
      data: {
        projectId,
        agencyId: user.agencyId,
        label,
        status: "PENDING",
      },
    });

    revalidatePath(`/dashboard/projects/${projectId}/onboarding`);
    return { success: true, item };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add onboarding item" };
  }
}

export async function deleteOnboardingItem(itemId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const item = await prisma.onboardingItem.delete({
      where: { id: itemId },
    });

    revalidatePath(`/dashboard/projects/${item.projectId}/onboarding`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete onboarding item" };
  }
}

export async function getPortalOnboardingItems() {
  const session = await getClientSession();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const items = await prisma.onboardingItem.findMany({
      where: {
        projectId: session.projectId,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return { success: true, items };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch onboarding items" };
  }
}

export async function uploadPortalOnboardingItem(itemId: string, fileUrl: string) {
  const session = await getClientSession();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const storageCheck = await checkStorageLimit(session.agencyId, 0);
  if (!storageCheck.allowed) {
    return { error: storageCheck.error };
  }

  try {
    const item = await prisma.onboardingItem.update({
      where: { 
        id: itemId,
        projectId: session.projectId // security check
      },
      data: {
        fileUrl,
        status: "UPLOADED",
        uploadedById: session.clientId,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        agencyId: session.agencyId,
        projectId: session.projectId,
        actorClientId: session.clientId,
        action: "upload onboarding resource",
        entityType: "ONBOARDING",
        entityId: item.id,
        metadata: { label: item.label, fileUrl }
      }
    });

    revalidatePath(`/portal/[token]/onboarding`, "page");
    return { success: true, item };
  } catch (error) {
    console.error(error);
    return { error: "Failed to upload item" };
  }
}

