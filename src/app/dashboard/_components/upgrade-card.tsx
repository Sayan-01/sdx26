import React from "react";
import { X, ArrowUpRight } from "lucide-react";

const UpgradeCard = ({ credits }: { credits: number }) => {
  const isUpgraded = credits > 1;

  if (isUpgraded) {
    return (
      <div className="relative border border-dashboard-border bg-[#111113] rounded-2xl p-5 mb-4 group hover:border-dashboard-border/80 transition-colors">
        <div className="flex items-center justify-between mb-3.5">
          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-medium px-2 py-0.5 rounded-lg">
            Active
          </span>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <h3 className="text-[15px] font-medium text-zinc-100 mb-1.5 tracking-tight">
          Your Plan is Active
        </h3>
        <p className="text-[13px] text-zinc-400 mb-4 leading-relaxed pr-2">
          You are currently using {credits} out of 1000 credits. Enjoy full access to AI tools.
        </p>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-200 bg-transparent hover:bg-zinc-800 border border-white/10 px-3 py-1.5 rounded-xl transition-colors">
          View details <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative border border-dashboard-border rounded-2xl p-3 mb-4 group hover:border-dashboard-border/80 transition-colors">
      <div className="flex items-center justify-between mb-3.5">
        <span className="bg-emerald-500/10 text-emerald-500 text-xs font-medium px-2 py-0.5 rounded-lg">
          New
        </span>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <h3 className="text-[15px]  text-zinc-100 mb-1.5 tracking-tight">
        Upgrade to Agency
      </h3>
      <p className="text-[13px] text-zinc-400 mb-4 leading-relaxed pr-2">
        Upgrade to our Agency plan and get access to all features with zero overhead
      </p>
      <button className="flex items-center gap-1.5 text-[13px]  text-zinc-200 bg-transparent hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors">
        Try it out <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default UpgradeCard;
