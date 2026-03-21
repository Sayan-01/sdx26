"use client";

import React from "react";
import { CheckCircle2, Clock, DollarSign, Calendar, MessageSquare, ChevronRight, TrendingUp, Layers, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";

export default function ClientMilestonesPage() {
  const { token } = useParams();
  const milestones = [
    {
      id: 1,
      title: "Discovery & Strategy",
      status: "paid",
      amount: 500,
      date: "Mar 10, 2026",
      completed: true,
      active: false
    },
    {
      id: 2,
      title: "UI Design Phase",
      status: "in_review",
      amount: 1500,
      date: "Mar 25, 2026",
      completed: false,
      active: true,
    },
    {
      id: 3,
      title: "Full Development",
      status: "pending",
      amount: 2000,
      date: "Apr 15, 2026",
      completed: false,
      active: false
    },
  ];

  const paidAmount = milestones.filter(m => m.status === "paid").reduce((acc, m) => acc + m.amount, 0);
  const percentage = Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100);

  const stats = [
    { label: "Completion", value: `${percentage}%`, icon: <TrendingUp className="h-4 w-4" />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Paid to Date", value: `$${paidAmount.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Phase", value: "UI Design", icon: <Layers className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Next Due", value: "Mar 25", icon: <Calendar className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading 
          title="Project Roadmap" 
          description="Track your project through every phase of development and design." 
        />
        <Button variant="outline" className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 text-zinc-400 hover:text-white gap-2 font-medium">
           <MessageSquare className="h-4 w-4" />
           Project Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-none bg-[#151518] hover:bg-zinc-900/70 transition-colors border-dashboard-border group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors uppercase tracking-widest">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 border border-dashboard-border rounded-xl bg-[#19191b] overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <h2 className="text-md font-semibold flex items-center gap-2">Development Phases</h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#151518] px-3 py-1 rounded-full border border-dashboard-border">
            Step {milestones.filter(m => m.completed).length + 1} of {milestones.length}
          </span>
        </div>

        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden p-0 border-0 border-t border-dashboard-border rounded-none">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto box">
            {milestones.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "flex w-full hover:bg-zinc-900/50 transition-colors group px-6 min-h-[95px] items-center border-b border-dashboard-border last:border-0",
                  !m.active && !m.completed && "opacity-50 grayscale"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-11 h-11 rounded-full border border-dashboard-border flex items-center justify-center transition-all duration-300 shrink-0",
                      m.completed ? "bg-emerald-500 text-zinc-950" : 
                      m.active ? "bg-indigo-500 text-white animate-pulse shadow-indigo-500/20 shadow-lg" : 
                      "bg-zinc-800/40 text-zinc-600"
                    )}>
                      {m.completed ? <CheckCircle2 className="h-5 w-5" /> : 
                       m.active ? <Clock className="h-5 w-5" /> : 
                       <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-semibold transition-colors text-sm sm:text-base tracking-tight",
                        m.active ? "text-indigo-400 group-hover:text-white" : "text-zinc-200 group-hover:text-white"
                      )}>
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {m.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> ${m.amount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-16 sm:pl-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-24 h-7 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        m.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                        m.status === "in_review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-zinc-800/50 text-zinc-500 border-dashboard-border/50"
                      )}>
                        {m.status.replace("_", " ")}
                      </div>
                      
                      {m.active && (
                        <Link href={`/portal/${token}/milestones/${m.id}`}>
                           <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold px-4 h-8 rounded-lg shadow-sm transition-all active:scale-95 text-[10px] uppercase tracking-wider">
                              Review
                              <ArrowUpRight className="ml-1.5 h-3 w-3" />
                           </Button>
                        </Link>
                      )}
                      
                      {!m.active && (
                        <ChevronRight className="h-4 w-4 text-zinc-800 group-hover:text-zinc-500 transition-colors" />
                      )}
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
