import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, ShieldCheck, Clock, MessageSquare, Wallet } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Multi-Client Dashboard",
      desc: "See all active clients and projects in one organized view. Status at a glance."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Onboarding Checklist",
      desc: "Automatically request logos, guidelines, and access. Track per-item approval status."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Approval System",
      desc: "Version history for every deliverable. No more 'v2_final_ACTUAL' confusion."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Milestone Tracking",
      desc: "Structured stages with linked payments, files, and contextual messaging."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Contextual Messaging",
      desc: "Threaded chat attached to specific milestones or files. No general inbox clutter."
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Payment Tracking",
      desc: "Link milestone approvals to payments. Manual or integrated Stripe tracking."
    }
  ];

  return (
    <section id="features" className="py-24">
      <Wrapper>
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold">Built for how agencies actually work.</h2>
              <p className="text-zinc-400">
                A single platform where Agency Owners, Team Members, and Clients collaborate with role-based access.
              </p>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900">
                See all features
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-all">
                  {f.icon}
                </div>
                <h3 className="mt-6 font-bold text-xl">{f.title}</h3>
                <p className="mt-3 text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
