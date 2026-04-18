"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-zinc-950">
      {/* Background Image/Visual */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/download.avif"
          alt="Milestack Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient Overlay to blend with dark mode */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/50 to-zinc-950" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-transparent to-zinc-950" />
      </div>

      {/* Glow Effects (Inspired by the provided image) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-40" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-[100%] pointer-events-none" />

      <Wrapper>
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-xs font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>
            <span>Milestack is now in Early Access</span>
            <ArrowRight className="w-3 h-3 ml-1 text-zinc-500" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The Professional Workspace Where Agencies and Clients <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-indigo-400 to-purple-400">Stay Aligned.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            Stop losing projects to email threads and &quot;final_v2&quot; chaos. Milestack centralizes your onboarding, approvals, and milestone payments into one branded portal your clients will actually love to use.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-zinc-950 hover:bg-zinc-200 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Get Early Access
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 rounded-full transition-all">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trusted By / Social Proof */}
          <div className="mt-20 pt-10 border-t border-white/5 w-full flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-700">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Trusted by modern agencies worldwide</span>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale contrast-125">
              {/* Placeholder logos - representing modern tech companies style */}
              <div className="text-2xl font-bold text-white tracking-tighter">LINEAR</div>
              <div className="text-2xl font-bold text-white tracking-tighter italic">STRIPE</div>
              <div className="text-2xl font-bold text-white tracking-tighter">NOTION</div>
              <div className="text-2xl font-bold text-white tracking-tighter opacity-80">VERCEL</div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
