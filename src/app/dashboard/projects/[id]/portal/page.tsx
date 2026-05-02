import React from "react";
import PortalClient from "./_components/portal-client";
import { getLatestMagicLink } from "@server/projects";

export default async function ProjectPortalManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch the latest active magic link
  const result = await getLatestMagicLink(id);
  
  const initialPortalUrl = result.success ? result.portalUrl : null;

  return (
    <PortalClient projectId={id} initialPortalUrl={initialPortalUrl || null} />
  );
}
