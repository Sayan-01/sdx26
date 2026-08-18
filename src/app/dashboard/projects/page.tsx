"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Briefcase, MoreVertical, ArrowUpRight, TrendingUp, LayoutGrid, List, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, calculatePriority, dayAgo } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllProjects } from "../../../../server/projects";
import { ProjectCard } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const [projects, setProjects] = useState<ProjectCard>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjects();
        if (response.projects) {
          const formattedProjects = response.projects.map((p: any) => {
            // Calculate real progress based on milestones
            const totalMilestones = p.milestones?.length || 0;
            const completedMilestones = p.milestones?.filter((m: any) => m.status === "APPROVED" || m.status === "PAID").length || 0;
            const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

            return {
              ...p,
              priority: calculatePriority(p.deadline),
              progress,
              team: p._count?.projectMembers || 0,
              activity: dayAgo(p.updatedAt),
            };
          });
          setProjects(formattedProjects);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || project.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            className="relative bg-[#19191b] transition-colors overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="skeleton-shimmer h-10 w-20 rounded-lg" />
              ) : (
                <div className="text-4xl tracking-tight">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#19191b]/50 p-2 rounded-xl border border-dashboard-border card_shadow">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "bg-[#151518] border-dashboard-border text-zinc-400 hover:text-white h-10 px-4 gap-2 flex-1 md:flex-none",
                  statusFilter !== "ALL" && "text-indigo-400 border-indigo-500/50",
                )}
              >
                <Filter className="h-4 w-4" />
                {statusFilter === "ALL" ? "Filters" : statusFilter.replace("_", " ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#19191b] border-dashboard-border"
            >
              <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Status Filter</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-dashboard-border" />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ALL"}
                onCheckedChange={() => setStatusFilter("ALL")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                All Projects
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ACTIVE"}
                onCheckedChange={() => setStatusFilter("ACTIVE")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ON_HOLD"}
                onCheckedChange={() => setStatusFilter("ON_HOLD")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                On Hold
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "COMPLETED"}
                onCheckedChange={() => setStatusFilter("COMPLETED")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="bg-[#19191b] border-dashboard-border/60 p-0 overflow-hidden"
              >
                <CardContent className="p-6 flex flex-col h-full space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 animate-pulse border border-dashboard-border/50" />
                    <div className="w-20 h-6 rounded-full bg-zinc-800/50 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-zinc-800/50 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-zinc-800/50 rounded animate-pulse" />
                      <div className="h-3 w-8 bg-zinc-800/50 rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-full bg-zinc-800/50 rounded-full animate-pulse" />
                  </div>
                  <div className="pt-5 border-t border-dashboard-border flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="w-8 h-8 rounded-full bg-zinc-800/50 animate-pulse border-2 border-[#19191b]"
                        />
                      ))}
                    </div>
                    <div className="h-3 w-16 bg-zinc-800/50 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-dashboard-border flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-zinc-700" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-1">No Projects Found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block group"
              >
                <Card className="bg-[#19191b] border-dashboard-border/60 hover:border-zinc-600 transition-all duration-300  overflow-hidden p-0 relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <CardContent className="p-6 flex flex-col h-full space-y-5">
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
                        {project.projectMembers && project.projectMembers.length > 0 ? (
                          project.projectMembers.slice(0, 3).map((member, i) => (
                            <Avatar
                              key={i}
                              className="w-8 h-8 border-2 border-[#19191b] hover:z-10 transition-transform"
                            >
                              <AvatarImage
                                src={member.user.avatarUrl || ""}
                                alt={member.user.name || "Member"}
                              />
                              <AvatarFallback className="bg-zinc-800 text-[10px] font-bold text-zinc-300 uppercase">{member.user.name?.substring(0, 2) || "TM"}</AvatarFallback>
                            </Avatar>
                          ))
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#19191b] flex items-center justify-center text-[10px] font-bold text-zinc-300">-</div>
                        )}
                        {project.projectMembers && project.projectMembers.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-[#151518] border-2 border-[#19191b] flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:border-zinc-700 transition-colors">
                            +{project.projectMembers.length - 3}
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

          {!isLoading && filteredProjects.length !== 0 && (
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-dashboard-border"
                  >
                    <TableCell className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800/50 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
                          <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-20 bg-zinc-800/50 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-zinc-800/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-2">
                        <div className="h-3 w-8 bg-zinc-800/50 rounded animate-pulse ml-auto" />
                        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="px-5">
                      <div className="h-4 w-24 bg-zinc-800/50 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right p-5">
                      <div className="h-8 w-8 bg-zinc-800/50 rounded animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-zinc-500"
                  >
                    No projects found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="border-dashboard-border hover:bg-[#19191b] transition-colors group"
                  >
                    <TableCell className="p-6">
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
