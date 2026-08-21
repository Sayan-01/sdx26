import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { CheckSquare, Milestone as MilestoneIcon, TrendingUp, Layout, MessageSquare, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";

export default async function PortalDashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getClientSession();

  if (!session) {
    redirect(`/portal/${token}`);
  }

  const project = await prisma.project.findFirst({
    where: {
      id: session.projectId,
      agencyId: session.agencyId,
      clientId: session.clientId,
    },
    include: {
      milestones: {
        orderBy: { orderIndex: "asc" },
      },
      onboardingItem: {
        take: 5,
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!project) {
    redirect(`/portal/${token}`);
  }

  // Stats calculation
  const completedMilestones = project.milestones.filter((m) => m.status === "APPROVED" || m.status === "PAID").length;
  const totalMilestones = project.milestones.length;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const pendingOnboarding = project.onboardingItem.filter((i) => i.status === "PENDING").length;
  const nextMilestone = project.milestones.find((m) => m.status === "PENDING" || m.status === "IN_PROGRESS");

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeading
          title="Dashboard Overview"
          description="Track the progress of your project and recent updates."
        />
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Progress"
          value={`${Math.round(progress)}%`}
          icon={<TrendingUp className="h-5 w-5 text-indigo-400" />}
          desc={`${completedMilestones}/${totalMilestones} Milestones`}
        />
        <StatCard
          title="Next Milestone"
          value={nextMilestone?.title || "Completed"}
          icon={<MilestoneIcon className="h-5 w-5 text-emerald-400" />}
          desc={nextMilestone?.dueDate ? format(new Date(nextMilestone.dueDate), "MMM d") : "No deadline"}
        />
        <StatCard
          title="Requirements"
          value={pendingOnboarding.toString()}
          icon={<CheckSquare className="h-5 w-5 text-amber-400" />}
          desc="Awaiting upload"
        />
        <StatCard
          title="Status"
          value={project.status}
          icon={<Layout className="h-5 w-5 text-sky-400" />}
          desc="Active project"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Milestones & Onboarding */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <DashboardCard
            title="Recent Milestones"
            link={`/portal/${token}/milestones`}
            icon={<MilestoneIcon className="h-5 w-5 text-indigo-400" />}
          >
            <div className="divide-y divide-zinc-800/60 flex-1 box min-h-0">
              {project.milestones.length > 0 ? (
                project.milestones.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center text-lg border border-dashboard-border/50 transition-colors",
                          m.status === "APPROVED" || m.status === "PAID" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" : "text-indigo-400 group-hover:text-white",
                        )}
                      >
                        <MilestoneIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{m.title}</span>
                        <div className="text-xs text-zinc-500 mt-0.5">{m.status.replace("_", " ")}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-zinc-200">${m.amount}</span>
                      <span className="text-xs text-zinc-500">{m.dueDate ? format(new Date(m.dueDate), "MMM d") : "-"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <p className="text-sm italic">No milestones created yet.</p>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Onboarding Checklist"
            link={`/portal/${token}/onboarding`}
            icon={<CheckSquare className="h-5 w-5 text-amber-400" />}
          >
            <div className="divide-y divide-zinc-800/60 flex-1 box min-h-0">
              {project.onboardingItem.length > 0 ? (
                project.onboardingItem.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0",
                          item.status === "APPROVED" ? "bg-emerald-500/20 border-emerald-500" : "border-dashboard-border bg-[#151518]",
                        )}
                      >
                        {item.status === "APPROVED" && <Check className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <span className="text-sm text-zinc-200 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shrink-0 w-fit",
                        item.status === "PENDING" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      )}
                    >
                      {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <p className="text-sm italic">No onboarding tasks assigned.</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="flex flex-col gap-6">
          <DashboardCard
            title="Recent Activity"
            icon={<TrendingUp className="h-5 w-5 text-sky-400" />}
          >
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
              {project.activityLogs.length > 0 ? (
                project.activityLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-4 px-6 py-6 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">{formatActivityAction(log.action)}</p>
                      <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">{format(new Date(log.createdAt), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <p className="text-sm italic">No recent activity.</p>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Support Card */}
          <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <MessageSquare className="h-20 w-20 text-indigo-500" />
            </div>
            <h4 className="text-lg font-bold mb-2">Need help?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">Our team is available to assist you with any questions about the project.</p>
            <button className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">
              Message Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }: { title: string; value: string; icon: React.ReactNode; desc: string }) {
  return (
    <Card className="relative bg-[#19191b] transition-colors overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{title}</CardTitle>
          <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">{desc}</p>
        </div>
        <div className={cn("p-2 rounded-lg transition-colors duration-300 bg-[#242424]")}>{icon}</div>
      </CardHeader>

      <CardContent>{false ? <div className="skeleton-shimmer h-10 w-20 rounded-lg" /> : <div className="text-2xl font-bold tracking-tight">{value}</div>}</CardContent>
    </Card>
  );
}

function formatActivityAction(action: string) {
  return action.replace("client.", "").replace(/_/g, " ");
}
