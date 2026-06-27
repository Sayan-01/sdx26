"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Italic from "../global/italic";
import Eyebrow from "../global/Eyebrow";


export default function CTASection() {
  return (
    <section id="cta" className="border-b border-border bg-surface">
      <div className="container-page py-24 md:py-32">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary p-10 text-primary-foreground md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <Eyebrow className={"text-primary-foreground/70 border-purple-400 bg-purple-400/10"}>
              Get started
            </Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
              Stop managing clients across 10 tools.
              <br />
              Start using <Italic className="text-black">Milestack.</Italic>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg">
              Join the elite agencies who've centralized their collaboration and
              reclaimed their focus. Early-access seats are limited.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-elevated transition-transform hover:-translate-y-px"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-white/10"
              >
                Book a Demo
              </Link>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/60">
              No credit card required · 14-day free trial · Setup in 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
