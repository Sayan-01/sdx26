"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Settings, 
  Users, 
  CheckSquare, 
  Milestone, 
  FileBox, 
  Activity,
  MoreVertical,
  ExternalLink,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getProjectById } from "@server/projects";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const { id } = React.use(params);
  const [project, setProject] = React.useState<any>(null);

  useEffect(() => {
    const getProject = async () => {
      const project = await getProjectById(id);
      setProject(project.project);
      console.log(project);
      
    };
    getProject();
  }, []);

  const tabs = [
    { label: "Overview", icon: <Activity className="h-4 w-4" />, href: `/dashboard/projects/${id}` },
    { label: "Onboarding", icon: <CheckSquare className="h-4 w-4" />, href: `/dashboard/projects/${id}/onboarding` },
    { label: "Milestones", icon: <Milestone className="h-4 w-4" />, href: `/dashboard/projects/${id}/milestones` },
    { label: "Files", icon: <FileBox className="h-4 w-4" />, href: `/dashboard/projects/${id}/files` },
    { label: "Portal", icon: <ExternalLink className="h-4 w-4" />, href: `/dashboard/projects/${id}/portal` },
    { label: "Scope Log", icon: <AlertCircle className="h-4 w-4" />, href: `/dashboard/projects/${id}/scope` },
    { label: "Members", icon: <Users className="h-4 w-4" />, href: `/dashboard/projects/${id}/members` },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-dashboard-border flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-zinc-100">{project?.name}</h1>
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Active</div>
            </div>
            <p className="text-zinc-500 flex items-center gap-2 mt-1 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Client: <span className="text-zinc-300">{project?.client.name}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="flex items-center gap-1.5 text-zinc-400">
                <CheckSquare className="h-3.5 w-3.5" />
                4/12 Items Approved
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 gap-2 font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Client Portal
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 w-10"
          >
            <MoreVertical className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="border-b border-dashboard-border relative">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn("relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap", isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300")}
              >
                <div className={cn("flex items-center gap-2", isActive ? "text-zinc-100" : "text-zinc-500")}>
                  {tab.icon}
                  {tab.label}
                </div>
                {isActive && <div className="absolute -bottom-px left-0 w-full h-[2px] bg-white rounded-t-full" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grow  pb-6">{children}</div>
    </div>
  );
}
