"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import Italic from "../global/italic";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

const plans = [
  {
    name: "Starter",
    desc: "Perfect for solo freelancers managing few clients.",
    price: "$49",
    cadence: "/month",
    features: ["Up to 5 active projects", "Unlimited clients", "1GB storage", "Standard branding", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    desc: "Ideal for growing agencies with a small team.",
    price: "$99",
    cadence: "/month",
    features: ["Unlimited active projects", "Unlimited clients", "20GB storage", "Custom domain (White-label)", "Priority support", "Team collaboration (5 seats)"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "For large agencies requiring scale and security.",
    price: "Custom",
    cadence: "",
    features: ["Everything in Pro", "Unlimited storage", "SAML / SSO", "Dedicated account manager", "Custom contract & billing", "On-premise options"],
    cta: "Get Started",
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            Simple, transparent pricing.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Choose the plan that fits your agency's scale. No hidden fees.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-[24px] border p-8 bg-card/60 ${
                p.popular
                  ? "border-purple-400/50 shadow-elevated bg-linear-to-bl from-purple-600/20 via-transparent to-transparent"
                  : "border-border/80 shadow-soft bg-linear-to-tr from-slate-600/10 via-transparent to-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {p.name}
                </h3>
                {p.popular && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    MOST POPULAR
                  </div>
                )}
              </div>
              
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground min-h-[40px]">
                {p.desc}
              </p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold tracking-tight text-foreground">
                  {p.price}
                </span>
                {p.cadence && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {p.cadence}
                  </span>
                )}
              </div>
              
              <Link
                href="#cta"
                className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-px ${
                  p.popular
                    ? "bg-foreground text-background shadow-lg shadow-white/5"
                    : "border border-border/80 bg-surface text-foreground hover:bg-surface-2"
                }`}
              >
                {p.cta}
              </Link>
              
              <div className="mt-8 h-px bg-border" />
              
              <ul className="mt-6 space-y-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent mt-0.5">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </div>
                    <span className="text-[14px] leading-snug text-muted-foreground font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

