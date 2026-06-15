import { Webhooks } from "@polar-sh/nextjs";
import prisma from "@/lib/db";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
  onPayload: async (event: any) => {
    if (event.type === "order.created") {
      const order = event.data;
      const { milestoneId, projectId, agencyId } = order.metadata || {};

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
              paymentMethod: "STRIPE",
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
          throw dbError; // Webhooks wrapper handles standard error reporting
        }
      }
    }
  },
});
