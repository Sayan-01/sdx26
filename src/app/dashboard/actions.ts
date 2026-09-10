"use server";

import prisma from "@/lib/db";
import { auth } from "../../../auth";

export async function getDashboardData() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, agencyId: true },
  });

  if (!user?.agencyId) {
    return { error: "Unauthorized or no agency found" };
  }

  const agencyId = user.agencyId;
  const isOwner = user.role === "OWNER";

  try {
    // Project filter: Owners see all agency projects; Team members only see projects they are assigned to
    const projectFilter = isOwner
      ? { agencyId }
      : {
          agencyId,
          projectMembers: {
            some: { userId: user.id },
          },
        };

    // Activity filter: Owners see all agency logs; Team members see logs for their assigned projects or actions they performed
    const activityFilter = isOwner
      ? { agencyId }
      : {
          agencyId,
          OR: [
            {
              project: {
                projectMembers: {
                  some: { userId: user.id },
                },
              },
            },
            { actorUserId: user.id },
          ],
        };

    const [
      activeProjectsCount,
      pendingApprovalsCount,
      completedMilestonesCount,
      pendingPaymentsResult,
      assignedTasksCount,
      recentProjects,
      activityLogs,
    ] = await Promise.all([
      prisma.project.count({
        where: { ...projectFilter, status: "ACTIVE" },
      }),
      prisma.milestone.count({
        where: {
          agencyId,
          status: "IN_REVIEW",
          ...(isOwner
            ? {}
            : {
                project: {
                  projectMembers: {
                    some: { userId: user.id },
                  },
                },
              }),
        },
      }),
      prisma.milestone.count({
        where: {
          agencyId,
          status: { in: ["APPROVED", "PAID"] },
          ...(isOwner
            ? {}
            : {
                project: {
                  projectMembers: {
                    some: { userId: user.id },
                  },
                },
              }),
        },
      }),
      isOwner
        ? prisma.payment.aggregate({
            where: { agencyId, status: "PENDING" },
            _sum: { amount: true },
          })
        : Promise.resolve({ _sum: { amount: null } }),
      !isOwner
        ? prisma.task.count({
            where: {
              assigneeId: user.id,
              status: { in: ["PENDING", "IN_PROGRESS"] },
            },
          })
        : Promise.resolve(0),
      prisma.project.findMany({
        where: projectFilter,
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
          client: {
            select: { name: true },
          },
          milestones: {
            select: { status: true },
          },
        },
      }),
      prisma.activityLog.findMany({
        where: activityFilter,
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          actorUser: { select: { name: true } },
          actorClient: { select: { name: true } },
        },
      }),
    ]);

    const formattedProjects = recentProjects.map((project) => {
      const totalMilestones = project.milestones.length;
      const completedMilestones = project.milestones.filter(
        (m) => m.status === "APPROVED" || m.status === "PAID",
      ).length;
      const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

      return {
        id: project.id,
        name: project.name,
        client: project.client?.name || "Unknown Client",
        status: project.status,
        progress,
        date: project.updatedAt.toISOString(),
      };
    });

    const formattedActivities = activityLogs.map((log) => {
      const actorName = log.actorUser?.name || log.actorClient?.name || "System";
      let text = `${actorName} ${log.action}`;
      if (log.metadata && typeof log.metadata === "object" && "text" in log.metadata) {
        text = (log.metadata as any).text;
      }
      return {
        id: log.id,
        text,
        type: log.entityType?.toLowerCase() || "activity",
        time: log.createdAt.toISOString(),
      };
    });

    return {
      success: true,
      data: {
        isOwner,
        userRole: user.role,
        userName: user.name || session.user.name || "User",
        stats: {
          activeProjects: activeProjectsCount,
          pendingApprovals: pendingApprovalsCount,
          completedMilestones: completedMilestonesCount,
          pendingPayments: pendingPaymentsResult._sum.amount ? Number(pendingPaymentsResult._sum.amount) : 0,
          assignedTasks: assignedTasksCount,
        },
        recentProjects: formattedProjects,
        activities: formattedActivities,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { error: "Failed to fetch dashboard data" };
  }
}
