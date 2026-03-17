"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  CheckSquare, 
  Milestone, 
  FileBox, 
  Activity,
  MoreVertical,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const { id } = React.use(params);

  const tabs = [
    { label: "Overview", icon: <Activity className="h-4 w-4" />, href: `/dashboard/projects/${id}` },
    { label: "Onboarding", icon: <CheckSquare className="h-4 w-4" />, href: `/dashboard/projects/${id}/onboarding` },
    { label: "Milestones", icon: <Milestone className="h-4 w-4" />, href: `/dashboard/projects/${id}/milestones` },
    { label: "Files", icon: <FileBox className="h-4 w-4" />, href: `/dashboard/projects/${id}/files` },
    { label: "Scope Log", icon: <AlertCircle className="h-4 w-4" />, href: `/dashboard/projects/${id}/scope` },
    { label: "Members", icon: <Users className="h-4 w-4" />, href: `/dashboard/projects/${id}/members` },
  ];

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="font-bold text-lg">AW</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">Acme Web Redesign</h1>
                <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wider uppercase">ACTIVE</div>
              </div>
              <p className="text-zinc-500 flex items-center gap-2 mt-1">
                Client: Acme Corp <span className="text-zinc-800">•</span> <span className="text-zinc-500 flex items-center gap-1"><CheckSquare className="h-3 w-3" /> 4/12 Items Approved</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 gap-2">
             <ExternalLink className="h-4 w-4" />
             Client Portal
           </Button>
           <Button variant="outline" size="icon" className="border-zinc-800 hover:bg-zinc-900">
             <MoreVertical className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/50">
        {tabs.map((tab) => (
          <Link 
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
              pathname === tab.href 
                ? "border-white text-white" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grow pb-5">
        {children}
      </div>
    </div>
  );
}
