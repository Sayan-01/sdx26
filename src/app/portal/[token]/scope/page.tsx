import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PortalScopeClient, { PortalScopeRequest } from "./portal-scope-client";

export default async function ClientScopePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getClientSession();

  if (!session || session.token !== token) {
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

  const requests = await prisma.changeRequest.findMany({
    where: {
      projectId: project.id,
    },
    include: {
      convertedMilestone: {
        select: {
          id: true,
          title: true,
          status: true,
          amount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PortalScopeClient
      token={token}
      projectId={project.id}
      initialRequests={requests as unknown as PortalScopeRequest[]}
    />
  );
}
