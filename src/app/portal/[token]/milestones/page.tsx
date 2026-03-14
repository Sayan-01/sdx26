"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  FileBox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ClientMilestonesPage() {
  const milestones = [
    { 
      id: 1, 
      title: "Discovery & Wireframing", 
      status: "paid", 
      amount: 500, 
      date: "Mar 10, 2026",
      completed: true
    },
    { 
      id: 2, 
      title: "UI Design Phase", 
      status: "in_review", 
      amount: 1500, 
      date: "Mar 25, 2026",
      completed: false,
      active: true
    },
    { 
      id: 3, 
      title: "Frontend Development", 
      status: "pending", 
      amount: 2000, 
      date: "Apr 15, 2026",
      completed: false
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="max-w-xl space-y-3">
            <h1 className="text-3xl font-bold">Project Progress</h1>
            <p className="text-zinc-500 text-lg leading-relaxed">
               Tracks your project through structured milestones. Review deliverables and approve stages to keep the momentum going.
            </p>
         </div>
         <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 flex items-center gap-6">
            <div className="text-center space-y-1">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Completion</p>
               <p className="text-2xl font-bold">45%</p>
            </div>
            <div className="w-[1px] h-10 bg-zinc-800" />
            <div className="text-center space-y-1">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Paid</p>
               <p className="text-2xl font-bold text-emerald-500">$500</p>
            </div>
         </div>
      </div>

      <div className="relative space-y-8">
         {/* Vertical line connector */}
         <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/20 to-zinc-800 -z-10" />

         {milestones.map((m, i) => (
           <div key={m.id} className="relative pl-16">
              {/* Node */}
              <div className={cn(
                "absolute left-2 top-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-zinc-950 transition-all",
                m.completed ? "bg-emerald-500 text-zinc-950" : 
                m.active ? "bg-zinc-900 border-zinc-800 text-emerald-500 animate-pulse" : 
                "bg-zinc-900 border-zinc-800 text-zinc-700"
              )}>
                 {m.completed ? <CheckCircle2 className="h-5 w-5" /> : 
                  m.active ? <Clock className="h-5 w-5" /> : 
                  <span className="text-sm font-bold">{i+1}</span>}
              </div>

              <Card className={cn(
                "shadow-none overflow-hidden transition-all duration-500",
                m.active ? "bg-zinc-900 border-zinc-700 scale-[1.02]" : 
                m.completed ? "bg-zinc-900/40 border-zinc-800/50" : 
                "bg-transparent border-zinc-900 opacity-60"
              )}>
                 <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                       <div className="space-y-4 flex-grow">
                          <div className="flex items-center gap-4">
                             <h3 className="text-2xl font-bold">{m.title}</h3>
                             <div className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                               m.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                               m.status === "in_review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                               "bg-zinc-800 text-zinc-500 border-zinc-700"
                             )}>
                               {m.status.replace("_", " ")}
                             </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6">
                             <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                <Calendar className="h-4 w-4" />
                                {m.date}
                             </div>
                             <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                <DollarSign className="h-4 w-4" />
                                ${m.amount.toLocaleString()}
                             </div>
                             {m.active && (
                                <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                                   <FileBox className="h-4 w-4" />
                                   Files ready for review
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="flex items-center gap-4">
                          {m.active && (
                            <>
                              <Button variant="outline" className="h-12 px-6 border-zinc-800 hover:bg-zinc-800 gap-2 font-bold">
                                 <MessageSquare className="h-4 w-4" />
                                 Discuss
                              </Button>
                              <Link href={`/portal/token/milestones/${m.id}`}>
                                <Button className="h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 font-bold gap-2 group">
                                   Review & Approve
                                   <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </>
                          )}
                          {m.status === "approved" && (
                             <Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold gap-2">
                                <DollarSign className="h-4 w-4" />
                                Pay Milestone
                             </Button>
                          )}
                          {m.completed && (
                             <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm uppercase tracking-widest px-4 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                <CheckCircle2 className="h-4 w-4" />
                                Stage Complete
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
         ))}
      </div>
    </div>
  );
}
