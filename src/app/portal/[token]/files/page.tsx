"use client";

import React, { useState } from "react";
import { FileBox, Download, Eye, History, Search, Filter, ArrowUpRight, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";

export default function ClientFilesPage() {
  const [files] = useState([
    { 
      id: 1, 
      name: "Homepage_Design_Final.png", 
      type: "image/png", 
      size: "4.2 MB", 
      version: 3, 
      status: "approved", 
      at: "2h ago",
      milestone: "UI Design Phase",
      category: "Design"
    },
    { 
      id: 2, 
      name: "User_Flow_v2.pdf", 
      type: "application/pdf", 
      size: "1.2 MB", 
      version: 2, 
      status: "under_review", 
      at: "1d ago",
      milestone: "UX Strategy",
      category: "Strategy"
    },
    { 
      id: 3, 
      name: "Brand_Assets_Pack.zip", 
      type: "application/zip", 
      size: "15.5 MB", 
      version: 1, 
      status: "approved", 
      at: "3d ago",
      milestone: "Brand Identity",
      category: "Assets"
    },
  ]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading 
          title="Project Deliverables" 
          description="Review and download the latest assets shared by your project team." 
        />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
             <Input 
               placeholder="Search assets..." 
               className="h-10 pl-9 bg-[#151518] border-dashboard-border rounded-xl focus-visible:ring-indigo-500/20 text-xs"
             />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-dashboard-border bg-[#151518] text-zinc-500">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border border-dashboard-border rounded-xl bg-[#19191b] overflow-hidden flex-1">
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <h2 className="text-md font-semibold flex items-center gap-2">Files & Assets</h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#151518] px-3 py-1 rounded-full border border-dashboard-border">
            {files.length} Resources
          </span>
        </div>

        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden p-0 border-0 border-t border-dashboard-border rounded-none">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto box">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex w-full hover:bg-zinc-900/50 transition-colors group px-6 min-h-[95px] items-center border-b border-dashboard-border last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-11 h-11 rounded-xl border border-dashboard-border/50 flex items-center justify-center transition-all duration-300 shrink-0",
                      file.status === "approved" ? "bg-emerald-500/5 text-emerald-500" : "bg-blue-500/5 text-blue-500"
                    )}>
                      <FileBox className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base tracking-tight leading-tight">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                        <span>v{file.version}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="text-zinc-600">{file.milestone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-16 sm:pl-0">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-24 h-7 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        file.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {file.status.replace("_", " ")}
                      </div>
                      
                      <div className="flex items-center gap-1.5 border-l border-dashboard-border pl-3 ml-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                            <Eye className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                            <Download className="h-4 w-4" />
                         </Button>
                         <Button size="sm" className="h-8 px-4 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-lg shadow-sm text-[10px] uppercase tracking-wider ml-2">
                            Review
                         </Button>
                      </div>
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
