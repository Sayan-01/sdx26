"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Italic from "../global/italic";
import Eyebrow from "../global/Eyebrow";


export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative border-b border-border bg-surface overflow-hidden"
    >
      {/* Subtle purple background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.22_295_/_0.06),transparent_70%)] blur-[80px]"
      />

      <div className="container-page py-24 md:py-32">
        <div className="relative overflow-hidden bg-white rounded-3xl border border-zinc-200 bg-linear-to-br from-blue-500/50 via-white to-purple-500/50 p-10 text-zinc-900 shadow-elevated md:p-16">
          {/* Elegant grid background pattern fade-in with fixed light opacity */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"
            style={{
              backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <Eyebrow className="border-purple-200 bg-purple-50 text-purple-700 font-semibold">Get started</Eyebrow>

            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
              Stop managing clients across <br />
              10 tools. Start using
              <br /> <Italic className="text-purple-600">Milestack.</Italic>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
              Join the elite agencies who've centralized their collaboration and reclaimed their focus. Early-access seats are limited.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-px hover:shadow-card hover:bg-purple-700"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-6 py-3.5 text-sm font-medium text-zinc-800 transition-all duration-200 hover:bg-zinc-100 hover:border-zinc-300 hover:-translate-y-px"
              >
                Book a Demo
              </Link>
            </div>

            <p className="mt-8 text-xs text-zinc-500 flex items-center justify-center gap-2 flex-wrap">
              <span>No credit card required</span>
              <span className="text-zinc-300">•</span>
              <span>14-day free trial</span>
              <span className="text-zinc-300">•</span>
              <span>Setup in 2 minutes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
