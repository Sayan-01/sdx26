"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  FileBox,
  MessageSquare,
  Users,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  text: string;
  type?: string;
  time: string | Date;
}

interface ActivityLogProps {
  activities?: ActivityItem[];
  className?: string;
  title?: string;
}

export function ActivityLog({
  activities = [],
  className,
  title = "Recent Activity",
}: ActivityLogProps) {
  let hasOverflow = activities?.length >= 5;

  const getActivityConfig = (type: string = "") => {
    const normalized = type.toLowerCase();
    switch (normalized) {
      case "file":
      case "upload":
        return {
          icon: <FileBox className="h-3.5 w-3.5" />,
          color: "text-sky-400",
          bg: "bg-sky-500/10",
          border: "border-sky-500/20",
        };
      case "payment":
      case "invoice":
        return {
          icon: <DollarSign className="h-3.5 w-3.5" />,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        };
      case "approval":
      case "milestone":
        return {
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
        };
      case "team":
      case "member":
      case "user":
        return {
          icon: <Users className="h-3.5 w-3.5" />,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        };
      case "message":
      case "comment":
        return {
          icon: <MessageSquare className="h-3.5 w-3.5" />,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
        };
      default:
        return {
          icon: <Activity className="h-3.5 w-3.5" />,
          color: "text-zinc-400",
          bg: "bg-zinc-800/80",
          border: "border-zinc-700/50",
        };
    }
  };

  const formatTime = (time: string | Date) => {
    try {
      const date = new Date(time);
      if (isNaN(date.getTime())) return "Recently";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <section
      aria-label="Activity Feed"
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-dashboard-border bg-[#19191b] relative", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashboard-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </span>
          <h2 className="text-sm font-medium tracking-tight text-zinc-200">{title}</h2>
          {activities.length > 0 && (
            <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[11px] font-medium tabular-nums text-zinc-400">{activities.length}</span>
          )}
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group/btn h-6.5 gap-1 px-2.5 text-xs text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <Link href="/dashboard/activity">
            View all
            <ArrowUpRight className="h-3 w-3 text-zinc-500 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white" />
          </Link>
        </Button>
      </div>

      {/* Feed List */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {activities.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-500 shadow-inner">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-zinc-300">No activity yet today</p>
            <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-zinc-500">New events and updates from your team will appear here in real time.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <ul className="space-y-1">
                {activities.map((item) => {
                  const config = getActivityConfig(item.type);
                  return (
                    <li
                      key={item.id}
                      className="group flex items-start gap-3 rounded-lg p-2.5 transition-all duration-150 hover:bg-white/[0.03]"
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105",
                          config.bg,
                          config.border,
                          config.color,
                        )}
                      >
                        {config.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-snug text-zinc-300 transition-colors group-hover:text-zinc-100 line-clamp-2">{item.text}</p>
                        <time
                          dateTime={typeof item.time === "string" ? item.time : item.time.toISOString()}
                          className="mt-1 block text-[11px] font-normal tabular-nums text-zinc-500"
                        >
                          {formatTime(item.time)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Subtle bottom fade hint for smooth overflow effect */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#19191b] to-transparent"
            />
          </>
        )}
      </div>
      {hasOverflow && (
        <>
          {/* Fade hint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24  bg-gradient-to-t from-[#151518] via-[#151518ba] to-transparent"
          />

          {/* "More today" pill: a plain anchor scrolls the feed to its last item, no JS needed */}
          <a
            href="#activity-end"
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300 shadow-lg backdrop-blur transition-colors hover:text-white"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            More activity today
            <ArrowDown className="h-3 w-3" />
          </a>
        </>
      )}
    </section>
  );
}

export default ActivityLog;
