"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { Mail, FileWarning, MessageSquare, Clock, CreditCard } from "lucide-react";

const ProblemCard = ({ 
  title, 
  description, 
  icon: Icon, 
  className = "", 
  iconColor = "text-purple-400" 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  className?: string;
  iconColor?: string;
}) => (
  <div className={`group relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:bg-zinc-900/60 hover:border-purple-500/20 ${className}`}>
    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  </div>
);

export default function ProblemSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <Wrapper>
        <div className="flex flex-col items-center mb-16">
          <div className="px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
            The Chaos
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white text-center max-w-4xl tracking-tight">
            Stop losing projects to the <span className="text-zinc-600">"status quo"</span> chaos.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Bento Grid Layout */}
          <ProblemCard 
            className="md:col-span-3 lg:col-span-4"
            icon={Mail}
            iconColor="text-rose-400"
            title="Lost feedback in email threads"
            description="Searching through 'Re: Re: Feedback' chains is where productivity goes to die. Milestack keeps every conversation tied to the actual deliverable."
          />
          <ProblemCard 
            className="md:col-span-3 lg:col-span-2"
            icon={FileWarning}
            iconColor="text-amber-400"
            title="Final_v2_final_FINAL chaos"
            description="Version control shouldn't be a naming convention. Stop the file hunting nightmare."
          />
          <ProblemCard 
            className="md:col-span-3 lg:col-span-2"
            icon={MessageSquare}
            iconColor="text-blue-400"
            title="Clients messaging everywhere"
            description="WhatsApp, Slack, Email, and LinkedIn. Centralize your communication before you lose your mind."
          />
          <ProblemCard 
            className="md:col-span-3 lg:col-span-2"
            icon={Clock}
            iconColor="text-indigo-400"
            title="Delayed approvals"
            description="Waiting days for a 'looks good' thumb up? Automate the follow-ups and get clear sign-offs."
          />
          <ProblemCard 
            className="md:col-span-6 lg:col-span-2"
            icon={CreditCard}
            iconColor="text-emerald-400"
            title="Manual payment tracking"
            description="Stop asking 'did they pay the deposit yet?'. Link payments to milestones and get paid automatically."
          />
        </div>
      </Wrapper>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-purple-900/10 to-transparent pointer-events-none -z-10" />
    </section>
  );
}
