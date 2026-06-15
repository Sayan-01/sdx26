"use client";

import React from "react";
import { 
  LayoutDashboard, 
  ListChecks, 
  FileCheck2, 
  Flag, 
  MessagesSquare, 
  Activity, 
  Users, 
  ShieldCheck 
} from "lucide-react";
import Italic from "../global/italic";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

const capabilities = [
  { icon: LayoutDashboard, title: "Client Dashboard", body: "A centralized command center for every project. Give clients a bird's-eye view without sharing internal task boards." },
  { icon: ListChecks, title: "Onboarding Checklist", body: "Collect logos, brand guidelines, and copy without endless back-and-forth. Clients know exactly what you need and when." },
  { icon: FileCheck2, title: "File Approval System", body: "Upload designs or documents and get clear 'Approved' or 'Changes Needed' status with versions and audit trails." },
  { icon: Flag, title: "Milestone Tracking", body: "Break projects into clear delivery phases. Link payments to milestones to ensure healthy cashflow throughout." },
  { icon: MessagesSquare, title: "Contextual Messaging", body: "Conversations attached directly to files or milestones, providing instant context for every message." },
  { icon: Activity, title: "Activity Feed", body: "A chronological history of every action. See when a client viewed a file, commented, or made a payment." },
  { icon: Users, title: "Team Collaboration", body: "Assign designers, developers, and PMs. Control who sees what with granular permission settings." },
  { icon: ShieldCheck, title: "Scope-Creep Protection", body: "Clearly defined deliverables make it easy to spot extras. Convert out-of-scope work into new paid milestones instantly." },
];

export default function FeaturesSection() {
  return (
    <section id="capabilities" className="bg-surface border-b border-border">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-medium text-zinc-300 tracking-wider uppercase mb-6">
            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-indigo-500/50 bg-indigo-500/10">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            </div>Capabilities
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            Built for the way <Italic>modern agencies</Italic> work.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Everything you need to manage the client-facing side of your
            business — without the complexity of traditional project management
            tools.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <article key={c.title} className="bg-card p-6 transition-colors hover:bg-card/60">
              <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface-2">
                <c.icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display text-[15px] font-semibold text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
