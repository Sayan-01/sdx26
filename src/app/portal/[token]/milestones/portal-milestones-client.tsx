"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, DollarSign, Calendar, Milestone as MilestoneIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { Card, CardContent } from "@/components/ui/card";

type PortalMilestonesClientProps = {
  initialMilestones: any[];
  token: string;
};

export default function PortalMilestonesClient({ initialMilestones, token }: PortalMilestonesClientProps) {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [isLoading, setIsLoading] = useState(false);

  const paidAmount = milestones.filter((m) => m.status === "PAID").reduce((acc, m) => acc + (m.amount || 0), 0);
  const completedCount = milestones.filter((m) => m.status === "APPROVED" || m.status === "PAID").length;
  const percentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const stats = [
    { label: "Completion", value: `${percentage}%`, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Received", value: `$${paidAmount.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Phases", value: milestones.length.toString(), icon: <MilestoneIcon className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Current Step", value: `${completedCount + 1}`, icon: <Calendar className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeading
          title="Project Roadmap"
          description="Track the progress of your project phases, review milestones, and manage pending payments."
        />
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-[#19191b] border-dashboard-border/50 overflow-hidden group hover:border-dashboard-border transition-colors"
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
                {isLoading ? <div className="h-6 w-12 bg-zinc-800/50 rounded animate-pulse mt-1" /> : <p className="text-xl font-bold text-white">{stat.value}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCard
        title="Development Phases"
        icon={<MilestoneIcon className="h-4 w-4 text-indigo-400" />}
        extra={
          <span className="text-[10px] font-bold text-zinc-500 bg-[#151518] px-3 py-1.5 rounded-full border border-dashboard-border uppercase">
            Step {completedCount} of {milestones.length}
          </span>
        }
        className="h-full w-full"
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto box">
          {milestones.length > 0 ? (
            milestones.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-zinc-900/50 transition-colors group",
                  m.status === "PENDING" && i > completedCount && "opacity-40 grayscale-[0.5]",
                )}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                      m.status === "PAID" || m.status === "APPROVED"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : i === completedCount
                          ? "bg-indigo-500 border-indigo-400 text-white animate-pulse"
                          : "bg-zinc-900 border-zinc-800 text-zinc-600",
                    )}
                  >
                    {m.status === "PAID" || m.status === "APPROVED" ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{m.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {m.dueDate ? format(new Date(m.dueDate), "MMM dd, yyyy") : "TBD"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="flex items-center gap-1.5 text-zinc-400">${m.amount?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-18 sm:pl-0 mt-2 sm:mt-0">
                  <div
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      m.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : m.status === "IN_REVIEW"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700",
                    )}
                  >
                    {m.status.replace("_", " ")}
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-800 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                <MilestoneIcon className="h-8 w-8" />
              </div>
              <p className="text-zinc-500 text-xs font-medium">No milestones defined for this project yet.</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
