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
import Eyebrow from "../global/Eyebrow";

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
          <Eyebrow>Capabilities</Eyebrow>
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
