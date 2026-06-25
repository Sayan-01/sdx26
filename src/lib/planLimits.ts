import prisma from "@/lib/db";

export interface PlanLimits {
  maxProjects: number;
  maxTeamMembers: number;
  maxStorageGb: number;
}

export const DEFAULT_LIMITS: Record<string, PlanLimits> = {
  basic: {
    maxProjects: 0,
    maxTeamMembers: 1, // owner only, blocks invitations
    maxStorageGb: 0,
  },
  starter: {
    maxProjects: 5,
    maxTeamMembers: 1, // solo/owner only (1 seat)
    maxStorageGb: 1,
  },
  pro: {
    maxProjects: 999999, // unlimited
    maxTeamMembers: 5,   // max 5 seats
    maxStorageGb: 20,
  },
  enterprise: {
    maxProjects: 999999,
    maxTeamMembers: 999999,
    maxStorageGb: 999999,
  }
};

export async function getAgencyLimits(agencyId: string): Promise<PlanLimits> {
  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
    include: {
      plan: true,
      subscription: {
        include: {
          plan: true,
        }
      }
    }
  });

  if (!agency) {
    return DEFAULT_LIMITS.basic;
  }

  // If there's an active/trialing subscription with a plan, use that plan's limits
  if (agency.subscription && (agency.subscription.status === "ACTIVE" || agency.subscription.status === "TRIALING")) {
    const subPlan = agency.subscription.plan;
    if (subPlan) {
      return {
        maxProjects: subPlan.maxProjects,
        maxTeamMembers: subPlan.maxTeamMembers,
        maxStorageGb: subPlan.maxStorageGb,
      };
    }
  }

  // Fallback to the direct planId on the agency, if any
  if (agency.plan) {
    return {
      maxProjects: agency.plan.maxProjects,
      maxTeamMembers: agency.plan.maxTeamMembers,
      maxStorageGb: agency.plan.maxStorageGb,
    };
  }

  // Otherwise, fall back to default limits based on activePlan string
  const activePlanKey = (agency.activePlan || "basic").toLowerCase();
  return DEFAULT_LIMITS[activePlanKey] || DEFAULT_LIMITS.basic;
}

export async function getAgencyStorageUsed(agencyId: string): Promise<number> {
  const result = await prisma.fileVersion.aggregate({
    where: { agencyId },
    _sum: {
      fileSizeBytes: true,
    },
  });
  return Number(result._sum.fileSizeBytes || 0);
}

export async function checkStorageLimit(agencyId: string, additionalBytes: number): Promise<{ allowed: boolean; error?: string }> {
  const limits = await getAgencyLimits(agencyId);
  const maxBytes = limits.maxStorageGb * 1024 * 1024 * 1024;
  const currentBytes = await getAgencyStorageUsed(agencyId);

  if (currentBytes + additionalBytes > maxBytes) {
    const maxStorageStr = limits.maxStorageGb >= 999999 ? "unlimited" : `${limits.maxStorageGb} GB`;
    return {
      allowed: false,
      error: `Storage limit exceeded. Your current plan allows up to ${maxStorageStr}, and you have used ${(currentBytes / (1024 * 1024 * 1024)).toFixed(3)} GB.`,
    };
  }
  return { allowed: true };
}
