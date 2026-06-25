import React from "react";
import { getFilesByProjectId, getProjectById } from "@server/projects";
import { notFound } from "next/navigation";
import FilesClient from "./_components/files-client";

export default async function FilesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getFilesByProjectId(id);
  const projectResult = await getProjectById(id);

  if (result.error || projectResult.error || !projectResult.project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">Error: {result.error || projectResult.error}</div>
      </div>
    );
  }

  const { getAgencyLimits, getAgencyStorageUsed } = await import("@/lib/planLimits");
  const agencyId = projectResult.project.agencyId;
  const limits = await getAgencyLimits(agencyId);
  const storageUsed = await getAgencyStorageUsed(agencyId);

  const rawFiles = result.files || [];

  return (
    <FilesClient
      projectId={id}
      rawFiles={rawFiles as any}
      limits={limits}
      storageUsed={storageUsed}
    />
  );
}
