import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PortalPaymentsClient from "./portal-payments-client";

export default async function ClientPaymentsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getClientSession();

  if (!session) {
    redirect(`/portal/${token}`);
  }

  const project = await prisma.project.findFirst({
    where: {
      id: session.projectId,
      agencyId: session.agencyId,
      clientId: session.clientId,
    },
  });

  if (!project) {
    redirect(`/portal/${token}`);
  }

  const milestones = await prisma.milestone.findMany({
    where: {
      projectId: project.id,
      agencyId: session.agencyId,
      amount: { gt: 0 }
    },
    include: {
      payments: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  const formattedInvoices = milestones.map(m => {
    const payment = m.payments;
    return {
      id: payment?.id || m.id,
      milestoneId: m.id,
      invoiceId: payment ? `INV-${payment.id.substring(0, 8).toUpperCase()}` : `EST-${m.id.substring(0, 8).toUpperCase()}`,
      title: m.title,
      status: payment?.status || (m.status === "PAID" ? "PAID" : "PENDING"),
      amount: m.amount,
      date: payment?.createdAt || m.createdAt,
      due: (!payment || payment.status !== "PAID") && m.dueDate ? "Due soon" : undefined,
      method: payment?.paymentMethod || undefined,
      invoiceUrl: payment?.invoiceUrl || undefined,
    };
  });

  return <PortalPaymentsClient token={token} invoices={formattedInvoices} />;
}
