"use client";

import React from "react";
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ChevronDown,
  FileBox,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      progress: 100
    },
    { 
      id: 2, 
      title: "UI Design Phase", 
      status: "in_review", 
      amount: 1500, 
      date: "Mar 25, 2026",
      desc: "High-fidelity mockups, design system, and interactive prototype in Figma.",
      progress: 80
    },
    { 
      id: 3, 
      title: "Frontend Development", 
      status: "in_progress", 
      amount: 2000, 
      date: "Apr 15, 2026",
      desc: "Conversion of designs to clean, modular React/Next.js components.",
      progress: 15
    },
    { 
      id: 4, 
      title: "Launch & SEO", 
      status: "pending", 
      amount: 500, 
      date: "Apr 30, 2026",
      desc: "Deployment, finalized content, and search engine optimization setup.",
      progress: 0
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Milestones & Payments</h2>
          <p className="text-zinc-500">Track project stages, deliverables, and financial progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 gap-2">
            <Layout className="h-4 w-4" />
            Timeline View
          </Button>
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className={cn(
            "bg-zinc-900/50 border-zinc-800 shadow-none overflow-hidden hover:border-zinc-700 transition-all",
            milestone.status === "in_review" && "border-amber-500/30 bg-amber-500/5"
          )}>
            <div className="p-6">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 flex-grow max-w-2xl">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                          milestone.status === "paid" ? "bg-emerald-500 text-zinc-950" :
                          milestone.status === "in_review" ? "bg-amber-500 text-zinc-950" :
                          "bg-zinc-800 text-zinc-500"
                        )}>
                          {milestone.id}
                        </div>
                        <h3 className="text-xl font-bold">{milestone.title}</h3>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border",
                          milestone.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          milestone.status === "in_review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          milestone.status === "in_progress" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          "bg-zinc-800 text-zinc-500 border-zinc-700"
                        )}>
                          {milestone.status.replace("_", " ")}
                        </div>
                     </div>
                     <p className="text-sm text-zinc-400 leading-relaxed">{milestone.desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 lg:text-right">
                     <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Amount</p>
                        <p className="text-lg font-bold flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-zinc-500" />
                          {milestone.amount.toLocaleString()}
                        </p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Due Date</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-zinc-500" />
                           {milestone.date}
                        </p>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="border-zinc-800 hover:bg-zinc-800 h-10 w-10">
                           <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-zinc-800 hover:bg-zinc-800 h-10 w-10">
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow max-w-md space-y-2">
                     <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-zinc-300 font-medium">{milestone.progress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            milestone.status === "paid" ? "bg-emerald-500" : "bg-blue-500"
                          )}
                          style={{ width: `${milestone.progress}%` }}
                        />
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-2">
                        {[1, 2].map((i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold">
                              {i === 1 ? "JD" : "SR"}
                           </div>
                        ))}
                     </div>
                     <div className="h-4 w-[1px] bg-zinc-800" />
                     <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <FileBox className="h-3 w-3" />
                        3 Files
                     </div>
                     <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white group">
                        Details <ChevronDown className="h-4 w-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
                     </Button>
                  </div>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
