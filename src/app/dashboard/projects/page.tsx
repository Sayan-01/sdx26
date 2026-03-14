"use client";

import React from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  MoreVertical, 
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Acme Web Redesign", client: "Acme Corp", status: "Active", progress: 65, team: 4, activity: "2h ago" },
    { id: 2, name: "Brand Book", client: "Starlight Inc", status: "Onboarding", progress: 20, team: 2, activity: "5h ago" },
    { id: 3, name: "E-commerce Platform", client: "GearHead", status: "Active", progress: 45, team: 3, activity: "1d ago" },
    { id: 4, name: "Mobile App MVP", client: "Swiftly", status: "Completed", progress: 100, team: 5, activity: "3d ago" },
    { id: 5, name: "Legal Audit Site", client: "Specter Litt", status: "Archived", progress: 0, team: 1, activity: "1w ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-zinc-500">View and manage all active and archived projects.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search by name, client, or tag..." 
              className="pl-10 h-10 bg-transparent border-none focus:ring-0 w-full"
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2">
               <Filter className="h-4 w-4" />
               Filter
            </Button>
            <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
               <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800 text-white"><LayoutGrid className="h-4 w-4" /></Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500"><List className="h-4 w-4" /></Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
            <Card className="bg-zinc-900 border-zinc-800 shadow-none hover:bg-zinc-800/40 transition-all group h-full">
              <CardContent className="p-6 flex flex-col h-full space-y-6">
                <div className="flex items-start justify-between">
                   <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                      <Briefcase className="h-6 w-6" />
                   </div>
                   <div className={cn(
                     "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                     project.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                     project.status === "Onboarding" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                     project.status === "Completed" ? "bg-zinc-800 text-zinc-400 border-zinc-700" :
                     "bg-rose-500/10 text-rose-500 border-rose-500/20"
                   )}>
                     {project.status}
                   </div>
                </div>

                <div className="space-y-1">
                   <h3 className="text-xl font-bold group-hover:text-white transition-colors truncate">{project.name}</h3>
                   <p className="text-sm text-zinc-500">{project.client}</p>
                </div>

                <div className="space-y-2 mt-auto">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Progress</span>
                      <span className="text-zinc-300 font-bold">{project.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          project.status === "Completed" ? "bg-emerald-500" : "bg-blue-500"
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(project.team, 3) }).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-zinc-850 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold">
                           {i === 0 ? "JD" : i === 1 ? "MK" : "+"}
                        </div>
                      ))}
                      {project.team > 3 && (
                        <div className="w-8 h-8 rounded-full bg-zinc-850 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                           +{project.team - 2}
                        </div>
                      )}
                   </div>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
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
