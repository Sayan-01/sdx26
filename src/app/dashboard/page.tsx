"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Plus, Clock, CheckCircle2, ArrowUpRight, TrendingUp, DollarSign, ChevronRight, FileBox, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "./_components/dashboard-heading";

export default function DashboardPage() {
  const stats = [
    { label: "Active Projects", value: "12", icon: <Briefcase className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Approvals", value: "5", icon: <Clock className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completed Milestones", value: "24", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Payment Pending", value: "$4.2k", icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const recentProjects = [
    { name: "Acme Web Redesign", client: "Acme Corp", status: "In Review", progress: 65, date: "2 days ago" },
    { name: "Brand Guidelines", client: "Starlight Inc", status: "Onboarding", progress: 20, date: "5 days ago" },
    { name: "E-commerce Platform", client: "GearHead", status: "Active", progress: 45, date: "1 week ago" },
    { name: "Mobile App MVP", client: "Swiftly", status: "Completed", progress: 100, date: "2 weeks ago" },
    { name: "Dashboard UI Kit", client: "Pixel Perfect", status: "Active", progress: 80, date: "3 weeks ago" },
    { name: "Dashboard UI Kit", client: "Pixel Perfect", status: "Active", progress: 80, date: "3 weeks ago" },
    { name: "Dashboard UI Kit", client: "Pixel Perfect", status: "Active", progress: 80, date: "3 weeks ago" },
  ];

  const activities = [
    { time: "2h ago", text: "Client uploaded Logo.png", type: "file", icon: <FileBox className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { time: "4h ago", text: "New invoice generated for Acme", type: "payment", icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
    { time: "1d ago", text: "Starlight Inc. approved Design", type: "approval", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { time: "2d ago", text: "Added Mike to Mobile App project", type: "team", icon: <Users className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500  h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading
          title="Welcome back, John"
          description="Here's what's happening with your agency today."
        />
        <Link href="/dashboard/projects/new">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="relative hover:bg-zinc-900/70 transition-colors overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5 font-medium">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+12%</span> <span className="text-zinc-500">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Recent Projects */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0  border border-dashboard-border rounded-xl bg-[#19191b] group relative shadow-xl shadow-black/20 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between px-5 pt-3">
            <h2 className="text-md font-semibold flex items-center gap-2">Recent Projects</h2>
            <Link href="/dashboard/projects">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-white h-6"
              >
                View all <ArrowUpRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <Card className=" bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 ">
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
              {recentProjects.map((project, i) => (
                <Link
                  key={i}
                  href={`/dashboard/projects/${i + 1}`}
                  className="flex w-full hover:bg-zinc-900/50 transition-colors group px-5 min-h-[85px] items-center border-b border-b-dashboard-border"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base">{project.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {project.client} • {project.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-14 sm:pl-0">
                      <div className="hidden md:block text-right w-24">
                        <div className="flex justify-between items-end mb-1.5">
                          <p className="text-[10px] text-zinc-500 font-medium">Progress</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{project.progress}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-22 h-6 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                            project.status === "In Review"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : project.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : project.status === "Onboarding"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                          )}
                        >
                          {project.status}
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity Feed Snippet */}
        <div className="flex flex-col gap-3 min-h-0 border-dashboard-border border rounded-xl bg-[#19191b] group relative shadow-xl shadow-black/20">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between px-5 pt-3">
            <h2 className="text-md font-semibold flex items-center gap-2">Activity Log</h2>
            <Link href="/dashboard/activity">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-white h-6"
              >
                Full log <ArrowUpRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <Card className="border-dashboard-border/60 bg-[#151518] shadow-none flex-1 flex flex-col justify-between overflow-hidden min-h-0 p-0">
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box-1">
              {activities.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 px-5 min-h-[85px] items-center hover:bg-zinc-900/50 transition-colors group border-b border-b-dashboard-border"
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-dashboard-border/30", item.bg, item.color)}>{item.icon}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug">{item.text}</p>
                    <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-dashboard-border/60 bg-zinc-900/20 mt-auto">
              <Link href="/dashboard/activity">
                <Button
                  variant="outline"
                  className="w-full text-xs font-medium border-dashboard-border hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                >
                  View All Activity
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
