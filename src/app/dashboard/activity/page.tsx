"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Bell, CheckCircle2, Clock, FileBox, MessageSquare, UserPlus, CreditCard, Briefcase, Layers, Search, BarChart3, Users, Zap, Filter, Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";
import { getActivityLogs, markAllLogsAsRead } from "../../../../server/activity";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await getActivityLogs();
      if (res.success) {
        setLogs(res.logs);
      } else {
        toast.error("Failed to load activity feed");
      }
    } catch (error) {
      toast.error("Error fetching activities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllLogsAsRead();
      if (res.success) {
        setLogs((prev) => prev.map((log) => ({ ...log, isRead: true })));
        toast.success("All activities marked as read");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search
      const textToSearch = `${log.action} ${log.actorUser?.name} ${log.actorClient?.name} ${log.project?.name} ${log.metadata?.name || ""}`.toLowerCase();
      const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());

      // Category Filter
      if (activeFilter === "All") return matchesSearch;
      if (activeFilter === "Files") return matchesSearch && log.entityType === "FILE";
      if (activeFilter === "Messages") return matchesSearch && (log.entityType === "MESSAGE" || log.action?.includes("comment"));
      if (activeFilter === "Approvals") return matchesSearch && log.action?.includes("APPROVED");

      return matchesSearch;
    });
  }, [logs, searchTerm, activeFilter]);

  // Group by date
  const groupedLogs = useMemo(() => {
    const sorted = [...filteredLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      today: sorted.filter((l) => isToday(new Date(l.createdAt))),
      yesterday: sorted.filter((l) => isYesterday(new Date(l.createdAt))),
      older: sorted.filter((l) => !isToday(new Date(l.createdAt)) && !isYesterday(new Date(l.createdAt))),
    };
  }, [filteredLogs]);

  // Stats
  const activityStats = useMemo(() => {
    const fileCount = logs.filter((l) => l.entityType === "FILE" || (l.entityType === "ONBOARDING" && l.action?.includes("Uploaded"))).length;

    const msgCount = logs.filter((l) => l.entityType === "MESSAGE" || l.action?.includes("MESSAGE") || l.action?.includes("comment")).length;

    const completedCount = logs.filter((l) => l.action?.includes("Approved") || l.action?.includes("Completed")).length;

    return [
      { label: "Files Uploaded", value: fileCount.toString(), icon: <FileBox className="text-blue-500 h-4 w-4" /> },
      { label: "Tasks Completed", value: completedCount.toString(), icon: <CheckCircle2 className="text-emerald-500 h-4 w-4" /> },
      { label: "Messages", value: msgCount.toString(), icon: <MessageSquare className="text-amber-500 h-4 w-4" /> },
    ];
  }, [logs]);

  // Trending Projects (mock logic based on real projects present in logs)
  const trendingProjects = useMemo(() => {
    const projectActivity: Record<string, { count: number; name: string }> = {};
    logs.forEach((log) => {
      if (log.project) {
        projectActivity[log.project.id] = {
          count: (projectActivity[log.project.id]?.count || 0) + 1,
          name: log.project.name,
        };
      }
    });

    return Object.values(projectActivity)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((p, i) => ({
        name: p.name,
        activity: p.count > 10 ? "High" : p.count > 5 ? "Medium" : "Low",
        color: p.count > 10 ? "bg-emerald-500" : p.count > 5 ? "bg-amber-500" : "bg-zinc-500",
      }));
  }, [logs]);

  const getIcon = (action: string, type: string) => {
    const a = action.toLowerCase();
    const t = type.toLowerCase();

    if (a.includes("file") || t === "file" || (t === "onboarding" && a.includes("uploaded"))) return <FileBox className="h-4 w-4" />;
    if (a.includes("approved") || a.includes("checklist") || a.includes("onboarding")) return <CheckCircle2 className="h-4 w-4" />;
    if (a.includes("payment") || t === "payment") return <CreditCard className="h-4 w-4" />;
    if (a.includes("message") || a.includes("comment") || t === "message") return <MessageSquare className="h-4 w-4" />;
    if (a.includes("team") || t === "team_member") return <UserPlus className="h-4 w-4" />;
    if (a.includes("project") || t === "project") return <Briefcase className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const getLogContent = (log: any) => {
    const actor = log.actorUser?.name || log.actorClient?.name || "Someone";
    const target = log.metadata?.label || log.metadata?.name || log.metadata?.email || log.entityId || "item";
    let actionTxt = log.action.split("_").join(" ").toLowerCase();

    return (
      <p className="text-sm leading-relaxed">
        <span className="font-bold text-white">{actor}</span> <span className="text-zinc-400">{actionTxt}</span>{" "}
        <span className="font-bold text-zinc-300 uppercase tracking-tight text-[11px]">{target}</span>{" "}
        {log.project && (
          <>
            <span className="text-zinc-500 text-xs">in</span> <span className="text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors">{log.project.name}</span>
          </>
        )}
      </p>
    );
  };

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all flex items-start gap-4 group ",
        !activity.isRead ? "bg-[#19191b] border-dashboard-border card_shadow" : "bg-[#151518] border-dashboard-border/50 hover:bg-[#19191b] ",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          !activity.isRead ? "bg-white text-zinc-950" : "bg-zinc-800/50 border border-dashboard-border/50 text-zinc-500 group-hover:text-zinc-300 shadow-inner",
        )}
      >
        {getIcon(activity.action, activity.entityType)}
      </div>

      <div className="grow space-y-1 pt-0.5">
        {getLogContent(activity)}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
          {!activity.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white"
      >
        Details
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeading
          title="Activity Feed"
          description="Stay updated with everything happening across your agency."
        />
        <Button
          variant="outline"
          onClick={handleMarkAllRead}
          className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800"
        >
          Mark all as read
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Feed Column */}
        <div className="xl:col-span-2 flex flex-col gap-6 ">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full card_shadow"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              {["All", "Files", "Messages", "Approvals"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "h-10 px-4 rounded-lg shrink-0",
                    activeFilter === filter ? "bg-white text-black hover:bg-zinc-200" : "bg-[#151518] border-dashboard-border hover:bg-zinc-800 text-zinc-400",
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
              <p className="text-zinc-500 text-sm animate-pulse">Building your timeline...</p>
            </div>
          ) : (
            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
              {groupedLogs.today.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Today
                  </h3>
                  <div className="space-y-3">
                    {groupedLogs.today.map((act) => (
                      <ActivityItem
                        key={act.id}
                        activity={act}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedLogs.yesterday.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Yesterday</h3>
                  <div className="space-y-3">
                    {groupedLogs.yesterday.map((act) => (
                      <ActivityItem
                        key={act.id}
                        activity={act}
                      />
                    ))}
                  </div>
                </div>
              )}

              {groupedLogs.older.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Older Activities</h3>
                  <div className="space-y-3">
                    {groupedLogs.older.map((act) => (
                      <ActivityItem
                        key={act.id}
                        activity={act}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredLogs.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center space-y-2">
                  <Bell className="h-10 w-10 text-zinc-800" />
                  <p className="font-bold text-zinc-400">Quiet for now...</p>
                  <p className="text-xs text-zinc-500">No matching activities found in this filter.</p>
                </div>
              )}

              {logs.length > 0 && (
                <div className="pt-4 pb-8 text-center">
                  <Button
                    variant="ghost"
                    onClick={fetchLogs}
                    className="text-zinc-500 hover:text-white gap-2"
                  >
                    Refresh activity
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]  card_shadow">
            <div className="flex items-center gap-2 px-5 pt-3">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h2 className="text-md font-semibold text-zinc-200">Agency Stats</h2>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-5 rounded-b-xl border-t border-dashboard-border/60 border-0">
              <div className="space-y-4">
                {activityStats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#19191b] border border-dashboard-border/50 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center">{stat.icon}</div>
                      <span className="text-sm font-medium text-zinc-300">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-white transition-all">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] card_shadow">
            <div className="flex items-center gap-2 px-5 pt-3">
              <Zap className="h-4 w-4 text-amber-500" />
              <h2 className="text-md font-semibold text-zinc-200">Active Projects</h2>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 transform rounded-b-xl border-t border-dashboard-border/60 border-0">
              <div className="divide-y divide-zinc-800/60 box">
                {trendingProjects.length > 0 ? (
                  trendingProjects.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-4 hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-dashboard-border flex items-center justify-center text-xs font-bold text-zinc-400">{p.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-zinc-200 truncate max-w-[120px]">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", p.color)} />
                        <span className="text-xs text-zinc-500">{p.activity}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-xs text-zinc-600">No project activity yet</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
