"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileBox, 
  ArrowRight,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectOverviewPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Status Column */}
      <div className="lg:col-span-2 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Current Milestone</h2>
          <Card className="bg-zinc-900 border-emerald-500/20 shadow-none overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    Due in 4 days
                  </div>
                  <h3 className="text-2xl font-bold">Phase 2: UI Design Concepts</h3>
                  <p className="text-zinc-400 max-w-lg">
                    Review and approve the initial design system and 3 key page mockups.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1">Status</p>
                  <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                    Client Review
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      {i === 1 ? "JD" : i === 2 ? "MK" : "+"}
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/projects/1/milestones">
                  <Button variant="ghost" className="text-zinc-400 group-hover:text-white transition-colors gap-2">
                    View full milestone <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
           <h2 className="text-xl font-bold px-1">Upcoming Tasks</h2>
           <div className="space-y-3">
              {[
                { title: "Finalize color palette", assignee: "Designer", priority: "High" },
                { title: "Integrate feedback from v1", assignee: "Developer", priority: "Medium" },
                { title: "Prepare for frontend handoff", assignee: "PM", priority: "Low" }
              ].map((task, i) => (
                <div key={i} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded border border-zinc-700 flex-shrink-0" />
                      <span className="text-sm font-medium">{task.title}</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-xs text-zinc-500">{task.assignee}</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.priority === "High" ? "bg-rose-500" : task.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Sidebar/Quick Actions Column */}
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Quick Activity</h2>
          <div className="space-y-6">
            {[
              { time: "1h ago", text: "Mike uploaded Homepage_v3.png", icon: <FileBox className="h-4 w-4" /> },
              { time: "3h ago", text: "Client requested changes on Header", icon: <MessageSquare className="h-4 w-4" /> },
              { time: "5h ago", text: "Acme Corp approved Onboarding Checklist", icon: <CheckCircle2 className="h-4 w-4" /> }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-white">View History</Button>
        </section>

        <section className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
           <h3 className="font-bold flex items-center gap-2">
             <UserPlus className="h-4 w-4" />
             Project Team
           </h3>
           <div className="space-y-3">
              {[
                { name: "John Doe", role: "Owner" },
                { name: "Mike Ross", role: "Lead Designer" },
                { name: "Sarah Connor", role: "Developer" }
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{m.name.charAt(0)}</div>
                   <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-[10px] text-zinc-500">{m.role}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button className="w-full mt-4 bg-zinc-800 text-white hover:bg-zinc-700">Manage Team</Button>
        </section>
      </div>
    </div>
  );
}
