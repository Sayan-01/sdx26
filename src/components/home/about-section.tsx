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
    <section className="relative overflow-hidden bg-surface border-b border-border">
      {/* Elegant grid background pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"
      />

      <div className="container-page relative py-24 md:py-32 z-10">
        <div className="mx-auto max-w-2xl flex flex-col items-center">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl text-center">
            Built by agency owners,
            <br />
            <Italic>for agency owners.</Italic>
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg text-center">
            <p>
              We started Milestack because we were tired of the "email chaos." We saw too many talented designers and developers losing sleep over missed feedback, delayed payments, and clients who
              felt out of the loop.
            </p>
            <p>Our mission is to help agencies reclaim their time and provide a world-class experience to their clients. Professional work deserves a professional workspace.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
