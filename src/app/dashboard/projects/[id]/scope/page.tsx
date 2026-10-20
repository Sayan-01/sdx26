import React from "react";
import { getProjectScopeRequests } from "@server/scope";
import ScopeClient, { ScopeRequestItem } from "./scope-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ScopeLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProjectScopeRequests(id);

  if (result.error || !result.requests) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center max-w-md p-6 bg-[#151518] border border-dashboard-border rounded-xl">
          <h2 className="text-xl font-semibold text-white">Access Notice</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {result.error || "Unable to load scope log for this project."}
          </p>
          <Link href={`/dashboard/projects/${id}`}>
            <Button className="mt-6 bg-white text-zinc-950 hover:bg-zinc-200 text-xs">
              Back to Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScopeClient
      projectId={id}
      initialRequests={result.requests as unknown as ScopeRequestItem[]}
    />
  );
}
