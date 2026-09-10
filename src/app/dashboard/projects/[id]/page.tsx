import React from "react";
import { CheckCircle2, Clock, MessageSquare, FileBox, ArrowRight, Zap, Star, Layout, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getProjectById } from "@server/projects";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import DashboardCard from "../../_components/dashboard-card";
import CreateTaskModal from "./_components/create-task-modal";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProjectById(id);

  if (result.error || !result.project) {
    notFound();
  }

  const project = result.project;

  // Find current milestone (first one that is not PAID or APPROVED, or just the first one if all are pending)
  const currentMilestone = project.milestones.find((m) => m.status !== "PAID" && m.status !== "APPROVED") || project.milestones[0];

  const upcomingTasks = project.tasks;
  const activityLogs = project.activityLogs;
  const teamMembers = project.projectMembers;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Status Column */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-h-0">
          <DashboardCard
            title="Current Milestone"
            icon={<Zap className="h-4 w-4 text-emerald-500" />}
            className="p-6"
          >
            {currentMilestone ? (
              <>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    {currentMilestone.dueDate && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        <Clock className="h-3.5 w-3.5" />
                        Due {formatDistanceToNow(new Date(currentMilestone.dueDate), { addSuffix: true })}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold tracking-tight text-white">{currentMilestone.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">{currentMilestone.description || "No description provided for this milestone."}</p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[10px] text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Status</p>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest border",
                        currentMilestone.status === "IN_PROGRESS"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : currentMilestone.status === "IN_REVIEW"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
                      )}
                    >
                      <span className="relative flex h-2 w-2">
                        <span
                          className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            currentMilestone.status === "IN_PROGRESS" ? "bg-amber-500" : currentMilestone.status === "IN_REVIEW" ? "bg-blue-500" : "bg-zinc-500",
                          )}
                        ></span>
                      </span>
                      {currentMilestone.status.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashboard-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {teamMembers.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#151518] flex items-center justify-center text-xs font-medium text-white overflow-hidden"
                          title={member.user.name || ""}
                        >
                          {member.user.avatarUrl ? (
                            <img
                              src={member.user.avatarUrl}
                              alt={member.user.name || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            member.user.name?.charAt(0) || "?"
                          )}
                        </div>
                      ))}
                      {teamMembers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-[#151518] flex items-center justify-center text-xs font-medium text-zinc-400">+{teamMembers.length - 3}</div>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">Project Team</span>
                  </div>
                  <Link href={`/dashboard/projects/${id}/milestones`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-zinc-500 hover:text-white h-8 group/btn"
                    >
                      View milestone details
                      <ArrowRight className="ml-1.5 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Layout className="h-12 w-12 mb-4 opacity-20" />
                <p>No active milestones for this project.</p>
                <Link
                  href={`/dashboard/projects/${id}/milestones`}
                  className="mt-4"
                >
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Create Milestone
                  </Button>
                </Link>
              </div>
            )}
          </DashboardCard>

          <DashboardCard
            title="Upcoming Tasks"
            icon={<Star className="h-4 w-4 text-blue-500" />}
            extra={
              <CreateTaskModal
                projectId={id}
                milestones={project.milestones}
                teamMembers={project.projectMembers}
              />
            }
          >
            <div className="divide-y divide-zinc-800/60 box">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center text-lg border border-dashboard-border/50">
                        {task.status === "COMPLETED" ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Clock className="h-5 w-5 text-zinc-500" />}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{task.title}</span>
                        <div className="text-xs text-zinc-500 mt-0.5">{task.assignee ? `Assigned to ${task.assignee.name}` : "Unassigned"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-dashboard-border/50 bg-zinc-900/50">
                        <div className={cn("w-1.5 h-1.5 rounded-full", task.priority === "HIGH" ? "bg-rose-500" : task.priority === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500")} />
                        <span className="text-xs font-medium text-zinc-400 capitalize">{task.priority.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <p className="text-sm italic">No upcoming tasks found.</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Sidebar/Quick Actions Column */}
        <div className="flex flex-col gap-6">
          <DashboardCard
            title="Quick Activity"
            link={`/dashboard/projects/${id}/activity`}
          >
            <div className="divide-y divide-zinc-800 overflow-y-auto flex-1 box">
              {activityLogs.length > 0 ? (
                activityLogs.map((log, i) => (
                  <div
                    key={log.id}
                    className="flex gap-4 px-6 py-6 hover:bg-zinc-900/50 transition-colors group"
                  >
                    
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">
                        <span className="font-medium text-white">{log.actorUser?.name || log.actorClient?.name || "System"}</span> {log.action}
                      </p>
                      <p className="text-[12px] text-zinc-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-600 text-sm italic">No recent activity.</div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Project Team">
            <div className="p-5">
              <div className="space-y-4">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member, i) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 transition-colors group/member"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-dashboard-border/50 flex items-center justify-center text-sm font-medium overflow-hidden">
                        {member.user.avatarUrl ? (
                          <img
                            src={member.user.avatarUrl}
                            alt={member.user.name || ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.user.name?.charAt(0) || "?"
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200 group-hover/member:text-white transition-colors">{member.user.name}</p>
                        <p className={cn("text-xs font-medium mt-0.5", member.role === "OWNER" ? "text-indigo-500" : "text-zinc-500")}>{member.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-600 italic text-center py-4">No team members assigned.</p>
                )}
              </div>
              <Link href={`/dashboard/projects/${id}/settings`}>
                <Button
                  variant="outline"
                  className="w-full mt-6 text-xs font-medium border-dashboard-border hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                >
                  Manage Team
                </Button>
              </Link>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
