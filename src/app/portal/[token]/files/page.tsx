import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PortalFilesClient from "./portal-files-client";

import { getPortalFilesByProjectId } from "@server/projects";

export default async function ClientFilesPage({ params }: { params: Promise<{ token: string }> }) {
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

  const result = await getPortalFilesByProjectId(project.id, session.agencyId);
  const rawFiles = result.files || [];

  return <PortalFilesClient token={token} rawFiles={rawFiles as any} />;
}
