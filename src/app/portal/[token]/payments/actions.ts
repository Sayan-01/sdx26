"use server";

import { polar } from "@/lib/polar";
import { getClientSession } from "@/lib/client-session";
import prisma from "@/lib/db";

export async function createPortalCheckout(data: { amount: number; milestoneId: string; title: string }) {
  const session = await getClientSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const checkout = await polar.checkouts.create({
      projectName: "Project Milestone: " + data.title,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/portal/${session.token}/payments/success?milestoneId=${data.milestoneId}`,
      customerExternalId: session.clientId,
      customerEmail: session.clientEmail,
      prices: [
        {
          type: "fixed",
          priceAmount: Math.round(data.amount * 100), // convert to cents
          priceCurrency: "usd",
        } as any,
      ],
      metadata: {
        milestoneId: data.milestoneId,
        projectId: session.projectId,
        agencyId: session.agencyId,
        clientId: session.clientId,
      },
    } as any);

    return { url: checkout.url };
  } catch (error) {
    console.error("Polar Checkout Error:", error);
    return { error: "Failed to create checkout session" };
  }
}

export async function verifyMilestonePayment(milestoneId: string) {
  const session = await getClientSession();
  if (!session) throw new Error("Unauthorized");

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { payments: true },
  });

  if (!milestone) return { error: "Milestone not found" };

  // If already paid in DB, great
  if (milestone.status === "PAID" || milestone.payments?.status === "PAID") {
    return { paid: true };
  }

  // If not paid in DB yet, we could potentially check Polar API directly here
  // But for now, we'll just return the current status and let the webhook handle it
  // or the user refresh.
  
  return { paid: false };
}
