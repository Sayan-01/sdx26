import React from "react";
import { Plus, MoreVertical, Calendar, DollarSign, CheckCircle2, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getMilestonesByProjectId } from "@server/projects";
import { format } from "date-fns";
import Link from "next/link";
import { AddMilestoneButton } from "./add-milestone-button";

export default async function MilestonesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getMilestonesByProjectId(id);

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Error</h2>
          <p className="text-zinc-500 mt-2">{result.error}</p>
          <Link href={`/dashboard/projects/${id}`}>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">Back to Project</Button>
          </Link>
        </div>
      </div>
    );
  }

  const milestones = result.milestones || [];

  const getProgress = (status: string) => {
    switch (status) {
      case "PAID":
      case "APPROVED":
        return 100;
      case "IN_REVIEW":
        return 80;
      case "IN_PROGRESS":
        return 30;
      case "PENDING":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Milestones & Payments</h2>
          <p className="text-sm text-zinc-400">Track project stages, deliverables, and financial progress.</p>
        </div>
        <AddMilestoneButton projectId={id} />
      </div>

      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
            {milestones.length > 0 ? (
              milestones.map((milestone, i) => {
                const progress = getProgress(milestone.status);
                const isPaid = milestone.status === "PAID";
                const isInReview = milestone.status === "IN_REVIEW";
                const isInProgress = milestone.status === "IN_PROGRESS";

                return (
                  <div
                    key={milestone.id}
                    className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 px-6 py-6 hover:bg-zinc-900/50 transition-colors group border-b"
                  >
                    <div className="space-y-4 flex-grow max-w-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-dashboard-border/50",
                            isPaid ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : isInReview ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-zinc-800/50 text-zinc-400",
                          )}
                        >
                          {isPaid ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{milestone.title}</h3>
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border",
                              isPaid
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : isInReview
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : isInProgress
                                    ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                    : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                            )}
                          >
                            {milestone.status.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed md:pl-14">{milestone.description || "No description provided."}</p>
                    </div>

                    <div className="grid grid-cols-3  bg-[#19191b] border border-dashboard-border/50 p-4 rounded-xl w-full xl:w-auto">
                      <div className="col-span-2 flex flex-wrap lg:flex-nowrap items-center gap-6 w-full lg:w-auto">
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" /> Amount
                          </p>
                          <p className="text-lg font-bold text-zinc-200">${milestone.amount?.toLocaleString() || "0"}</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-800 hidden lg:block" />
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" /> Due Date
                          </p>
                          <p className="text-sm font-semibold text-zinc-300">{milestone.dueDate ? format(new Date(milestone.dueDate), "MMM dd, yyyy") : "No date set"}</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-800 hidden lg:block" />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                        {/* Progress bar */}
                        <div className="w-full lg:w-24 space-y-1.5">
                          <div className="flex justify-between text-[10px] font-medium text-zinc-500">
                            <span>Progress</span>
                            <span className={cn(progress === 100 ? "text-emerald-500" : "")}>{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-500", isPaid ? "bg-emerald-500" : isInReview ? "bg-amber-500" : "bg-indigo-500")}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg bg-zinc-800"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg bg-zinc-800"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-dashboard-border/50">
                  <Plus className="h-8 w-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No milestones yet</h3>
                <p className="text-zinc-500 max-w-sm mb-8 text-sm">Add project milestones to track progress, deliverables and handle client payments efficiently.</p>
                <AddMilestoneButton projectId={id} label="Create First Milestone" variant="primary" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
