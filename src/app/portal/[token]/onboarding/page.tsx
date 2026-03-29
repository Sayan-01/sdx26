import React from "react";
import { getPortalOnboardingItems } from "@server/onboarding";
import PortalOnboardingClient from "./portal-onboarding-client";

export default async function ClientOnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getPortalOnboardingItems();

  if (result.error || !result.items) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>{result.error || "Failed to load onboarding items"}</p>
      </div>
    );
  }

  return <PortalOnboardingClient initialItems={result.items} token={token} />;
}

