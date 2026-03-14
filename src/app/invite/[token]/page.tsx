"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Layers } from "lucide-react";

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const token = params.token;

  useEffect(() => {
    // Simulated token verification
    const timer = setTimeout(() => {
      // Redirect to client onboarding in the portal
      router.push(`/portal/${token}/onboarding`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, token]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 selection_color">
      <div className="space-y-8 flex flex-col items-center animate-in fade-in duration-1000">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Layers className="h-10 w-10" />
        </div>
        
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Verifying your access...</h1>
          <p className="text-zinc-500 max-w-sm">
            We're preparing your project portal. You'll be logged in securely via Magic Link.
          </p>
        </div>

        <div className="flex items-center gap-3 text-emerald-500 font-bold text-sm tracking-widest uppercase">
          <Loader2 className="h-5 w-5 animate-spin" />
          Securing Connection
        </div>
      </div>
    </div>
  );
}
