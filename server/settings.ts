"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";

export const getSettingsData = async () => {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      agency: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!user) return { success: false };

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      agencyId: user.agency?.id,
      agencyName: user.agency?.name,
      agencySlug: user.agency?.slug,
    },
  };
};

export const updateSettings = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  agencyName: string;
  websiteUrl: string;
  newPassword?: string;
  avatarUrl?: string;
}) => {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

  try {
    // Update user
    const updateData: any = {
      name: fullName || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };

    if (data.newPassword && data.newPassword.length >= 6) {
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Update agency name if user is owner
    if (session.user.agencyId) {
      const agency = await prisma.agency.findUnique({
        where: { id: session.user.agencyId as string },
      });

      if (agency && agency.ownerId === session.user.id) {
        await prisma.agency.update({
          where: { id: session.user.agencyId as string },
          data: {
            name: data.agencyName.trim() || agency.name,
          },
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings" };
  }
};

export const updateAvatar = async (avatarUrl: string) => {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update avatar" };
  }
};
