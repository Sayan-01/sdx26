"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search, Filter, Briefcase, MoreVertical, ArrowUpRight, TrendingUp, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Acme Web Redesign", client: "Acme Corp", status: "Active", progress: 65, team: 4, activity: "2h ago" },
    { id: 2, name: "Brand Book", client: "Starlight Inc", status: "Onboarding", progress: 20, team: 2, activity: "5h ago" },
    { id: 3, name: "E-commerce Platform", client: "GearHead", status: "Active", progress: 45, team: 3, activity: "1d ago" },
    { id: 4, name: "Mobile App MVP", client: "Swiftly", status: "Completed", progress: 100, team: 5, activity: "3d ago" },
    { id: 5, name: "Legal Audit Site", client: "Specter Litt", status: "Archived", progress: 0, team: 1, activity: "1w ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeading title="Projects" description="View and manage all active and archived projects." />
        <Link href="/dashboard/projects/new">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2 font-medium shadow-md">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
          >
            <Card className="bg-[#19191b] border-zinc-800/60 shadow-none  transition-colors group h-full overflow-hidden p-0">
              <CardContent className="p-5 flex flex-col h-full space-y-5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div
                    className={cn(
                      "w-22 h-6 px-2 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      project.status === "Active"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : project.status === "Onboarding"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : project.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50",
                    )}
                  >
                    {project.status}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{project.name}</h3>
                  <p className="text-xs text-zinc-500">{project.client}</p>
                </div>

                <div className="space-y-1.5 mt-auto">
                  <div className="flex items-center justify-between text-[10px] font-medium transition-colors">
                    <span className="text-zinc-500">Progress</span>
                    <span className="text-zinc-400">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(project.team, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-[#151518] flex items-center justify-center text-[10px] font-bold text-zinc-300"
                      >
                        {i === 0 ? "JD" : i === 1 ? "MK" : "+"}
                      </div>
                    ))}
                    {project.team > 3 && (
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-[#151518] flex items-center justify-center text-[10px] font-bold text-zinc-500">+{project.team - 2}</div>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" />
                    {project.activity}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
