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
  link?: string;
}

export function ActivityLog({
  activities = [],
  className,
  title = "Recent Activity",
  link = "/dashboard/activity",
}: ActivityLogProps) {
  const hasOverflow = activities?.length >= 5;

  const getActivityConfig = (type: string = "") => {
    const normalized = type.toLowerCase();
    switch (normalized) {
      case "file":
      case "upload":
        return {
          icon: <FileBox className="h-4 w-4" />,
          color: "text-sky-400",
          bg: "bg-sky-500/10",
          border: "border-sky-500/20",
        };
      case "payment":
      case "invoice":
        return {
          icon: <DollarSign className="h-4 w-4" />,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
        };
      case "approval":
      case "milestone":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
        };
      case "team":
      case "member":
      case "user":
        return {
          icon: <Users className="h-4 w-4" />,
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
        };
      case "message":
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
        };
      default:
        return {
          icon: <Activity className="h-4 w-4" />,
          color: "text-zinc-400",
          bg: "bg-zinc-800/60",
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
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#19191b] border border-dashboard-border font-mono",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashboard-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          <h2 className="text-sm font-medium tracking-tight text-zinc-100">{title}</h2>
          {activities.length > 0 && (
            <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-400">
              {activities.length}
            </span>
          )}
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group/btn h-7 gap-1 px-2.5 text-xs font-mono text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <Link href={link}>
            View all
            <ArrowUpRight className="h-3 w-3 text-zinc-500 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white" />
          </Link>
        </Button>
      </div>

      {/* Feed List */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {activities.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center font-mono">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-500 shadow-inner">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-zinc-300">No activity yet</p>
            <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-zinc-500">
              New events and updates will appear here in real time.
            </p>
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
                      className="group flex items-center gap-3.5 rounded-xl p-2.5 transition-all duration-150 hover:bg-white/[0.03]"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
                          config.bg,
                          config.border,
                          config.color
                        )}
                      >
                        {config.icon}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-[13px] leading-snug text-zinc-200 transition-colors group-hover:text-white line-clamp-2">
                          {item.text}
                        </p>
                        <time
                          dateTime={typeof item.time === "string" ? item.time : item.time.toISOString()}
                          className="block text-[11px] tabular-nums text-zinc-500"
                        >
                          {formatTime(item.time)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      {hasOverflow && (
        <>
          {/* Subtle bottom fade hint for smooth overflow effect */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#19191b] via-[#19191b]/80 to-transparent"
          />

          {/* "More activity today" pill */}
          <Link
            href={link}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-800 bg-[#161719]/95 px-3.5 py-1.5 text-xs text-zinc-300 shadow-xl backdrop-blur transition-all hover:border-zinc-700 hover:text-white"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            More activity today
            <ArrowDown className="h-3 w-3 text-zinc-400" />
          </Link>
        </>
      )}
    </section>
  );
}

export default ActivityLog;
