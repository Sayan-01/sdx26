import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListChecks, ShieldCheck, Route, MessageSquareDot, CreditCard, ArrowRight } from "lucide-react";
import Wrapper from "@/components/design/wrapper";
import { Playfair } from "next/font/google";

const play = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export default function FeaturesSection() {
  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Multi-Client Engine",
      desc: "Monitor all your active clients and projects in one beautiful, organized view with real-time status updates.",
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400",
    },
    {
      icon: <ListChecks className="h-6 w-6" />,
      title: "Automated Onboarding",
      desc: "Stop hunting for logos. Create elegant checklists for brand assets with per-item approval tracking.",
      color: "from-emerald-500/20 to-teal-500/20 text-teal-400",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Bulletproof Approvals",
      desc: "Eliminate version confusion. Every deliverable has a clear audit trail and unmistakable approval status.",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      icon: <Route className="h-6 w-6" />,
      title: "Milestone Roadmaps",
      desc: "Break projects into structured stages linked directly to deliverables, client payments, and contextual discussions.",
      color: "from-rose-500/20 to-pink-500/20 text-rose-400",
    },
    {
      icon: <MessageSquareDot className="h-6 w-6" />,
      title: "Contextual Threads",
      desc: "No more disorganized inboxes. All client communication happens exactly where the work does—attached to files and milestones.",
      color: "from-violet-500/20 to-purple-500/20 text-violet-400",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Seamless Payments",
      desc: "Link your milestone approvals directly to payout requests. Integrated tracking keeps cashflow healthy.",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-400",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 md:py-32 relative bg-zinc-950"
    >
      <Wrapper>
        <div className="space-y-16 relative z-10">
          <div className="text-center space-y-2 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Powerful Capabilities
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tight text-white italic! ${play.className}`}>
              Built for the way <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-rose-400">agencies actually work.</span>
            </h2>
            <p className="text-lg text-zinc-400 font-medium">A gorgeous, single platform where Agency Owners, Team Members, and Clients collaborate effortlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-[2rem] border border-white/5 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-linear-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className={`${f.color.split(" ").pop()} transition-colors`}>{f.icon}</div>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-3 group-hover:text-indigo-100 transition-colors">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium group-hover:text-zinc-300 transition-colors">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
