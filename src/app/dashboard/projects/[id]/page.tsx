"use client";

import React from "react";
import { CheckCircle2, Clock, MessageSquare, FileBox, ArrowRight, UserPlus, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectOverviewPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Status Column */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-h-0">
          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center gap-2 px-5 pt-3">
              <Zap className="h-4 w-4 text-emerald-500" />
              <h2 className="text-md font-semibold">Current Milestone</h2>
            </div>

            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-6 rounded-b-xl ">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    Due in 4 days
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white">Phase 2: UI Design Concepts</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                    Review and approve the initial design system and 3 key page mockups. Ensure all feedback is incorporated before moving to development.
                  </p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-[10px] text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Status</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-md text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Client Review
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashboard-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {["JD", "MK"].map((initials, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#151518] flex items-center justify-center text-xs font-medium text-white"
                      >
                        {initials}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-[#151518] flex items-center justify-center text-xs font-medium text-zinc-400">+2</div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">Assigned Team</span>
                </div>
                <Link href="/dashboard/projects/1/milestones">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-500 hover:text-white h-8 group/btn"
                  >
                    View milestone details
                    <ArrowRight className="ml-1.5 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center gap-2 px-5 pt-3">
              <Star className="h-4 w-4 text-blue-500" />
              <h2 className="text-md font-semibold">Upcoming Tasks</h2>
            </div>
            <Card className="bg-[#151518] shadow-none  flex flex-col min-h-0 p-0 rounded-b-xl">
              <div className="divide-y divide-zinc-800/60  box">
                {[
                  { title: "Finalize core color palette", assignee: "Priya (Designer)", priority: "High", icon: "🎨" },
                  { title: "Integrate feedback from v1", assignee: "David (Developer)", priority: "Medium", icon: "🛠️" },
                  { title: "Prepare for frontend handoff", assignee: "Sarah (PM)", priority: "Low", icon: "📦" },
                  { title: "Prepare for frontend handoff", assignee: "Sarah (PM)", priority: "Low", icon: "📦" },
                  { title: "Prepare for frontend handoff", assignee: "Sarah (PM)", priority: "Low", icon: "📦" },
                  { title: "Prepare for frontend handoff", assignee: "Sarah (PM)", priority: "Low", icon: "📦" },
                ].map((task, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center text-lg border border-dashboard-border/50">{task.icon}</div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{task.title}</span>
                        <div className="text-xs text-zinc-500 mt-0.5">{task.assignee}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-dashboard-border/50 bg-zinc-900/50">
                        <div className={cn("w-1.5 h-1.5 rounded-full", task.priority === "High" ? "bg-rose-500" : task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500")} />
                        <span className="text-xs font-medium text-zinc-400">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar/Quick Actions Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center justify-between px-5 pt-3">
              <h2 className="text-md font-semibold">Quick Activity</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-white h-6"
              >
                View All
              </Button>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 rounded-b-xl">
              <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
                {[
                  { time: "1h ago", text: "Mike uploaded Homepage_v3.png", icon: <FileBox className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
                  { time: "3h ago", text: "Client requested changes on Header", icon: <MessageSquare className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
                  { time: "5h ago", text: "Acme Corp approved Onboarding", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", item.bg, item.color)}>{item.icon}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">{item.text}</p>
                      <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center justify-between px-5 pt-3">
              <h2 className="text-md font-semibold flex items-center gap-2">Project Team</h2>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-5 rounded-b-xl">
              <div className="space-y-4">
                {[
                  { name: "John Doe", role: "Owner", roleColor: "text-indigo-500" },
                  { name: "Mike Ross", role: "Lead Designer", roleColor: "text-emerald-500" },
                  { name: "Sarah Connor", role: "Developer", roleColor: "text-blue-500" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 transition-colors group/member"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-dashboard-border/50 flex items-center justify-center text-sm font-medium">{m.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200 group-hover/member:text-white transition-colors">{m.name}</p>
                      <p className={cn("text-xs font-medium mt-0.5", m.roleColor)}>{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 text-xs font-medium border-dashboard-border hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
              >
                Manage Team
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

