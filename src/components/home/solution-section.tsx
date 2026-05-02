"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { CheckCircle2, Zap, Layout, ShieldCheck } from "lucide-react";

const SolutionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  className = "", 
  accentColor = "bg-purple-500/10",
  iconColor = "text-purple-400"
}: { 
  title: string; 
  description: string; 
  icon: any; 
  className?: string;
  accentColor?: string;
  iconColor?: string;
}) => (
  <div className={`group relative p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 overflow-hidden transition-all duration-500 hover:bg-zinc-900/40 hover:border-indigo-500/30 ${className}`}>
    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl ${accentColor} flex items-center justify-center mb-6 shadow-lg border border-white/5`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-base">{description}</p>
    </div>
    
    {/* Abstract visual elements */}
    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default function SolutionSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950">
      {/* Decorative lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-purple-500/50 to-transparent" />
      
      <Wrapper>
        <div className="flex flex-col items-center mb-16">
          <div className="px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
            The Solution
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white text-center max-w-4xl tracking-tight leading-tight">
            One structured system to <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">rule them all.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-400 text-center max-w-2xl">
            Milestack replaces your scattered mess of tools with a single, professional source of truth for you and your clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <SolutionCard 
            className="md:col-span-8"
            icon={CheckCircle2}
            accentColor="bg-emerald-500/10"
            iconColor="text-emerald-400"
            title="Single Source of Truth"
            description="No more digging through emails or Slack. Every file, approval, and message is exactly where it belongs—attached to the project milestone. Your clients know exactly where to go, and so do you."
          />
          <SolutionCard 
            className="md:col-span-4"
            icon={Zap}
            accentColor="bg-amber-500/10"
            iconColor="text-amber-400"
            title="Structured Workflows"
            description="Standardize your delivery process. From onboarding to final sign-off, follow a repeatable path that ensures nothing falls through the cracks."
          />
          <SolutionCard 
            className="md:col-span-5"
            icon={Layout}
            accentColor="bg-blue-500/10"
            iconColor="text-blue-400"
            title="Client-Facing Workspace"
            description="Give your clients a premium experience. A clean, branded portal that makes you look like a top-tier agency, even if you're a team of one."
          />
          <SolutionCard 
            className="md:col-span-7"
            icon={ShieldCheck}
            accentColor="bg-indigo-500/10"
            iconColor="text-indigo-400"
            title="Scope Creep Protection"
            description="Clearly defined milestones and structured feedback loops mean you only work on what's agreed upon. Track extra requests as new milestones with linked payments."
          />
        </div>
      </Wrapper>
    </section>
  );
}
