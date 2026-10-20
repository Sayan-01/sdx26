"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, RefreshCw, Search } from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";
import { getActivityLogs, markAllLogsAsRead } from "../../../../server/activity";

type ActivityLog = {
  id: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  createdAt: Date | string;
  isRead: boolean;
  actorUser?: { name: string } | null;
  actorClient?: { name: string } | null;
  project?: { id: string; name: string } | null;
  metadata?: any;
};


type Filter = "All" | "Files" | "Messages" | "Approvals";
type ActivityLevel = "High" | "Medium" | "Low";

const FILTERS: Filter[] = ["All", "Files", "Messages", "Approvals"];
const SURFACE = "rounded-2xl border border-dashboard-border bg-[#131316]";

const getActor = (log: ActivityLog) => log.actorUser?.name || log.actorClient?.name || "Someone";

const getTarget = (log: ActivityLog) => log.metadata?.label || log.metadata?.name || log.metadata?.email || log.entityId || null;

// Raw database IDs (e.g. "cmv99c2vu0003xkbpx49d95xi") are noise to a reader.
// Shorten them and keep the full value in the tooltip.
const isOpaqueId = (value: string) => /^[a-z0-9]{20,}$/i.test(value);
const displayTarget = (value: string) => (isOpaqueId(value) ? `${value.slice(0, 8)}…` : value);

const matchesFilter = (log: ActivityLog, filter: Filter) => {
  const action = log.action ?? "";
  switch (filter) {
    case "Files":
      return log.entityType === "FILE";
    case "Messages":
      return log.entityType === "MESSAGE" || /comment/i.test(action);
    case "Approvals":
      return /approved/i.test(action);
    default:
      return true;
  }
};

const matchesSearch = (log: ActivityLog, term: string) => {
  if (!term) return true;
  const haystack = [log.action, getActor(log), log.project?.name, getTarget(log)].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(term.toLowerCase());
};

const toLevel = (count: number): ActivityLevel => (count > 10 ? "High" : count > 5 ? "Medium" : "Low");

const LEVEL_DOT: Record<ActivityLevel, string> = {
  High: "bg-emerald-400",
  Medium: "bg-amber-400",
  Low: "bg-zinc-600",
};

function groupByDay(logs: ActivityLog[]) {
  const groups = [
    { label: "Today", items: [] as ActivityLog[] },
    { label: "Yesterday", items: [] as ActivityLog[] },
    { label: "Earlier", items: [] as ActivityLog[] },
  ];

  for (const log of logs) {
    const date = new Date(log.createdAt);
    if (isToday(date)) groups[0].items.push(log);
    else if (isYesterday(date)) groups[1].items.push(log);
    else groups[2].items.push(log);
  }

  return groups.filter((group) => group.items.length > 0);
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/5"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ActivityRow({ log }: { log: ActivityLog }) {
  const actor = getActor(log);
  const target = getTarget(log);
  const createdAt = new Date(log.createdAt);

  return (
    <li className={cn("group relative flex gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]", !log.isRead && "bg-blue-500/[0.03] hover:bg-blue-500/[0.05]")}>
      {!log.isRead && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0.5 bg-blue-500"
        />
      )}

      <Avatar name={actor} />

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-6", log.isRead ? "text-zinc-400" : "text-zinc-300")}>
          <span className="font-medium text-zinc-100">{actor}</span> {log.action}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
          {target && (
            <code
              title={target}
              className="max-w-[16rem] truncate rounded-md bg-zinc-800/70 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300"
            >
              {displayTarget(target)}
            </code>
          )}
          {log.project && (
            <span>
              in <span className="text-zinc-300">{log.project.name}</span>
            </span>
          )}
          <span
            aria-hidden
            className="text-zinc-700"
          >
            ·
          </span>
          <time
            dateTime={createdAt.toISOString()}
            title={format(createdAt, "PPpp")}
            className="tabular-nums"
          >
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </time>
        </div>
      </div>

      {!log.isRead && <span className="sr-only">Unread.</span>}
    </li>
  );
}

function FeedSkeleton() {
  return (
    <ul className="divide-y divide-dashboard-border">
      {[0, 1, 2, 3, 4].map((i) => (
        <li
          key={i}
          className="flex gap-4 px-5 py-4"
        >
          <div className="skeleton-shimmer h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="skeleton-shimmer h-3.5 w-3/5 rounded" />
            <div className="skeleton-shimmer h-3 w-1/3 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, meta, children }: { title: string; meta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={cn(SURFACE, "overflow-hidden")}>
      <header className="flex items-center justify-between border-b border-dashboard-border px-5 py-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</h2>
        {meta}
      </header>
      {children}
    </section>
  );
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getActivityLogs();
      if (res.success) setLogs(res.logs as ActivityLog[]);
      else toast.error("Failed to load activity feed");
    } catch {
      toast.error("Error fetching activities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh keeps existing rows on screen; only the icon spins.
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLogs();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllLogsAsRead();
      if (res.success) {
        setLogs((prev) => prev.map((log) => ({ ...log, isRead: true })));
        toast.success("All activities marked as read");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const unreadCount = useMemo(() => logs.filter((l) => !l.isRead).length, [logs]);

  const filterCounts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f, logs.filter((l) => matchesFilter(l, f)).length])) as Record<Filter, number>, [logs]);

  const visibleLogs = useMemo(
    () => logs.filter((log) => matchesFilter(log, activeFilter) && matchesSearch(log, searchTerm)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [logs, activeFilter, searchTerm],
  );

  const sections = useMemo(() => groupByDay(visibleLogs), [visibleLogs]);

  const stats = useMemo(
    () => [
      {
        label: "Files",
        value: logs.filter((l) => l.entityType === "FILE" || (l.entityType === "ONBOARDING" && /uploaded/i.test(l.action))).length,
      },
      {
        label: "Done",
        value: logs.filter((l) => /approved|completed/i.test(l.action)).length,
      },
      {
        label: "Messages",
        value: logs.filter((l) => l.entityType === "MESSAGE" || /message|comment/i.test(l.action)).length,
      },
    ],
    [logs],
  );

  const projects = useMemo(() => {
    const counts = new Map<string, { id: string; name: string; count: number }>();
    for (const log of logs) {
      if (!log.project) continue;
      const prev = counts.get(log.project.id);
      counts.set(log.project.id, {
        id: log.project.id,
        name: log.project.name,
        count: (prev?.count ?? 0) + 1,
      });
    }
    return [...counts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((p) => ({ id: p.id, name: p.name, level: toLevel(p.count) }));
  }, [logs]);

  const isFiltered = activeFilter !== "All" || searchTerm.trim() !== "";

  const clearFilters = () => {
    setActiveFilter("All");
    setSearchTerm("");
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 pb-10">
      <DashboardHeading
        title="Activity"
        description={unreadCount > 0 ? `${unreadCount} unread across your agency.` : "You're all caught up."}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Feed */}
        <section className={cn(SURFACE, "min-w-0 overflow-hidden")}>
          <div className="flex items-center justify-between gap-4 border-b border-dashboard-border px-5 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-zinc-100">Recent activity</h2>
              {unreadCount > 0 && <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-blue-400">{unreadCount} unread</span>}
            </div>
            <Button
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="rounded-2xl border border-dashboard-border bg-[#131316] text-[#ffffff]/80"
            >
              Mark all as read
            </Button>
          </div>

          <div className="flex  flex-col gap-3 border-b border-dashboard-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="group"
              aria-label="Filter activity"
              className="inline-flex w-fit rounded-lg bg-[#19191b] p-1"
            >
              {FILTERS.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      active ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300",
                    )}
                  >
                    {filter}
                    <span className="tabular-nums text-[11px] text-zinc-600">{filterCounts[filter] ?? 0}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <Input
                aria-label="Search activity"
                placeholder="Search activity"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 border-dashboard-border bg-[#19191b] pl-9 text-sm placeholder:text-zinc-600 focus-visible:ring-zinc-700"
              />
            </div>
          </div>

          {isLoading ? (
            <FeedSkeleton />
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/60">
                <Bell className="h-4 w-4 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-200">{isFiltered ? "No matching activity" : "No activity yet"}</p>
              <p className="mt-1 text-xs text-zinc-500">{isFiltered ? "Try a different filter or search term." : "Events will appear here as your team works."}</p>
              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div>
              {sections.map((section) => (
                <div key={section.label}>
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dashboard-border  px-5 py-2 backdrop-blur">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">{section.label}</h3>
                    <span className="text-xs tabular-nums text-zinc-600">{section.items.length}</span>
                  </div>
                  <ul className="divide-y divide-dashboard-border">
                    {section.items.map((log) => (
                      <ActivityRow
                        key={log.id}
                        log={log}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-dashboard-border px-5 py-3">
            <p className="text-xs tabular-nums text-zinc-500">
              Showing {visibleLogs.length} of {logs.length}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 text-zinc-500 hover:text-zinc-200"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-6">
          <Panel title="Overview">
            <div className="grid grid-cols-3 divide-x divide-dashboard-border">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-5 py-4"
                >
                  <p className="text-2xl font-semibold tabular-nums text-zinc-100">{stat.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Projects"
            meta={<span className="text-xs tabular-nums text-zinc-600">{projects.length}</span>}
          >
            {projects.length === 0 ? (
              <p className="px-5 py-6 text-sm text-zinc-500">No project activity yet.</p>
            ) : (
              <ul className="divide-y divide-dashboard-border">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <span
                      className="truncate text-sm text-zinc-200"
                      title={project.name}
                    >
                      {project.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                      <span className={cn("h-1.5 w-1.5 rounded-full", LEVEL_DOT[project.level])} />
                      {project.level} activity
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
