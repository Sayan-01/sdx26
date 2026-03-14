import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
      <Wrapper>
        <div className="flex flex-col items-center text-center mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-300 animate-in fade-in slide-in-from-bottom-3 duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            New: Client Approval Versioning
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-6xl font-bold tracking-tight">
            The Professional Workspace Where Agencies and Clients Stay Aligned.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
            Stop losing projects to email threads and "final_v2" chaos. Milestack centralizes your onboarding, approvals, and milestone payments into one branded portal.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg bg-white text-zinc-950 hover:bg-zinc-200">
                Start for free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-zinc-800 hover:bg-zinc-900">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-16 w-full relative">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-zinc-800 to-transparent opacity-20 blur-xl" />
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden aspect-video group">
              {/* Mock Dashboard UI */}
              <div className="w-full h-full p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zinc-800" />
                    <div className="space-y-1">
                      <div className="w-32 h-3 bg-zinc-800 rounded" />
                      <div className="w-20 h-2 bg-zinc-800/50 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 grow">
                  <div className="col-span-2 space-y-4">
                    <div className="w-full h-40 rounded-xl bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors flex items-center justify-center">
                      <LayoutDashboard className="h-10 w-10 text-zinc-700" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 rounded-xl bg-zinc-800/30" />
                      <div className="flex-1 h-32 rounded-xl bg-zinc-800/30" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full h-full rounded-xl bg-zinc-800/30" />
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" className="gap-2">
                  Explore Interactive Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
