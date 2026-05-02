import React from "react";
import { getFilesByProjectId, getProjectById } from "@server/projects";
import { notFound } from "next/navigation";
import FilesClient from "./_components/files-client";

export default async function FilesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
    const result = await getFilesByProjectId(id);
  
    if (result.error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">Error: {result.error}</div>
        </div>
      );
    }
  
    const rawFiles = result.files || [];

  return (
    <FilesClient
      projectId={id}
      rawFiles={rawFiles as any}
    />
  );
}
