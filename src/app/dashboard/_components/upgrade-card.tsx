import React from "react";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";

interface UpgradeCardProps {
  activePlan?: string;
}

const UpgradeCard = ({ activePlan = "basic" }: UpgradeCardProps) => {
  const isUpgraded = activePlan.toLowerCase() !== "basic";

  if (isUpgraded) {
    return (
      <div className="relative border border-dashboard-border  rounded-2xl p-3 mb-4 group hover:border-dashboard-border/80 transition-colors">
        <div className="flex items-center justify-between mb-3.5">
          <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded-lg">Active</span>
        </div>
        <h3 className="text-[20px] text-zinc-100 mb-1.5 font-display ">{activePlan.toUpperCase()} Plan</h3>
        <p className="text-[13px] text-zinc-400 mb-4 leading-relaxed pr-2">Your agency is subscribed to the {activePlan} plan. Enjoy full access to your workspace.</p>
        <Link href="/#pricing">
          <button className="flex items-center gap-1.5 text-[13px]  text-zinc-200 bg-transparent hover:bg-zinc-800 border border-white/10 px-3 py-1.5 rounded-xl transition-all duration-300">
            Manage Plan{" "}
            <ArrowUpRight
              className="h-3.5 w-3.5"
              strokeWidth={1.5}
            />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative border border-dashboard-border rounded-2xl p-3 mb-4 group hover:border-dashboard-border/80 transition-colors">
      <div className="flex items-center justify-between mb-3.5">
        <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded-lg">Basic</span>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <X
            className="h-4 w-4"
            strokeWidth={1.5}
          />
        </button>
      </div>
      <h3 className="text-[15px] text-zinc-100 mb-1.5 tracking-tight">Upgrade to Premium</h3>
      <p className="text-[13px] text-zinc-400 mb-4 leading-relaxed pr-2">Unlock projects, team seats, and file storage by upgrading to a starter or pro plan.</p>
      <Link href="/#pricing">
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-950 bg-white hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-all duration-300">
          View Plans{" "}
          <ArrowUpRight
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
          />
        </button>
      </Link>
    </div>
  );
};

export default UpgradeCard;
