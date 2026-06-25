"use client";

import React from "react";
import Italic from "../global/italic";
import Eyebrow from "../global/Eyebrow";

const workflow = [
  { title: "Invite Client", body: "Send a secure magic link to your client. No passwords to remember — just instant access to their portal." },
  { title: "Collect Assets", body: "Automate onboarding. Milestack chases logos, copy, and credentials so you can start working faster." },
  { title: "Deliver & Approve", body: "Share work in structured milestones. Get clear feedback and one-click approvals that build an audit trail." },
  { title: "Get Paid", body: "Link invoices to milestones. Clients pay directly through the portal as soon as work is approved." },
];

export default function HowItWorksSection() {
  return (
    <section id="workflow" className="border-b border-border">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Workflow</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            Simple, structured, <Italic>effective.</Italic>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Stop guessing where things stand. Milestack provides a clear path
            from kickoff to final payment for every project.
          </p>
        </div>

        <div className="relative mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {workflow.map((w, i) => (
            <div key={w.title} className="relative bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface-2 font-display text-[11px] font-semibold text-foreground">
                  {i + 1}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                {w.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
