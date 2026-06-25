import { Webhooks } from "@polar-sh/nextjs";
import prisma from "@/lib/db";
import { DEFAULT_LIMITS } from "@/lib/planLimits";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
  onPayload: async (event: any) => {
    console.log("Polar webhook received event type:", event.type);

    const type = event?.type;
    const subscriptionId = event?.data?.id; // subscription ID
    // @ts-ignore: Ignore type error for customer
    const customerEmail = event?.data?.customer?.email;

    if (!customerEmail || !subscriptionId) {
      console.log("Missing email or subscriptionId");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!user) {
      console.log("User not found for email:", customerEmail);
      return;
    }

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
          throw dbError;
        }
      }
    } else if (
      event.type === "subscription.created" ||
      event.type === "subscription.updated" ||
      event.type === "subscription.active"
    ) {
      const subscription = event.data;
      const targetAgencyId = subscription.metadata?.agencyId || user.agencyId;

      if (targetAgencyId) {
        try {
          const productName = subscription.product?.name || "basic";
          const cleanPlanName = productName.toLowerCase();

          // 1. Find or create Plan
          let plan = await prisma.plan.findUnique({
            where: { name: cleanPlanName },
          });

          if (!plan) {
            const limits = DEFAULT_LIMITS[cleanPlanName];
            plan = await prisma.plan.create({
              data: {
                name: cleanPlanName,
                maxTeamMembers: limits.maxTeamMembers,
                maxProjects: limits.maxProjects,
                maxStorageGb: limits.maxStorageGb,
                priceMonthly: cleanPlanName === "pro" ? 99 : 49,
                priceYearly: cleanPlanName === "pro" ? 990 : 490,
              },
            });
          }

          // 2. Parse subscription status
          const polarStatus = subscription.status;
          let subStatus: "ACTIVE" | "CANCELED" | "TRIALING" | "PAST_DUE" = "ACTIVE";
          if (polarStatus === "canceled" || polarStatus === "revoked" || polarStatus === "inactive") {
            subStatus = "CANCELED";
          } else if (polarStatus === "trialing") {
            subStatus = "TRIALING";
          } else if (polarStatus === "past_due") {
            subStatus = "PAST_DUE";
          }

          // 3. Upsert Subscription
          await prisma.subscription.upsert({
            where: { agencyId: targetAgencyId },
            update: {
              planId: plan.id,
              status: subStatus,
              currentPeriodStart: new Date(subscription.current_period_start || Date.now()),
              currentPeriodEnd: new Date(subscription.current_period_end || Date.now() + 30 * 24 * 60 * 60 * 1000),
              stripeSubscriptionId: subscription.id,
            },
            create: {
              agencyId: targetAgencyId,
              planId: plan.id,
              status: subStatus,
              currentPeriodStart: new Date(subscription.current_period_start || Date.now()),
              currentPeriodEnd: new Date(subscription.current_period_end || Date.now() + 30 * 24 * 60 * 60 * 1000),
              stripeSubscriptionId: subscription.id,
            },
          });

          // 4. Update Agency active plan details
          await prisma.agency.update({
            where: { id: targetAgencyId },
            data: {
              planId: plan.id,
              activePlan: cleanPlanName,
            },
          });

          // 5. Activity log
          await prisma.activityLog.create({
            data: {
              agencyId: targetAgencyId,
              action: `Subscription ${subStatus.toLowerCase()}: Plan set to ${cleanPlanName}`,
              entityType: "PAYMENT",
              entityId: subscription.id,
            },
          });
        } catch (dbError) {
          console.error("Subscription webhook database error:", dbError);
          throw dbError;
        }
      }
    } else if (event.type === "subscription.revoked" || event.type === "subscription.canceled") {
      const subscription = event.data;
      const targetAgencyId = subscription.metadata?.agencyId || user.agencyId;

      if (targetAgencyId) {
        try {
          await prisma.subscription.updateMany({
            where: { agencyId: targetAgencyId },
            data: {
              status: "CANCELED",
              canceledAt: new Date(),
            },
          });

          await prisma.agency.update({
            where: { id: targetAgencyId },
            data: {
              activePlan: "basic",
            },
          });

          await prisma.activityLog.create({
            data: {
              agencyId: targetAgencyId,
              action: `Subscription revoked/canceled. Downgraded to basic plan.`,
              entityType: "PAYMENT",
              entityId: subscription.id,
            },
          });
        } catch (dbError) {
          console.error("Subscription cancellation webhook database error:", dbError);
          throw dbError;
        }
      }
    }
  },
});
