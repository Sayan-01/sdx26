"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Upload, 
  AlertCircle,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [items, setItems] = useState([
    { id: 1, label: "Agency Logo", status: "approved", file: "logo_v1.svg", date: "Mar 10" },
    { id: 2, label: "Brand Guidelines", status: "uploaded", file: "brand_book.pdf", date: "Mar 12" },
    { id: 3, label: "Hosting Access", status: "pending", file: null, date: null },
    { id: 4, label: "Domain Access", status: "pending", file: null, date: null },
    { id: 5, label: "Website Content", status: "pending", file: null, date: null },
    { id: 6, label: "Images & Assets", status: "approved", file: "assets_zip.zip", date: "Mar 08" },
  ]);

  const stats = {
    total: items.length,
    approved: items.filter(i => i.status === "approved").length,
    pending: items.filter(i => i.status === "pending").length,
    uploaded: items.filter(i => i.status === "uploaded").length,
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Onboarding Checklist</h2>
          <p className="text-zinc-500">Manage required assets and client homework.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400 font-medium">Progress</span>
            <span className="text-sm font-bold">{Math.round((stats.approved / stats.total) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(stats.approved / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex gap-6 mt-4">
             <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">{stats.approved} Approved</span>
             </div>
             <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-zinc-400">{stats.uploaded} Waiting for Review</span>
             </div>
             <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-zinc-400">{stats.pending} Pending Client</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "group p-4 rounded-xl border transition-all flex items-center justify-between",
              item.status === "approved" ? "bg-emerald-500/5 border-emerald-500/20" : 
              item.status === "uploaded" ? "bg-amber-500/5 border-amber-500/20" : 
              "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                item.status === "approved" ? "bg-emerald-500 text-zinc-950" : 
                item.status === "uploaded" ? "bg-amber-500 text-zinc-950" : 
                "border border-zinc-700 text-zinc-700"
              )}>
                {item.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : 
                 item.status === "uploaded" ? <Clock className="h-4 w-4" /> : 
                 <Circle className="h-4 w-4" />}
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  item.status === "approved" ? "text-emerald-500" : "text-zinc-200"
                )}>
                  {item.label}
                </h3>
                {item.file && (
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2 underline decoration-zinc-800 underline-offset-2 hover:text-zinc-300 transition-colors cursor-pointer">
                    <Upload className="h-3 w-3" />
                    {item.file} ({item.date})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
               {item.status === "uploaded" && (
                 <div className="flex gap-2 mr-4">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 h-8 font-bold">Approve</Button>
                    <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-zinc-300 h-8">Request Revision</Button>
                 </div>
               )}
               <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white group-hover:bg-zinc-800/50">
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
