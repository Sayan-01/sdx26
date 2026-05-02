import React from "react";
import { getProjectById } from "@server/projects";
import { notFound } from "next/navigation";
import MembersClient from "./_components/members-client";

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProjectById(id);

  if (result.error || !result.project) {
    notFound();
  }

  const project = result.project;
  const members = project.projectMembers;

  return (
    <MembersClient 
      projectId={id} 
      initialMembers={members as any} 
    />
   );
}
