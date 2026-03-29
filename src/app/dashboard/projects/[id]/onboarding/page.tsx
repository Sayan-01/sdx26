import React from "react";
import { getOnboardingItems } from "@server/onboarding";
import OnboardingClient from "./onboarding-client";

export default async function OnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOnboardingItems(id);

  if (result.error || !result.items) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>{result.error || "Failed to load onboarding items"}</p>
      </div>
    );
  }

  return <OnboardingClient initialItems={result.items} projectId={id} />;
}

