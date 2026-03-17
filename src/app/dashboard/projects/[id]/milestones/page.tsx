"use client";

import React from "react";
import { Plus, MoreVertical, Calendar, DollarSign, CheckCircle2, MessageSquare, ChevronDown, FileBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MilestonesPage() {
  const milestones = [
    {
      id: 1,
      title: "Discovery & Wireframing",
      status: "paid",
      amount: 500,
      date: "Mar 10, 2026",
      desc: "Requirement gathering, user personas, and low-fidelity wireframes for all pages.",
      progress: 100,
    },
    {
      id: 2,
      title: "UI Design Phase",
      status: "in_review",
      amount: 1500,
      date: "Mar 25, 2026",
      desc: "High-fidelity mockups, design system, and interactive prototype in Figma.",
      progress: 80,
    },
    {
      id: 3,
      title: "Frontend Development",
      status: "in_progress",
      amount: 2000,
      date: "Apr 15, 2026",
      desc: "Conversion of designs to clean, modular React/Next.js components.",
      progress: 15,
    },
    {
      id: 4,
      title: "Launch & SEO",
      status: "pending",
      amount: 500,
      date: "Apr 30, 2026",
      desc: "Deployment, finalized content, and search engine optimization setup.",
      progress: 0,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Milestones & Payments</h2>
          <p className="text-sm text-zinc-400">Track project stages, deliverables, and financial progress.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 px-6 py-6 hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="space-y-4 flex-grow max-w-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-dashboard-border/50",
                        milestone.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : milestone.status === "in_review"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-zinc-800/50 text-zinc-400",
                      )}
                    >
                      {milestone.status === "paid" ? <CheckCircle2 className="h-5 w-5" /> : milestone.id}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{milestone.title}</h3>
                      <div
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border",
                          milestone.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : milestone.status === "in_review"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : milestone.status === "in_progress"
                                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                        )}
                      >
                        {milestone.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed md:pl-14">{milestone.desc}</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 xl:gap-8 bg-[#19191b] border border-dashboard-border/50 p-4 rounded-xl w-full xl:w-auto">
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 w-full lg:w-auto">
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <DollarSign className="h-3 w-3" /> Amount
                      </p>
                      <p className="text-lg font-bold text-zinc-200">${milestone.amount.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-800 hidden lg:block" />
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> Due Date
                      </p>
                      <p className="text-sm font-semibold text-zinc-300">{milestone.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                     {/* Progress bar */}
                     <div className="w-full lg:w-24 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-medium text-zinc-500">
                          <span>Progress</span>
                          <span className={cn(milestone.progress === 100 ? "text-emerald-500" : "")}>{milestone.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              milestone.status === "paid" ? "bg-emerald-500" :
                              milestone.status === "in_review" ? "bg-amber-500" :
                              "bg-indigo-500"
                            )}
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
