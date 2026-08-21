import React from "react";
import Link from "next/link";
import { Briefcase, Plus, Clock, CheckCircle2, ArrowUpRight, TrendingUp, DollarSign, ChevronRight, FileBox, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "./_components/dashboard-heading";
import DashboardCard from "./_components/dashboard-card";
import { getDashboardData } from "./actions";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (result.error || !result.data) {
    return <div className="p-6 text-red-500">Error loading dashboard data: {result.error}</div>;
  }

  const { stats: fetchedStats, recentProjects, activities, userName } = result.data;

  const stats = [
    { label: "Active Projects", value: fetchedStats.activeProjects.toString(), icon: <Briefcase className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Approvals", value: fetchedStats.pendingApprovals.toString(), icon: <Clock className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Milestones", value: fetchedStats.completedMilestones.toString(), icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Payment Pending", value: `$${fetchedStats.pendingPayments.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const getActivityIconAndColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "file":
        return { icon: <FileBox className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" };
      case "payment":
        return { icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" };
      case "approval":
      case "milestone":
        return { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "team":
      case "member":
        return { icon: <Users className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" };
      default:
        return { icon: <Activity className="h-4 w-4" />, color: "text-indigo-500", bg: "bg-indigo-500/10" };
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading
          title={`Welcome back`}
          description="Here's what's happening with your agency today."
        />
        <Link href="/dashboard/projects/new">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="relative bg-[#19191b] transition-colors overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Recent Projects */}
        <DashboardCard
          title="Recent Projects"
          link="/dashboard/projects"
          wrapperClassName="min-[900px]:col-span-2"
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
            {recentProjects.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">No projects found. Create one to get started.</div>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex w-full hover:bg-zinc-900/50 transition-colors group px-6 min-h-[90px] items-center border-b border-b-dashboard-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base">{project.name}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {project.client} • {formatDistanceToNow(new Date(project.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-14 sm:pl-0">
                      <div className="hidden md:block text-right w-24">
                        <div className="flex justify-between items-end mb-1.5">
                          <p className="text-[10px] text-zinc-500 font-medium">Progress</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{project.progress}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-24 h-6 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                            project.status === "ON_HOLD"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : project.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : project.status === "ACTIVE"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                          )}
                        >
                          {project.status}
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </DashboardCard>

        {/* Activity Log */}
        <DashboardCard
          title="Activity Log"
          link="/dashboard/activity"
          className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
        >
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box-1">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">No activity yet.</div>
            ) : (
              activities.map((item) => {
                const style = getActivityIconAndColor(item.type);
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 px-6 min-h-[90px] items-center hover:bg-zinc-900/50 transition-colors group border-b border-b-dashboard-border"
                  >
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-dashboard-border/30", style.bg, style.color)}>{style.icon}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">{item.text}</p>
                      <p className="text-sm text-zinc-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-6 border-t border-dashboard-border/60 bg-zinc-900/20 mt-auto">
            <Link href="/dashboard/activity">
              <Button
                variant="outline"
                className="w-full font-medium border-dashboard-border hover:bg-zinc-800/50 text-zinc-400 hover:text-white h-9.5"
              >
                View All Activity
              </Button>
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
