"use client";

import React from "react";
import Italic from "../global/italic";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

const pillars = [
  {
    title: "Single source of truth",
    body: "No more digging through emails or Slack. Every file, approval, and message is attached directly to the project milestone. Your clients know exactly where to go — and so do you.",
  },
  {
    title: "Structured workflows",
    body: "Standardize delivery from kickoff to closeout. Follow a repeatable, clear path that ensures nothing falls through the cracks.",
  },
  {
    title: "Client-facing workspace",
    body: "Give clients a premium, branded portal that makes you look like a top-tier agency. A centralized home for progress, deliverables, and billing.",
  },
  {
    title: "Scope-creep protection",
    body: "Clearly defined deliverables and structured feedback loops mean you only work on what's agreed. Convert out-of-scope requests into new paid milestones instantly.",
  },
];

export default function SolutionSection() {
  return (
    <section className="border-b border-border">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-medium text-zinc-300 tracking-wider uppercase mb-6">
            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-indigo-500/50 bg-indigo-500/10">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            </div>The Solution
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            One structured system to <Italic>rule them all.</Italic>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Milestack replaces your scattered mess of tools with a single,
            professional source of truth for you and your clients.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-[11px] font-semibold tracking-widest text-muted-foreground">
                  0{i + 1}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
