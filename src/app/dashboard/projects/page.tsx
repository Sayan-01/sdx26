"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Briefcase, MoreVertical, ArrowUpRight, TrendingUp, LayoutGrid, List, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn, calculatePriority, dayAgo } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllProjects } from "../../../../server/projects";
import { ProjectCard } from "@/types/types";

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const [projects, setProjects] = useState<ProjectCard>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getAllProjects();
      if (response.projects) {
        const formattedProjects = response.projects.map((p: any) => ({
          ...p,
          priority: calculatePriority(p.deadline),
          progress: Math.floor(Math.random() * 100), // Placeholder progress
          team: p._count?.projectMembers || 1,
          activity: dayAgo(p.updatedAt), // Placeholder activity
        }));
        setProjects(formattedProjects);
      }
    };
    fetchProjects();
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: <Briefcase className="h-4 w-4" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Now",
      value: projects.filter((p) => p.status === "ACTIVE").length.toString(),
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "On Hold",
      value: projects.filter((p) => p.status === "ON_HOLD").length.toString(),
      icon: <Clock className="h-4 w-4" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "COMPLETED").length.toString(),
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeading
          title="Projects"
          description="Manage and track your agency's creative projects and client delivery."
        />
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects/new">
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2 font-bold shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-[#19191b] border-dashboard-border/50 overflow-hidden group hover:border-dashboard-border transition-colors"
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#19191b]/50 p-2 rounded-xl border border-dashboard-border">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search projects, clients or tags..."
            className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#151518] border-dashboard-border text-zinc-400 hover:text-white h-10 px-4 gap-2 flex-1 md:flex-none"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <div className="h-10 w-px bg-dashboard-border mx-1 hidden md:block" />

          <div className="bg-[#151518] p-1 rounded-lg border border-dashboard-border flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 transition-all", view === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500")}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 transition-all", view === "list" ? "bg-zinc-800 text-white" : "text-zinc-500")}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-0">
          {projects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500">
              <div className="flex gap-4">
                <Link
                  href="/dashboard/projects/new"
                  className="w-16 h-16 rounded-full bg-zinc-900 border border-dashboard-border flex items-center justify-center mb-4"
                >
                  <Briefcase className="h-8 w-8" />
                </Link>
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-1">No Projects Yet</h3>
              <p className="text-sm">Get started by creating your first project</p>
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block group"
              >
                <Card className="bg-[#19191b] border-dashboard-border/60 shadow-xl shadow-black/20 hover:border-zinc-600 transition-all duration-300  overflow-hidden p-0 relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <CardContent className="p-5 flex flex-col h-full space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#151518] border border-dashboard-border flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all duration-300 shadow-inner">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 shadow-sm",
                          project.status === "ACTIVE"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : project.status === "ON_HOLD"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : project.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            project.status === "ACTIVE"
                              ? "bg-indigo-400 animate-pulse"
                              : project.status === "ON_HOLD"
                                ? "bg-blue-400"
                                : project.status === "COMPLETED"
                                  ? "bg-emerald-500"
                                  : "bg-zinc-500",
                          )}
                        />
                        {project.status}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors truncate">{project.name}</h3>
                        <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-zinc-500 font-medium">{project.client.name}</p>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          <AlertCircle className={cn("h-3 w-3", project.priority === "High" ? "text-rose-500" : project.priority === "Medium" ? "text-amber-500" : "text-zinc-500")} />
                          {project.priority}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest transition-colors">
                        <span className="text-zinc-500">Progress</span>
                        <span className="text-zinc-300">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#151518] rounded-full overflow-hidden border border-dashboard-border/30">
                        <div
                          className={cn(
                            "h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]",
                            project.progress === 100 ? "bg-emerald-500" : "bg-linear-to-r from-indigo-600 to-indigo-400",
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-5 border-t border-dashboard-border flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(project.team, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#19191b] flex items-center justify-center text-[10px] font-bold text-zinc-300 group-hover:border-zinc-700 transition-colors"
                          >
                            {i === 0 ? "JD" : i === 1 ? "MK" : "+"}
                          </div>
                        ))}
                        {project.team > 3 && (
                          <div className="w-8 h-8 rounded-full bg-[#151518] border-2 border-[#19191b] flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:border-zinc-700 transition-colors">
                            +{project.team - 2}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-zinc-600" />
                        {project.activity}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}

          {projects.length !== 0 && (
            <Link
              href="/dashboard/projects/new"
              className="border-2 border-dashed border-dashboard-border rounded-xl flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-white hover:bg-[#19191b]/30 hover:border-zinc-600 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-dashboard-border flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Create New Project</p>
                <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Start a new workflow</p>
              </div>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashboard-border overflow-hidden bg-[#151518] duration-0">
          <Table>
            <TableHeader className="bg-[#19191b]">
              <TableRow className="border-dashboard-border hover:bg-transparent">
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] p-5">Project</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Status</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Priority</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Progress</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Last Activity</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-zinc-500"
                  >
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="border-dashboard-border hover:bg-[#19191b] transition-colors group"
                  >
                    <TableCell className="p-5">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-dashboard-border flex items-center justify-center text-zinc-400 transition-colors group-hover:bg-zinc-800 group-hover:text-white">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-100 group-hover:text-white">{project.name}</p>
                          <p className="text-xs text-zinc-500">{project.client.name}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          project.status === "ACTIVE"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : project.status === "ON_HOLD"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : project.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            project.status === "ACTIVE"
                              ? "bg-indigo-400 animate-pulse"
                              : project.status === "ON_HOLD"
                                ? "bg-blue-400"
                                : project.status === "COMPLETED"
                                  ? "bg-emerald-500"
                                  : "bg-zinc-500",
                          )}
                        />
                        {project.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        <AlertCircle className={cn("h-3.5 w-3.5", project.priority === "High" ? "text-rose-500" : project.priority === "Medium" ? "text-amber-500" : "text-zinc-500")} />
                        {project.priority}
                      </div>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-dashboard-border/30">
                          <div
                            className={cn("h-full transition-all duration-700", project.progress === 100 ? "bg-emerald-500" : "bg-indigo-500")}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest px-5">{project.activity}</TableCell>
                    <TableCell className="text-right p-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-600 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
