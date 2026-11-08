"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Users, CheckSquare, Milestone, FileBox, Activity, MoreVertical, ExternalLink, AlertCircle, Briefcase, Copy, Trash2, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { getProjectById } from "@server/projects";
import UpdateStatus from "./_components/update-status";
import { toast } from "sonner";

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = React.use(params);
  const [project, setProject] = React.useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-dashboard-border flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              {project ? (
                <>
                  <h1 className="text-xl font-bold text-zinc-100">{project.name}</h1>
                  
                  <UpdateStatus
                    project={project}
                    loading={loading}
                    setLoading={setLoading}
                    setProject={setProject}
                  />
                  
                </>
              ) : (
                <>
                  <div className="h-6 w-48 bg-zinc-800/80 rounded animate-pulse" />
                  <div className="h-6 w-14 bg-zinc-800/80 rounded animate-pulse shrink-0" />
                </>
              )}
            </div>
            <p className="text-zinc-500 flex items-center gap-2 mt-1.5 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Client: {project ? <span className="text-zinc-300">{project.client.name}</span> : <span className="inline-block h-3.5 w-24 bg-zinc-800/80 rounded animate-pulse align-middle" />}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="flex items-center gap-1.5 text-zinc-400">
                <CheckSquare className="h-3.5 w-3.5" />
                {project ? (
                  <span>
                    {project.onboardingItem?.filter((item: any) => item.status === "APPROVED").length ?? 0}/{project.onboardingItem?.length ?? 0} Items Approved
                  </span>
                ) : (
                  <span className="inline-block h-3.5 w-28 bg-zinc-800/80 rounded animate-pulse align-middle" />
                )}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 gap-2 font-medium"
            asChild
          >
            <Link href={`/dashboard/projects/${id}/portal`}>
              <ExternalLink className="h-4 w-4" />
              Client Portal
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 w-10 h-9"
              >
                <MoreVertical className="h-4 w-4 text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 bg-[#151518] border-dashboard-border text-zinc-200"
            >
              <DropdownMenuLabel className="text-xs text-zinc-500 font-medium">Project Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-dashboard-border" />
              <DropdownMenuItem
                className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100"
                onClick={() => {
                  navigator.clipboard.writeText(id);
                  toast.success("Project ID copied!");
                }}
              >
                <Copy className="h-4 w-4 text-zinc-400" />
                Copy Project ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100"
                onClick={() => router.push(`/dashboard/projects/${id}/portal`)}
              >
                <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                Manage Client Portal
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-dashboard-border" />
              <DropdownMenuItem
                className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100"
                onClick={() => router.push(`/dashboard/projects/${id}/members`)}
              >
                <Users className="h-4 w-4 text-zinc-400" />
                Manage Members
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="border-b border-dashboard-border relative">
        <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden no-scrollbar">
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
