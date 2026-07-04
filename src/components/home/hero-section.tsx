import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { auth } from "../../../auth";
import Italic from "../global/italic";
import { DashboardMock } from "./dashboard-preview";
import Image from "next/image";

export default async function HeroSection() {
  const session = await auth();

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />
      <div className="container-page relative pt-[56px] pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft transition-colors hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Milestack is now in Early Access
            <ArrowRight className="h-3 w-3" />
          </Link>

          <h1 className="sm:mt-8 mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tighter text-foreground sm:text-6xl md:text-[72px]">
            Client collaboration
            <br />
            <Italic>reimagined</Italic> for agencies.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl sm:text-base text-sm leading-relaxed text-muted-foreground md:text-lg">
            Milestack helps agencies manage client projects, collect assets, share deliverables, gather feedback, and track milestones — all in one professional workspace.
          </p>

          <div className="mt-9 flex flex-row items-center justify-center gap-3 sm:flex-row">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-card transition-transform hover:-translate-y-px"
              >
                <span className="sm:flex hidden">Your </span>Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-card transition-transform hover:-translate-y-px"
              >
                <span className="sm:flex hidden">Get </span>Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="#workflow"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <span className="sm:flex hidden">See </span>How It Works
            </Link>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto mt-24 max-w-5xl md:mt-20">
          <div className="rounded-2xl border border-border bg-card p-2 shadow-elevated">
            <div className="overflow-hidden rounded-xl border border-border/80 bg-surface">
              <Image src="/image.png" alt="hero" width={1000} height={1000} className="w-full object-cover rounded-lg" />
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-20 -bottom-16 -z-10 h-40 bg-[radial-gradient(ellipse_at_center,oklch(0.62_0.18_28_/_0.12),transparent_70%)]"
          />
        </div>
      </div>
    </section>
  );
}
