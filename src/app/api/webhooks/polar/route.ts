import { Webhooks } from "@polar-sh/nextjs";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const webhookId = headersList.get("webhook-id");
  const webhookTimestamp = headersList.get("webhook-timestamp");
  const webhookSignature = headersList.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return new Response("Missing webhook headers", { status: 400 });
  }

  let event;
  try {
    event = Webhooks.validate(body, {
      "webhook-id": webhookId,
      "webhook-timestamp": webhookTimestamp,
      "webhook-signature": webhookSignature,
    } as any, process.env.POLAR_WEBHOOK_SECRET || "");
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the event
  if (event.type === "order.created") {
    const order = event.data;
    const { milestoneId, projectId, agencyId } = order.metadata;

    if (milestoneId) {
      try {
        // 1. Update Milestone Status
        await prisma.milestone.update({
          where: { id: milestoneId },
          data: { status: "PAID" },
        });

        // 2. Create Payment Record
        await prisma.payment.upsert({
          where: { milestoneId },
          update: {
            status: "PAID",
            paidAt: new Date(),
            gatewayPaymentId: order.id,
            amount: order.amount / 100,
          },
          create: {
            milestoneId,
            agencyId,
            amount: order.amount / 100,
            status: "PAID",
            paymentMethod: "STRIPE", // Polar uses Stripe under the hood usually
            gatewayPaymentId: order.id,
            paidAt: new Date(),
          },
        });

        // 3. Log activity
        await prisma.activityLog.create({
          data: {
            agencyId,
            projectId,
            action: `Payment received for milestone: ${milestoneId}`,
            entityType: "PAYMENT",
            entityId: order.id,
          },
        });
      } catch (dbError) {
        console.error("Database Update Error:", dbError);
        return new Response("Database error", { status: 500 });
      }
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
