"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Upload, AlertCircle, MoreHorizontal, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    approved: items.filter((i) => i.status === "approved").length,
    pending: items.filter((i) => i.status === "pending").length,
    uploaded: items.filter((i) => i.status === "uploaded").length,
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Onboarding Checklist</h2>
          <p className="text-sm text-zinc-400">Manage required assets and client homework.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 gap-2 font-medium"
          >
            <Play className="h-4 w-4" />
            Send Reminder
          </Button>
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 min-h-0 flex-1">
        {/* Progress Bar Card */}
        <Card className="bg-[#19191b] border-dashboard-border p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Overall Progress</span>
              <div className="text-3xl font-bold text-zinc-200">{Math.round((stats.approved / stats.total) * 100)}%</div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.approved} <span className="text-zinc-500">Approved</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.uploaded} <span className="text-zinc-500">Review</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.pending} <span className="text-zinc-500">Pending</span>
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-[#151518] rounded-full overflow-hidden border border-dashboard-border/50">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(stats.approved / stats.total) * 100}%` }}
            />
          </div>
        </Card>

        {/* Checklist Items */}
        <div className="border border-dashboard-border rounded-xl bg-[#19191b] flex-1 flex flex-col min-h-0">
          <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl">
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 px-6 hover:bg-zinc-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start md:items-center gap-4 relative z-10 w-full group/inner">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashboard-border/50",
                        item.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : item.status === "uploaded"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                      )}
                    >
                      {item.status === "approved" ? <CheckCircle2 className="h-5 w-5" /> : item.status === "uploaded" ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {item.label}
                      </h3>
                      {item.file && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#19191b] border border-dashboard-border/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                          <Upload className="h-3 w-3 text-zinc-500" />
                          <span className="text-[11px] font-medium text-zinc-400">
                            {item.file} <span className="text-zinc-600 ml-0.5">({item.date})</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end md:pl-0">
                    {item.status === "uploaded" && (
                      <div className="flex gap-2 mr-2">
                        <Button
                          size="sm"
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 h-8 px-3 rounded-lg font-medium transition-colors"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-3 rounded-lg font-medium transition-colors"
                        >
                          Request Revision
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
