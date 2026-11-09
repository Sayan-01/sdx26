"use client";

import React, { useState } from "react";
import { Check, Copy, CreditCard, Sparkles } from "lucide-react";
import Italic from "../global/italic";
import { toast } from "sonner";

export default function BetaPricingNotice() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("4242424242424242");
    setCopied(true);
    toast.success("Demo card number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-14 ">
      <div className="relative overflow-hidden rounded-[24px] border border-purple-500/30 bg-card/75 p-6 shadow-elevated backdrop-blur-xl sm:p-8 bg-linear-to-br from-purple-950/25 via-card/90 to-transparent">
        {/* Subtle decorative grid matching hero/CTA sections */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.25] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_80%)] grid-bg"
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center justify-between">
          {/* Brand Announcement Message */}
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
                </span>
                Public Beta
              </div>
              <span className="text-xs font-medium text-muted-foreground">• Early Access Period</span>
            </div>

            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              All plans are <Italic className="text-purple-400">100% free</Italic> during beta.
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-[14.5px]">
              We are currently in <span className="font-semibold text-foreground">active beta testing</span>, so early access to all our tiers is completely free! Choose any plan below that fits your
              agency and use test <span className="font-semibold text-foreground">card details</span> to activate your full workspace at{" "}
              <span className="font-semibold text-foreground">zero cost</span>.
            </p>
          </div>

          {/* Test Card Credentials Box */}
          <div className="relative">
            <div className="rounded-2xl border border-purple-400/50 shadow-elevated bg-linear-to-bl from-purple-600/20 via-transparent to-transparent p-4 backdrop-blur-md aspect-16/10 lg:h-[240px]">
              <div className="flex items-center justify-between border-b border-purple-400/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                    <CreditCard className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-foreground">Demo Card Credentials</span>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-left">
                <div className="col-span-2 rounded-xl p-2.5">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Card Number</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold tracking-widest text-foreground select-all">4242 4242 4242 4242</span>
                  </div>
                </div>

                <div className="rounded-xl p-2.5 col-span-1">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Expires</div>
                  <div className="mt-1 font-mono text-xs font-medium text-foreground select-all">
                    <span className="max-sm:hidden">Any future date </span>(12/28)
                  </div>
                </div>

                <div className="p-2.5">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">CVC</div>
                  <div className="mt-1 font-mono text-xs font-semibold text-purple-300 select-all">123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

