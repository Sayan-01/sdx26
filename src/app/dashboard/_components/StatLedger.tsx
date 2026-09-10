import React from "react";
import { cn } from "@/lib/utils";

type Stats = {
  activeProjects: number;
  pendingApprovals: number;
  completedMilestones: number;
  pendingPayments: number;
  assignedTasks: number;
};

type Props = {
  stats: Stats;
  isOwner: boolean;
};

const StatLedger = ({ stats, isOwner }: Props) => {
  const items = [
    { label: "Active projects", value: stats.activeProjects.toLocaleString() },
    { label: "Pending approvals", value: stats.pendingApprovals.toLocaleString() },
    { label: "Completed milestones", value: stats.completedMilestones.toLocaleString() },
    isOwner ? { label: "Payment pending", value: `$${stats.pendingPayments.toLocaleString()}`, accent: true } : { label: "Tasks due", value: stats.assignedTasks.toLocaleString() },
  ];

  return (
    <div className="border border-dashboard-border rounded-xl bg-[#19191b] shrink-0 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-zinc-800/70">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn("px-6 py-5", i % 2 === 0 ? "" : "border-l border-zinc-800/70 sm:border-l-0")}
          >
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className={cn("text-3xl tabular-nums mt-1.5", "accent" in item && item.accent ? "text-[#c9a26a]" : "text-zinc-100")}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatLedger;
