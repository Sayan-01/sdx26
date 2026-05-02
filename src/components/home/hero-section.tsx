
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, LayoutDashboard, Users, CheckCircle, BarChart3 } from "lucide-react";
import Wrapper from "@/components/design/wrapper";
import { auth } from "../../../auth";

export default async function HeroSection() {
  const session = await auth();
  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none top-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse [animation-duration:10s]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Soft dark gradient mask over the image */}
        <div className="absolute inset-0 bg-gradient-to-b bg-black/50 z-10" />
        <Image
          src="/download.avif"
          alt="Milestack Background"
          fill
          className="object-cover w-full z-0 mix-blend-luminosity"
          priority
        />
      </div>

      <Wrapper>
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto pt-8">
          {/* Premium Badge */}
          <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 hover:bg-white/10 transition-all cursor-pointer">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-purple-500/50 bg-purple-500/10">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
            <span className="relative flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Milestack is now in Early Access
            </span>
            <ArrowRight className="w-3 h-3 ml-1 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[86px] font-light tracking-tighter leading-[1.05] text-white mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Client Collaboration <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-blue-400 itali9 pr-2">
              Reimagined
            </span>{" "}
            for Agencies.
          </h1>

          <p className=" md:text-lg text-zinc-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 font-light">
            Milestack helps agencies manage client projects, collect assets, share deliverables, gather feedback, and track milestones seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <Link href={session?.user ? "/dashboard" : "/auth/register"}>
              <Button className="relative h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 rounded-full transition-all hover:scale-105 group overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                <span className="relative z-10 flex items-center text-base font-semibold">
                  Your Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                className="h-12 px-8 border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 rounded-full transition-all hover:border-white/20 text-base font-medium"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </Wrapper>

      {/* Removed Hero Visual Mockup as requested */}
    </section>
  );
}
