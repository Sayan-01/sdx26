import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { CheckCircle2, Milestone as MilestoneIcon, TrendingUp, Layout, Clock, ArrowUpRight, AlertCircle, CreditCard, MessageSquare, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function PortalDashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getClientSession();

  if (!session) redirect(`/portal/${token}`);

  const project = await prisma.project.findFirst({
    where: {
      id: session.projectId,
      agencyId: session.agencyId,
      clientId: session.clientId,
    },
    include: {
      milestones: {
        orderBy: { orderIndex: "asc" },
        include: { tasks: true },
      },
      onboardingItem: true,
      activityLogs: { orderBy: { createdAt: "desc" }, take: 2 },
    },
  });

  if (!project) redirect(`/portal/${token}`);

  // Derived metrics
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.status === "APPROVED" || m.status === "PAID").length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Active milestone spotlight (first in-progress or pending milestone)
  const activeMilestone = project.milestones.find((m) => m.status === "IN_PROGRESS") || project.milestones.find((m) => m.status === "PENDING") || project.milestones[project.milestones.length - 1];

  const activeMilestoneTasks = activeMilestone?.tasks || [];
  const completedTasksCount = activeMilestoneTasks.filter((t) => t.status === "COMPLETED").length;
  const taskProgress =
    activeMilestoneTasks.length > 0 ? Math.round((completedTasksCount / activeMilestoneTasks.length) * 100) : activeMilestone?.status === "APPROVED" || activeMilestone?.status === "PAID" ? 100 : 25;

  // Onboarding action items
  const pendingOnboarding = project.onboardingItem.filter((i) => i.status === "PENDING");
  const approvedOnboardingCount = project.onboardingItem.length - pendingOnboarding.length;
  const onboardingProgress = project.onboardingItem.length > 0 ? Math.round((approvedOnboardingCount / project.onboardingItem.length) * 100) : 100;
  const nextOnboardingAction = pendingOnboarding[0];

  // Financials
  const paidTotal = project.milestones.filter((m) => m.status === "PAID").reduce((sum, m) => sum + Number(m.amount), 0);
  const pendingTotal = project.milestones.filter((m) => m.status !== "PAID").reduce((sum, m) => sum + Number(m.amount), 0);
  const totalValue = paidTotal + pendingTotal;
  const paidShare = totalValue > 0 ? Math.round((paidTotal / totalValue) * 100) : 0;

  // KPI Top Stats
  const stats = [
    {
      label: "Overall Progress",
      value: `${progress}%`,
      subtitle: `${completedMilestones} of ${totalMilestones} phases complete`,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
    {
      label: "Current Stage",
      value: activeMilestone ? `Phase ${activeMilestone.orderIndex + 1}` : "Completed",
      subtitle: activeMilestone?.title ?? "All deliverables approved",
      icon: <MilestoneIcon className="h-4 w-4" />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Client Action Required",
      value: pendingOnboarding.length.toString(),
      subtitle: pendingOnboarding.length === 1 ? "document upload needed" : "documents awaiting upload",
      icon: <Clock className="h-4 w-4" />,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Project Status",
      value: project.status.charAt(0) + project.status.slice(1).toLowerCase(),
      subtitle: "Active workspace",
      icon: <Layout className="h-4 w-4" />,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between gap-5 animate-in fade-in duration-500">
      <div className="shrink-0">
        <DashboardHeading
          title="Dashboard overview"
          description="Track the progress of your project and recent updates."
        />
      </div>

      {/* 1. Top KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-[#19191b] border-dashboard-border p-5 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
              <div className={cn("p-1.5 rounded-lg", stat.bg, stat.color)}>{stat.icon}</div>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2 min-w-0">
              <span className="text-2xl font-semibold text-white shrink-0">{stat.value}</span>
              <span className="text-xs text-zinc-500 truncate text-right">{stat.subtitle}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Middle Row: Active Milestone Spotlight + Action Center (Fills space proportionally) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Active Milestone Spotlight (7 cols) */}
        <div className="lg:col-span-7 bg-[#19191b] border border-dashboard-border rounded-xl p-5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Active Milestone Spotlight</span>
              </div>
              <Link
                href={`/portal/${token}/milestones`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                View roadmap <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex items-baseline justify-between gap-5">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white tracking-tight truncate">{activeMilestone?.title ?? "All Milestones Completed"}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{activeMilestone?.dueDate ? `Target delivery by ${format(new Date(activeMilestone.dueDate), "MMMM d, yyyy")}` : "Final phase approved"}</p>
              </div>
              {activeMilestone?.amount && (
                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-zinc-200">${Number(activeMilestone.amount).toLocaleString()}</span>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Phase value</p>
                </div>
              )}
            </div>
          </div>

          {/* Phase progress visual bar */}
          <div className="pt-3 border-t border-zinc-800/60 mt-auto">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400">Phase Completion</span>
              <span className="font-semibold text-emerald-400">{taskProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2">
              <span>
                Phase {activeMilestone ? activeMilestone.orderIndex + 1 : totalMilestones} of {totalMilestones}
              </span>
              <span>
                {completedTasksCount} of {activeMilestoneTasks.length || 1} tasks verified
              </span>
            </div>
          </div>
        </div>

        {/* Client Action Center / Onboarding (5 cols) */}
        <div className="lg:col-span-5 bg-[#19191b] border border-dashboard-border rounded-xl p-5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Client Action Center</span>
            </div>
            <span className="text-xs font-bold text-zinc-300">{onboardingProgress}% Ready</span>
          </div>

          {nextOnboardingAction ? (
            <div className="my-auto p-3.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-semibold">Immediate action required</span>
              </div>
              <p className="text-sm font-medium text-zinc-200 mt-1 truncate">{nextOnboardingAction.label}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Upload your assets so the agency can proceed without delays.</p>
              <Link
                href={`/portal/${token}/onboarding`}
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all"
              >
                Upload Document Now <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="my-auto py-4 text-center">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">Everything is up to date</p>
              <p className="text-xs text-zinc-500 mt-0.5">No pending files or onboarding tasks from your end.</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/60 mt-auto">
            <span>
              {approvedOnboardingCount} of {project.onboardingItem.length} items verified
            </span>
            <Link
              href={`/portal/${token}/onboarding`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Open checklist →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Financial Health (4 cols) + Activity Pulse (5 cols) + Quick Help (3 cols) (Fills space proportionally) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Financials Glimpse (4 cols) */}
        <div className="lg:col-span-4 bg-[#19191b] border border-dashboard-border rounded-xl py-5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between pb-5 border-b border-dashboard-border mb-5 px-5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-300">Financial Snapshot</span>
            </div>
            <Link
              href={`/portal/${token}/payments`}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Invoices →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] uppercase text-zinc-500 font-semibold">Settled</span>
              <p className="text-base font-bold text-zinc-100 mt-0.5">${paidTotal.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] uppercase text-zinc-500 font-semibold">Pending</span>
              <p className="text-base font-bold text-amber-400 mt-0.5">${pendingTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-1 mt-auto px-5">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Settlement share</span>
              <span className="text-emerald-400 font-semibold">{paidShare}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${paidShare}%` }}
              />
            </div>
          </div>
        </div>

        {/* Activity Pulse (5 cols) */}
        <div className="lg:col-span-5 bg-[#19191b] border border-dashboard-border rounded-xl py-5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between pb-5 border-b border-dashboard-border mb-5 px-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold text-zinc-300">Recent Project Updates</span>
            </div>
            <span className="text-[10px] text-zinc-500">Real-time</span>
          </div>

          <div className="space-y-2.5 px-5">
            {project.activityLogs.length > 0 ? (
              project.activityLogs.slice(0, 2).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span className="text-zinc-300 capitalize ">{log.action.replace("client.", "").replace(/_/g, " ")}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{format(new Date(log.createdAt), "MMM d, h:mm a")}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 py-2">No recent events.</p>
            )}
          </div>

          <p className="text-[10px] text-zinc-500 pt-5 border-t border-dashboard-border mt-auto px-5">Automated event logging active</p>
        </div>

        {/* Agency Assistance (3 cols) */}
        <div className="lg:col-span-3 bg-[#19191b] border border-dashboard-border rounded-xl py-5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 pb-5 border-b border-dashboard-border px-5">
            <div className="rounded bg-indigo-500/10 text-indigo-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Need Help?</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed my-auto px-5">Our agency team answers scope or timeline inquiries promptly.</p>
          <div className="px-5">
            <button className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-bold transition-all mt-auto">
              Message Support <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
