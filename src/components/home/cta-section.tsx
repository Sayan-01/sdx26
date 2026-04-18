"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <Wrapper>
        <div className="relative p-12 md:p-20 rounded-[3rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl overflow-hidden flex flex-col items-center text-center">
          {/* Decorative mesh */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight max-w-3xl leading-tight relative z-10">
            Stop managing clients across <span className="text-zinc-500">10 tools.</span> <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Start using Milestack.</span>
          </h2>
          
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl relative z-10">
            Join the elite agencies who have centralized their collaboration and reclaimed their focus. Early access seats are limited.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-zinc-950 hover:bg-zinc-200 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] group">
                Get Early Access <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-zinc-500 text-sm font-medium flex items-center gap-6 opacity-60">
            <span>No credit card required</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span>14-day free trial</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span>Setup in 2 minutes</span>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
