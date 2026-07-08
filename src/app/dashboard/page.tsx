import React from "react";
import Link from "next/link";
import { Briefcase, Plus, Clock, CheckCircle2, ArrowUpRight, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardHeading from "./_components/dashboard-heading";
import { getDashboardData } from "./actions";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (result.error || !result.data) {
    return <div className="p-6 text-red-500">Error loading dashboard data: {result.error}</div>;
  }

  const { stats: fetchedStats, recentProjects, activities, userName } = result.data;

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const updatedThisWeek = recentProjects.filter((p) => new Date(p.date) > oneWeekAgo).length;
  const activeProjectsDelta = updatedThisWeek > 0 ? `↗ +${updatedThisWeek} this week` : `→ 0 recent updates`;
  const activeProjectsTrendColor = updatedThisWeek > 0 ? "text-accent" : "text-subtle-foreground";

  const pendingApprovalsDelta = fetchedStats.pendingApprovals > 0 ? `→ ${fetchedStats.pendingApprovals} awaiting reply` : `→ 0 awaiting reply`;
  const pendingApprovalsTrendColor = fetchedStats.pendingApprovals > 0 ? "text-chart-3" : "text-subtle-foreground";

  const recentCompletions = activities.filter((a) => a.type === "milestone" || a.type === "approval" || a.text.toLowerCase().includes("approved") || a.text.toLowerCase().includes("completed")).length;
  const completedMilestonesDelta = recentCompletions > 0 ? `↗ +${recentCompletions} this week` : `→ 0 recent completions`;
  const completedMilestonesTrendColor = recentCompletions > 0 ? "text-accent" : "text-subtle-foreground";

  const pendingPaymentsDelta = fetchedStats.pendingPayments > 0 ? `→ invoice pending` : `→ fully paid`;
  const pendingPaymentsTrendColor = fetchedStats.pendingPayments > 0 ? "text-chart-4" : "text-subtle-foreground";

  const stats = [
    {
      label: "Active Projects",
      value: fetchedStats.activeProjects.toString(),
      icon: (
        <Briefcase
          className="h-[15px] w-[15px]"
          strokeWidth={1.5}
        />
      ),
      delta: activeProjectsDelta,
      trendColor: activeProjectsTrendColor,
      spark: (
        <svg
          className="w-16 h-5 text-accent"
          viewBox="0 0 64 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 15 C10 15, 15 8, 25 10 C35 12, 45 3, 64 5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Pending Approvals",
      value: fetchedStats.pendingApprovals.toString(),
      icon: (
        <Clock
          className="h-[15px] w-[15px]"
          strokeWidth={1.5}
        />
      ),
      delta: pendingApprovalsDelta,
      trendColor: pendingApprovalsTrendColor,
      spark: (
        <svg
          className="w-16 h-5 text-subtle-foreground/50"
          viewBox="0 0 64 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 10 L64 10"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Completed Milestones",
      value: fetchedStats.completedMilestones.toString(),
      icon: (
        <CheckCircle2
          className="h-[15px] w-[15px]"
          strokeWidth={1.5}
        />
      ),
      delta: completedMilestonesDelta,
      trendColor: completedMilestonesTrendColor,
      spark: (
        <svg
          className="w-16 h-5 text-accent"
          viewBox="0 0 64 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 18 C15 15, 20 8, 35 12 C50 16, 55 2, 64 2"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Payment Pending",
      value: `$${fetchedStats.pendingPayments.toLocaleString()}`,
      icon: (
        <DollarSign
          className="h-[15px] w-[15px]"
          strokeWidth={1.5}
        />
      ),
      delta: pendingPaymentsDelta,
      trendColor: pendingPaymentsTrendColor,
      spark: (
        <svg
          className="w-16 h-5 text-chart-4"
          viewBox="0 0 64 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 5 C15 7, 20 18, 35 12 C50 6, 55 18, 64 18"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-full">
      {/* Welcome Heading Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <DashboardHeading
          title={`Welcome back, ${userName.split(" ")[0]}`}
          description="Here's what's happening with your agency today."
        />
        <Link href="/dashboard/projects/new">
          <Button className="h-9 px-3.5 rounded-md bg-foreground text-background hover:opacity-90 font-sans text-[13px] font-medium shadow-soft inline-flex items-center gap-2 transition-all">
            <Plus
              className="h-4 w-4"
              strokeWidth={1.5}
            />
            New Project
          </Button>
        </Link>
      </div>

      {/* Metric Grid with hairline dividers and 2xl rounding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-border rounded-2xl overflow-hidden shadow-elegant border border-border">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card p-6 flex flex-col justify-between min-h-[160px]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[12px] tracking-[0.1em] uppercase text-subtle-foreground">{stat.label}</span>
              <div className="text-subtle-foreground border p-2 rounded-xl">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className="font-display tracking-wide text-[48px] sm:text-[56px] leading-none font-normal text-foreground">{stat.value}</span>
            </div>
            <div className="flex items-center justify-between mt-5">
              <span className={cn("font-mono text-[12px] tracking-[0.02em] flex items-center gap-1.5", stat.trendColor)}>{stat.delta}</span>
              {stat.spark}
            </div>
          </div>
        ))}
      </div>

      {/* Content Columns Panel Row */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Recent Projects left panel */}
        <div className="min-[900px]:col-span-2 flex flex-col bg-card border border-border rounded-2xl shadow-elegant overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex flex-col">
              <h2 className="font-display tracking-wide text-2xl font-normal text-foreground">Recent projects</h2>
              <span className="font-mono text-[12px] tracking-[0.1em] uppercase text-subtle-foreground mt-1">
                {String(fetchedStats.activeProjects).padStart(2, "0")} Active &bull; Sorted by activity
              </span>
            </div>
            <Link
              href="/dashboard/projects"
              className="font-sans text-[12px] text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              View all ↗
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto box">
            {recentProjects.length === 0 ? (
              <div className="p-8 text-center font-sans text-sm text-muted-foreground">No projects found. Create one to get started.</div>
            ) : (
              recentProjects.map((project) => {
                
                let pillDotColor = "bg-muted-foreground";
                let pillBg = "bg-surface-3/70";
                let pillText = "text-muted-foreground";
                let pillBorder = "border-muted-forground";
                if (project.status === "ACTIVE") {
                  pillDotColor = "bg-accent";
                  pillBg = "bg-accent/10";
                  pillText = "text-accent";
                  pillBorder = "border-accent";
                } else if (project.status === "ON_HOLD") {
                  pillDotColor = "bg-chart-3";
                  pillBg = "bg-chart-3/10";
                  pillText = "text-chart-3";
                  pillBorder = "border-chart-3";
                } else if (project.status === "COMPLETED") {
                  pillDotColor = "bg-accent";
                  pillBg = "bg-accent/10";
                  pillText = "text-accent";
                } else if (project.status === "BLOCKED") {
                  pillDotColor = "bg-chart-4";
                  pillBg = "bg-chart-4/10";
                  pillText = "text-chart-4";
                }

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="flex h-[72px] items-center justify-between px-6 border-b border-border hover:bg-white/2 transition-colors duration-150 ease-elegant group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-zinc-800/10 border border-dashboard-border/50 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className=" text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base">{project.name[0].toUpperCase() + project.name.slice(1)}</h3>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {project.client} • {formatDistanceToNow(new Date(project.date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 ml-4">
                      <div className="hidden sm:flex items-center gap-2.5">
                        <span className="font-mono text-[10.5px] text-muted-foreground">{project.progress}%</span>
                        <div className="w-20 h-1 bg-surface-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className={cn("px-2.5 py-1 rounded-full font-mono text-[10.5px] tracking-[0.14em] uppercase flex items-center gap-1.5 border", pillBg, pillText, pillBorder)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", pillDotColor)} />
                        {project.status === "ON_HOLD" ? "HOLD" : project.status}
                      </div>

                      <ChevronRight className="h-4 w-4 text-subtle-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-150 ease-elegant" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Log right panel */}
        <div className="flex flex-col bg-card border border-border rounded-2xl shadow-elegant overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border ">
            <div className="flex flex-col">
              <h2 className="font-display text-2xl font-normal text-foreground tracking-wide">Activity log</h2>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-subtle-foreground mt-1">Live &bull; Last 24h</span>
            </div>
            <Link
              href="/dashboard/activity"
              className="font-sans text-[12px] text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              Full log ↗
            </Link>
          </div>

          <div className="flex-1 p-6 relative flex flex-col justify-between gap-6 min-h-0">
            <div className="relative pl-6 flex flex-col gap-6 before:absolute before:left-[12px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border overflow-y-auto box flex-1">
              {activities.length === 0 ? (
                <div className="text-center font-sans text-sm text-muted-foreground py-8">No activity yet.</div>
              ) : (
                activities.slice(0, 5).map((item, idx) => {
                  const isNew = idx === 0 || item.type === "payment" || item.type === "approval";
                  return (
                    <div
                      key={item.id}
                      className="relative flex flex-col gap-1"
                    >
                      <div className={cn("absolute left-[-17px] top-[3px] w-2.5 h-2.5 rounded-full border border-card z-10", isNew ? "bg-accent" : "bg-surface-3")} />

                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-subtle-foreground leading-none">{formatDistanceToNow(new Date(item.time), { addSuffix: true })}</span>

                      <p className="font-sans text-[13px] text-foreground leading-relaxed">{item.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-auto pt-1 h-max">
              <Link href="/dashboard/activity">
                <Button
                  variant="ghost"
                  className="w-full h-9 rounded-md border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-border-strong font-sans text-[13px] font-medium transition-colors justify-center"
                >
                  View All Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
