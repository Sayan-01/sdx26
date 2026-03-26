"use server";

import { auth } from "../../auth";
import prisma from "./db";
import { sendOtpViaNodeMailer } from "./sendOtpViaNodeMailer";
import bcrypt from "bcryptjs";

export const IsUserEmailExist = async (email: string) => {
  const response = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (response) return true;
  else return false;
};

export const sendCodeThroughNodemailer = async (email: string, username: string, otp: string) => {
  const emailRes = await sendOtpViaNodeMailer(email, username, otp);
  if (emailRes) {
    return { success: true, message: "Email error is", status: 200 };
  } else return { success: false, message: "Email error is", status: 500 };
};

export async function createAgency(formData: { name: string; logoUrl?: string | null }) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const { name, logoUrl } = formData;

  if (!name) return { error: "Agency name is required" };

  try {
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);

    const agency = await prisma.agency.create({
      data: {
        name,
        logoUrl: logoUrl || null,
        ownerId: session.user.id,
        slug,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { agencyId: agency.id },
    });

    // Create team member record
    await prisma.teamMember.create({
      data: {
        userId: session.user.id,
        agencyId:agency.id,
        role: "OWNER",
        designation: "FOUNDER",
      },
    });

    return { success: true, agency };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create agency" };
  }
}
