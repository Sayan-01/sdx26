import React from "react";
import { Button } from "@/components/ui/button";
import { getMilestonesByProjectId } from "@server/projects";
import Link from "next/link";
import MilestonesClient from "./milestones-client";

export default async function MilestonesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getMilestonesByProjectId(id);

  if (result.error || !result.milestones) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center max-w-md p-6 bg-[#151518] border border-dashboard-border rounded-xl">
          <h2 className="text-xl font-semibold text-white">Access Notice</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {result.error || "Unable to load milestones for this project."}
          </p>
          <Link href={`/dashboard/projects/${id}`}>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              Back to Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { milestones, userRole, teamMembers, currentUserId } = result;

  return (
    <MilestonesClient
      projectId={id}
      initialMilestones={milestones as any}
      userRole={userRole as any}
      teamMembers={teamMembers || []}
      currentUserId={currentUserId || ""}
    />
  );
}
