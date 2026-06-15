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

export default function AboutSection() {
  return (
    <section className="bg-surface border-b border-border">
      <div className="container-page py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              Built by agency owners,
              <br />
              <Italic>for agency owners.</Italic>
            </h2>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                We started Milestack because we were tired of the "email chaos."
                We saw too many talented designers and developers losing sleep
                over missed feedback, delayed payments, and clients who felt
                out of the loop.
              </p>
              <p>
                Our mission is to help agencies reclaim their time and provide a
                world-class experience to their clients. Professional work
                deserves a professional workspace.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <p className="font-display text-lg font-medium leading-snug text-foreground">
                Join 500+ agencies building the future of client collaboration.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { v: "500+", l: "Agencies" },
                  { v: "10k+", l: "Projects" },
                  { v: "99.9%", l: "Uptime" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl font-semibold tracking-tight text-foreground">
                      {s.v}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
