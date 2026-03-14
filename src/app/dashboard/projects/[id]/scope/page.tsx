"use client";

import React from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  MessageSquare,
  BadgeInfo,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Scope Creep Protection</h2>
          <p className="text-zinc-500">Track and manage changes that go beyond the initial project agreement.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2 font-bold">
          <Plus className="h-4 w-4" />
          Log Change Request
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-zinc-900/50 border-blue-500/20 shadow-none overflow-hidden">
        <div className="p-6 flex items-start gap-4">
           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
              <BadgeInfo className="h-5 w-5" />
           </div>
           <div className="space-y-1">
              <h3 className="font-bold">Protect your agency's bottom line.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                Research shows that 75% of agency churn happens due to administrative overhead and undocumented requests. 
                Use this log to categorize requests as "In Scope" or "New Request" to ensure you get paid for your work.
              </p>
           </div>
        </div>
      </Card>

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id} className="bg-zinc-900 border-zinc-800 shadow-none hover:border-zinc-700 transition-colors group">
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-start gap-4 flex-grow">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                    req.type === "new_request" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-emerald-500 transition-colors">{req.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs mt-2 text-zinc-500">
                       <span className="flex items-center gap-1"><span className="text-zinc-700">•</span> Requested by {req.requestedBy}</span>
                       <span className={cn(
                         "font-bold uppercase tracking-widest",
                         req.type === "new_request" ? "text-amber-500" : "text-emerald-500"
                       )}>
                         {req.type === "new_request" ? "NEW REQUEST" : "IN SCOPE"}
                       </span>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-8 md:text-right">
                  <div className="space-y-1">
                     <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Estimate</p>
                     <p className="text-sm font-bold text-zinc-300">{req.costImpact} / {req.timelineImpact}</p>
                  </div>
                  <div className="space-y-1 min-w-[120px]">
                     <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Status</p>
                     <p className={cn(
                       "text-sm font-bold",
                       req.status === "approved" ? "text-emerald-500" : 
                       req.status === "rejected" ? "text-rose-500" : 
                       "text-amber-500"
                     )}>
                       {req.status === "pending_review" ? "Pending Review" : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                     </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white">
                     <ArrowRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-8 border border-zinc-800 border-dashed rounded-[32px] flex flex-col items-center justify-center text-center space-y-4 bg-zinc-950/50">
         <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
            <DollarSign className="h-6 w-6" />
         </div>
         <div className="space-y-1">
            <h3 className="font-bold">Avoid Human API Syndrome</h3>
            <p className="text-sm text-zinc-500 max-w-sm">Every logged decision is an audit trail that protects your time and sanity.</p>
         </div>
         <Button variant="link" className="text-zinc-400 hover:text-white font-bold">Download Full Scope History</Button>
      </div>
    </div>
  );
}
