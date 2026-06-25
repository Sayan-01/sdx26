"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Check, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Page = () => {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncPlan = async () => {
      try {
        const res = await fetch("/api/agency/plan");
        const data = await res.json();
        console.log(data);

        await update({ activePlan: data.activePlan });
      } catch (err) {
        console.error("Failed to sync plan:", err);
      } finally {
        setLoading(false);
      }
    };

    syncPlan();
  }, []);
  const planName = session?.user?.activePlan;


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] px-4 selection_color">
      {/* Premium ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(120,119,198,0.11),transparent)]" />
      <div className="absolute -top-[40%] left-[50%] h-[600px] w-[600px] -translate-x-[50%] rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px] transition-all duration-500">
        <div className="overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/20 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl animate-in fade-in duration-500">
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              {/* Loading Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-indigo-300 uppercase">
                <Loader2 className="h-3 w-3 animate-spin" />
                Activating Upgrade
              </div>

              {/* Pulsing Loading Circle */}
              <div className="relative mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 shadow-lg shadow-indigo-500/5">
                <div
                  className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping opacity-60"
                  style={{ animationDuration: "3s" }}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-indigo-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">Updating your account...</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">Please wait while we sync your subscription and update plan limits.</p>

              {/* Order / Account Details Card Placeholder */}
              <div className="mt-6 w-full rounded-2xl border border-zinc-900 bg-zinc-950/80 p-4 text-left">
                <div className="flex items-center justify-between text-xs border-b border-zinc-900/60 pb-3">
                  <span className="text-zinc-500 font-medium uppercase tracking-wider">Account</span>
                  <span className="text-zinc-400 font-mono truncate max-w-[200px]">
                    {session?.user?.email || "Guest"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-3">
                  <span className="text-zinc-500 font-medium uppercase tracking-wider">Current Plan</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-500 animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin text-zinc-550" />
                    Upgrading...
                  </span>
                </div>
              </div>

              {/* Disabled Actions Placeholder */}
              <div className="mt-8 w-full">
                <Button
                  disabled
                  className="w-full bg-zinc-900/60 border border-zinc-900 text-zinc-500 font-bold transition-all duration-300 rounded-xl h-11"
                >
                  <span className="flex items-center justify-center gap-2">
                    Preparing Dashboard
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500">
              {/* Success Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-purple-300 uppercase">
                <Sparkles className="h-3 w-3" />
                Payment Verified
              </div>

              {/* Animated Success Checkmark */}
              <div className="relative mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                <div
                  className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping opacity-60"
                  style={{ animationDuration: "3s" }}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black animate-in zoom-in duration-300 delay-200">
                  <Check className="h-6 w-6 stroke-[3px]" />
                </div>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">You're good to go!</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">Thank you for your purchase. Your subscription has been successfully processed.</p>

              {/* Order / Account Details Card */}
              <div className="mt-6 w-full rounded-2xl border border-zinc-900 bg-zinc-950/80 p-4 text-left">
                <div className="flex items-center justify-between text-xs border-b border-zinc-900/60 pb-3">
                  <span className="text-zinc-500 font-medium uppercase tracking-wider">Account</span>
                  <span
                    className="text-zinc-300 font-mono truncate max-w-[200px]"
                    title={session?.user?.email || ""}
                  >
                    {session?.user?.email || "Guest"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-3">
                  <span className="text-zinc-500 font-medium uppercase tracking-wider">Current Plan</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-purple-400">
                    <CreditCard className="h-3.5 w-3.5" />
                    {planName}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 w-full">
                <Button
                  asChild
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold transition-all duration-300 shadow-xl shadow-white/5 cursor-pointer rounded-xl h-11"
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    Enter Dashboard
                    <ArrowRight className="h-4 w-4 animate-in slide-in-from-left-1 duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
