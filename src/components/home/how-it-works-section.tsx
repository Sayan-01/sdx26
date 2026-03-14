import React from "react";
import Wrapper from "@/components/design/wrapper";

export default function HowItWorksSection() {
  const steps = [
    { title: "Invite Collaborators", desc: "Add your team and invite clients via branded Magic Links." },
    { title: "Set Milestones", desc: "Define project stages, deliverables, and payment targets." },
    { title: "Streamline Delivery", desc: "Upload files for approval and handle feedback in context." },
    { title: "Track & Scale", desc: "Monitor activity across all clients and grow your agency." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-zinc-900/20">
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Simplify every project.</h2>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-6">
                  <div className="shrink-0 w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                    {i+1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-zinc-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-full bg-white/5 blur-[100px] absolute inset-0 -z-10" />
             <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                   <div className="w-3 h-3 rounded-full bg-zinc-700" />
                   <div className="w-3 h-3 rounded-full bg-zinc-700" />
                   <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-zinc-800 rounded" />
                      <div className="h-6 w-20 bg-emerald-500/10 text-emerald-500 rounded text-[10px] flex items-center justify-center font-bold">APPROVED</div>
                   </div>
                   <div className="h-40 w-full bg-zinc-800/50 rounded-xl animate-pulse" />
                   <div className="space-y-2">
                      <div className="h-3 w-full bg-zinc-800 rounded" />
                      <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                   </div>
                   <div className="flex gap-2 pt-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-800" />
                      <div className="h-8 flex-grow bg-zinc-800 rounded" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
