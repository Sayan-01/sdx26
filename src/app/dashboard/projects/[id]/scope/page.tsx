"use client";

import React from "react";
import { 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  BadgeInfo,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ScopeLogPage() {
  const requests = [
    { 
      id: 1, 
      title: "Add Dark Mode toggle to Header", 
      requestedBy: "Client", 
      type: "new_request", 
      status: "pending_review", 
      costImpact: "$200", 
      timelineImpact: "+2 days" 
    },
    { 
      id: 2, 
      title: "Update contact form fields", 
      requestedBy: "Client", 
      type: "in_scope", 
      status: "approved", 
      costImpact: "$0", 
      timelineImpact: "None" 
    },
    { 
      id: 3, 
      title: "Social media login integration", 
      requestedBy: "Client", 
      type: "new_request", 
      status: "rejected", 
      costImpact: "$500", 
      timelineImpact: "+5 days" 
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Scope Log</h2>
          <p className="text-sm text-zinc-400">Track and manage changes that go beyond the initial project agreement.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
          <Plus className="h-4 w-4" />
          Log Change Request
        </Button>
      </div>

      {/* Premium Info Card */}
      <Card className="bg-[#19191b] border-dashboard-border rounded-xl">
        <div className="p-5 flex flex-col sm:flex-row items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
              <BadgeInfo className="h-5 w-5" />
           </div>
           <div className="space-y-1 lg:max-w-3xl">
              <h3 className="text-base font-bold text-zinc-200">Protect your agency's bottom line</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Research shows that 75% of agency churn happens due to administrative overhead. 
                Use this log to categorize requests as <span className="text-emerald-500 font-semibold px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 ml-1">In Scope</span> or <span className="text-amber-500 font-semibold px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 mx-1">New Request</span> to ensure you get paid for your work.
              </p>
           </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
            {requests.map((req) => (
              <div key={req.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 px-5 py-4 hover:bg-zinc-900/50 transition-colors">
                 
                 <div className="flex items-start md:items-center gap-4 flex-grow w-full">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      req.type === "new_request" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{req.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5 py-0.5">
                            By <span className="text-zinc-300">{req.requestedBy}</span>
                         </span>
                         <span className="text-zinc-700">•</span>
                         <span className={cn(
                           req.type === "new_request" ? "text-amber-500" : "text-emerald-500"
                         )}>
                           {req.type === "new_request" ? "NEW REQUEST" : "IN SCOPE"}
                         </span>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-row md:flex-nowrap items-center gap-6 xl:gap-8 md:text-right w-full md:w-auto mt-2 md:mt-0 px-14 md:px-0">
                    <div className="space-y-0.5">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Estimate</p>
                       <p className="text-sm font-bold text-zinc-200">{req.costImpact} <span className="text-zinc-600 font-normal mx-0.5">/</span> <span className="text-zinc-400">{req.timelineImpact}</span></p>
                    </div>
                    <div className="w-px h-6 bg-zinc-800 hidden md:block" />
                    <div className="space-y-0.5">
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Status</p>
                       <p className={cn(
                         "text-xs font-bold flex items-center gap-1.5 md:justify-end",
                         req.status === "approved" ? "text-emerald-500" : 
                         req.status === "rejected" ? "text-rose-500" : 
                         "text-indigo-500"
                       )}>
                         {req.status === "pending_review" ? "Pending Review" : req.status.charAt(0).toUpperCase() + req.status.slice(1).replace("_", " ")}
                       </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 md:ml-1 hover:text-white hover:bg-zinc-800 rounded-lg hidden md:flex">
                       <ArrowRight className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
