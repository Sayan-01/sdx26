"use client";

import React, { useState } from "react";
import { 
  Bell, CheckCircle2, Clock, FileBox, MessageSquare, UserPlus, 
  CreditCard, Briefcase, Layers, Search, BarChart3, Users, Zap,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "../_components/dashboard-heading";

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const todayActivities = [
    { id: 1, type: "file", actor: "Mike Ross", action: "uploaded", target: "Homepage_Design_v3.png", project: "Acme Web Redesign", time: "2 hours ago", unread: true },
    { id: 2, type: "approval", actor: "Client (Acme Corp)", action: "approved", target: "Onboarding Checklist", project: "Acme Web Redesign", time: "4 hours ago", unread: true },
    { id: 7, type: "message", actor: "Jane Doe", action: "commented on", target: "Hero Section Draft", project: "Acme Web Redesign", time: "5 hours ago", unread: true },
  ];

  const yesterdayActivities = [
    { id: 3, type: "payment", actor: "System", action: "generated invoice for", target: "Milestone 1", project: "Starlight Brand Identity", time: "1 day ago", unread: false },
    { id: 4, type: "message", actor: "Sarah Connor", action: "replied to", target: "Header feedback", project: "Acme Web Redesign", time: "1 day ago", unread: false },
  ];

  const olderActivities = [
    { id: 5, type: "team", actor: "John Doe", action: "added", target: "Harvey Specter", project: "Legal Audit", time: "2 days ago", unread: false },
    { id: 6, type: "project", actor: "John Doe", action: "created new project", target: "Mobile App MVP", project: "Swiftly", time: "3 days ago", unread: false },
  ];

  const stats = [
    { label: "Files Uploaded", value: "12", icon: <FileBox className="text-blue-500 h-4 w-4" /> },
    { label: "Tasks Completed", value: "28", icon: <CheckCircle2 className="text-emerald-500 h-4 w-4" /> },
    { label: "Messages", value: "84", icon: <MessageSquare className="text-amber-500 h-4 w-4" /> },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "file": return <FileBox className="h-4 w-4" />;
      case "approval": return <CheckCircle2 className="h-4 w-4" />;
      case "payment": return <CreditCard className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "team": return <UserPlus className="h-4 w-4" />;
      case "project": return <Briefcase className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className={cn(
      "p-4 rounded-xl border transition-all flex items-start gap-4 group",
      activity.unread ? "bg-[#19191b] border-dashboard-border" : "bg-[#151518] border-dashboard-border/50 hover:bg-[#19191b]"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
        activity.unread ? "bg-white text-zinc-950" : "bg-zinc-800/50 border border-dashboard-border/50 text-zinc-500 group-hover:text-zinc-300"
      )}>
        {getIcon(activity.type)}
      </div>
      
      <div className="grow space-y-1 pt-0.5">
        <p className="text-sm leading-relaxed">
          <span className="font-bold text-white">{activity.actor}</span>{" "}
          <span className="text-zinc-400">{activity.action}</span>{" "}
          <span className="font-bold text-white">{activity.target}</span>{" "}
          {activity.project && (
            <>
              <span className="text-zinc-500 text-xs">in</span>{" "}
              <span className="text-zinc-300 font-medium cursor-pointer hover:text-white transition-colors">{activity.project}</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{activity.time}</span>
            {activity.unread && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
        </div>
      </div>

      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white">
        Details
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeading title="Activity Feed" description="Stay updated with everything happening across your agency." />
        <Button variant="outline" className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800">
          Mark all as read
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Main Feed Column */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
               <Input 
                 placeholder="Search activity..." 
                 className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full"
               />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              {["All", "Files", "Messages", "Approvals"].map(filter => (
                <Button 
                  key={filter} 
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "h-10 px-4 rounded-lg shrink-0",
                    activeFilter === filter ? "bg-white text-black hover:bg-zinc-200" : "bg-[#151518] border-dashboard-border hover:bg-zinc-800 text-zinc-400"
                  )}
                >
                  {filter}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-10 px-3 shrink-0 bg-[#151518] border-dashboard-border hover:bg-zinc-800 text-zinc-400">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="space-y-8 flex-1 overflow-y-auto pr-2 no-scrollbar">
            {/* Today */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Today
              </h3>
              <div className="space-y-3">
                {todayActivities.map(act => <ActivityItem key={act.id} activity={act} />)}
              </div>
            </div>

            {/* Yesterday */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Yesterday</h3>
              <div className="space-y-3">
                {yesterdayActivities.map(act => <ActivityItem key={act.id} activity={act} />)}
              </div>
            </div>

            {/* Older */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Week</h3>
              <div className="space-y-3">
                {olderActivities.map(act => <ActivityItem key={act.id} activity={act} />)}
              </div>
            </div>

            <div className="pt-4 pb-8 text-center">
               <Button variant="ghost" className="text-zinc-500 hover:text-white gap-2">
                  Load more activity
                  <Clock className="h-4 w-4" />
               </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center gap-2 px-5 pt-3">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h2 className="text-md font-semibold">Weekly Overview</h2>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-5 rounded-b-xl border-t border-dashboard-border/60 border-0">
              <div className="space-y-4">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#19191b] border border-dashboard-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-3 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b]">
            <div className="flex items-center gap-2 px-5 pt-3">
              <Zap className="h-4 w-4 text-amber-500" />
              <h2 className="text-md font-semibold">Trending Projects</h2>
            </div>
            <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 transform rounded-b-xl border-t border-dashboard-border/60 border-0">
              <div className="divide-y divide-zinc-800/60 box">
                {[
                  { name: "Acme Web Redesign", activity: "High", color: "bg-emerald-500" },
                  { name: "Starlight Brand", activity: "Medium", color: "bg-amber-500" },
                  { name: "Mobile App MVP", activity: "Low", color: "bg-zinc-500" }
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-dashboard-border flex items-center justify-center text-xs font-bold text-zinc-400">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-zinc-200">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={cn("w-1.5 h-1.5 rounded-full", p.color)} />
                       <span className="text-xs text-zinc-500">{p.activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
