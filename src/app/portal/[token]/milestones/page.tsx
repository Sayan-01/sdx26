import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PortalMilestonesClient from "./portal-milestones-client";

export default async function ClientMilestonesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
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
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      milestones: {
        include: {
          payments: true,
          tasks: {
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          messages: {
            include: {
              senderUser: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  role: true,
                },
              },
              senderClient: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!project) {
    redirect(`/portal/${token}`);
  }

  return (
    <PortalMilestonesClient
      initialMilestones={project.milestones as any}
      token={token}
      clientInfo={project.client}
    />
  );
}
