import React from "react";
import { CheckCircle2, Clock, DollarSign, Calendar, Milestone as MilestoneIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { format } from "date-fns";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import PortalMilestonesClient from "./portal-milestones-client";

export default async function ClientMilestonesPage({ params }: { params: Promise<{ token: string }> }) {
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
    include: {
      milestones: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!project) {
    redirect(`/portal/${token}`);
  }

  return <PortalMilestonesClient initialMilestones={project.milestones} token={token} />;
}
