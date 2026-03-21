"use server";

import { auth } from "../../auth";
import prisma from "./db";
import { sendOtpViaNodeMailer } from "./sendOtpViaNodeMailer";
import { sendPortalUrl } from "./sendPortalUrl";

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

    return { success: true, agency };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create agency" };
  }
}

export async function createProject(data: {
  projectName: string;
  projectDescription?: string;
  clientName: string;
  clientEmail: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true, role: true },
  });

  if (!user?.agencyId || user.role !== "OWNER") {
    return { error: "You must belong to an agency to create projects" };
  }

  const { projectName, projectDescription, clientName, clientEmail } = data;

  try {
    // 1. Find or create client for this agency
    let client = await prisma.client.findUnique({
      where: {
        agencyId_email: {
          agencyId: user.agencyId,
          email: clientEmail,
        },
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: clientEmail,
          agencyId: user.agencyId,
        },
      });
    }

    // 2. Create the project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: projectDescription || null,
        agencyId: user.agencyId,
        clientId: client.id,
      },
    });

    // 3. Create a Magic Link for the client
    const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    const magicLink = await prisma.magicLink.create({
      data: {
        token,
        agencyId: user.agencyId,
        projectId: project.id,
        clientId: client.id,
        clientEmail: client.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    const portalUrl = `${window.location.origin}/portal/${token}/onboarding`;
    const emailRes = await sendPortalUrl(clientEmail, clientName, portalUrl);


    return { success: true, projectId: project.id, magicToken: token };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create project" };
  }
}
