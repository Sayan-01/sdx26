"use server";

import prisma from "@/lib/db";
import { auth } from "../../../auth";

export async function getDashboardData() {
  const session = await auth();

  if (!session?.user?.agencyId) {
    return { error: "Unauthorized or no agency" };
  }

  const agencyId = session.user.agencyId;

  try {
    const [
      activeProjectsCount,
      pendingApprovalsCount,
      completedMilestonesCount,
      pendingPaymentsResult,
      recentProjects,
      activityLogs
    ] = await Promise.all([
      prisma.project.count({
        where: { agencyId, status: "ACTIVE" }
      }),
      prisma.milestone.count({
        where: { agencyId, status: "IN_REVIEW" }
      }),
      prisma.milestone.count({
        where: { agencyId, status: { in: ["APPROVED", "PAID"] } }
      }),
      prisma.payment.aggregate({
        where: { agencyId, status: "PENDING" },
        _sum: { amount: true }
      }),
      prisma.project.findMany({
        where: { agencyId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          client: true,
          milestones: true
        }
      }),
      prisma.activityLog.findMany({
        where: { agencyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          actorUser: true,
          actorClient: true
        }
      })
    ]);

    const formattedProjects = recentProjects.map(project => {
      const totalMilestones = project.milestones.length;
      const completedMilestones = project.milestones.filter(m => m.status === "APPROVED" || m.status === "PAID").length;
      const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

      // Convert project status string to match mock if possible or use as is
      let statusStr: string = project.status;
      if (statusStr === "ACTIVE") statusStr = "Active";
      else if (statusStr === "ON_HOLD") statusStr = "On Hold";
      else if (statusStr === "COMPLETED") statusStr = "Completed";
      else if (statusStr === "ARCHIVED") statusStr = "Archived";
      else if (statusStr === "ONBOARDING") statusStr = "Onboarding"; // Mock data has Onboarding and In Review
      else if (statusStr === "IN_REVIEW") statusStr = "In Review"; 

      // Fallback logic for mock statuses
      if (progress === 100) statusStr = "Completed";
      else if (progress > 0) statusStr = "In Review"; // simplified
      else statusStr = "Onboarding";

      return {
        id: project.id,
        name: project.name,
        client: project.client?.name || "Unknown Client",
        status: statusStr,
        progress,
        date: project.updatedAt.toISOString(), // we'll format on client
      };
    });

    const formattedActivities = activityLogs.map(log => {
      let text = log.action;
      if (log.metadata && typeof log.metadata === "object" && "text" in log.metadata) {
        text = (log.metadata as any).text;
      }
      return {
        id: log.id,
        text,
        type: log.entityType?.toLowerCase() || "activity",
        time: log.createdAt.toISOString()
      };
    });

    return {
      success: true,
      data: {
        stats: {
          activeProjects: activeProjectsCount,
          pendingApprovals: pendingApprovalsCount,
          completedMilestones: completedMilestonesCount,
          pendingPayments: pendingPaymentsResult._sum.amount?.toNumber() || 0,
        },
        recentProjects: formattedProjects,
        activities: formattedActivities,
        userName: session.user.name || "User"
      }
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { error: "Failed to fetch dashboard data" };
  }
}
