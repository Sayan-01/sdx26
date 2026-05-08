"use server";

import prisma from "@/lib/db";
import { auth } from "../auth";

export const getActivityLogs = async () => {
  const session = await auth();
  if(!session?.user?.agencyId) return { success: false, logs: [] };

  const logs = await prisma.activityLog.findMany({
    where: { agencyId: session.user.agencyId },
    include: {
      actorUser: true,
      actorClient: true,
      project: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit to 50 recent logs for now
  });

  return { success: true, logs };
};

export const markAllLogsAsRead = async () => {
  const session = await auth();
  if(!session?.user?.agencyId) return { success: false };

  await prisma.activityLog.updateMany({
    where: { 
      agencyId: session.user.agencyId,
      isRead: false 
    },
    data: { isRead: true }
  });

  return { success: true };
};

export const getNewNotifications = async () => {
  const session = await auth();
  if(!session?.user?.agencyId) return { success: false, notifications: [] };

  const notifications = await prisma.activityLog.findMany({
    where: { agencyId: session.user.agencyId, isRead: false },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10 // Limit to 10 recent notifications for now
  });

  return { success: true, notifications };
};
