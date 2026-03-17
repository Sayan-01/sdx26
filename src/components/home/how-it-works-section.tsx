import React from "react";
import Wrapper from "@/components/design/wrapper";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    { title: "Invite Collaborators", desc: "Add your team and invite clients via branded Magic Links. No clunky signups required." },
    { title: "Set Milestones", desc: "Define clear project stages, deliverables, timelines, and payment targets." },
    { title: "Streamline Delivery", desc: "Upload files for approval, handle feedback in context, and track versions flawlessly." },
    { title: "Track & Scale", desc: "Monitor activity, manage scope creep, and get paid faster. Scale your agency with confidence." }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative bg-zinc-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Simplicity scaling <br/>
                <span className="text-zinc-500">every project.</span>
              </h2>
              <p className="text-lg text-zinc-400 font-medium max-w-xl">
                We replaced five different tools with one seamless, linear workflow designed specifically for client service businesses.
              </p>
            </div>
            
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={i} className="group relative flex gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                  <div className="shrink-0 w-12 h-12 rounded-full border border-white/10 bg-zinc-900/50 flex items-center justify-center font-bold text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300 shadow-inner">
                    {i+1}
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="font-bold text-xl text-zinc-100 group-hover:text-indigo-50 transition-colors">{s.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative perspective-[1000px]">
             {/* Decorative glow behind UI block */}
             <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full" />
             
             {/* Mock UI Block */}
             <div className="relative p-8 rounded-[2rem] border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl transform rotate-1 md:rotate-2 hover:rotate-0 transition-transform duration-500 ease-out group ring-1 ring-white/5">
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                   <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-40 bg-zinc-200 rounded-md" />
                        <div className="h-3 w-24 bg-zinc-500 rounded-md" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs flex items-center gap-1.5 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        APPROVED
                      </div>
                   </div>
                   
                   {/* Image Mock Placeholder */}
                   <div className="h-48 w-full bg-linear-to-br from-indigo-500/10 to-purple-500/5 rounded-xl border border-white/5 relative overflow-hidden group-hover:border-indigo-500/30 transition-colors duration-500 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center blur-sm absolute" />
                     <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
                   </div>
                   
                   <div className="space-y-3">
                      <div className="h-3 w-full bg-zinc-800 rounded-md" />
                      <div className="h-3 w-5/6 bg-zinc-800 rounded-md" />
                      <div className="h-3 w-4/6 bg-zinc-800 rounded-md" />
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex -space-x-3">
                        <div className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-indigo-500/20" />
                        <div className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-rose-500/20" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 transition-colors">
                        View Details <ChevronRight className="w-3 h-3" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
