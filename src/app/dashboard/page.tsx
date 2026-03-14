"use client";

import React from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  FileText,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "@/lib/db";

export default function DashboardPage() {
  const stats = [
    { label: "Active Projects", value: "12", icon: <Briefcase className="h-4 w-4" />, color: "text-blue-500" },
    { label: "Pending Approvals", value: "5", icon: <Clock className="h-4 w-4" />, color: "text-amber-500" },
    { label: "Completed Milestones", value: "24", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500" },
    { label: "Payment Pending", value: "$4.2k", icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500" },
  ];

  const recentProjects = [
    { name: "Acme Web Redesign", client: "Acme Corp", status: "In Review", progress: 65 },
    { name: "Brand Guidelines", client: "Starlight Inc", status: "Onboarding", progress: 20 },
    { name: "E-commerce Platform", client: "GearHead", status: "Active", progress: 45 },
    { name: "Mobile App MVP", client: "Swiftly", status: "Completed", progress: 100 },
  ];


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your agency today.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className=" shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-4">
             {recentProjects.map((project, i) => (
               <Link key={i} href={`/dashboard/projects/${i+1}`}>
                 <Card className="transition-colors shadow-none group">
                   <div className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                         <Briefcase className="h-5 w-5" />
                       </div>
                       <div>
                         <h3 className="font-medium group-hover:text-white transition-colors">{project.name}</h3>
                         <p className="text-sm text-zinc-500">{project.client}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       <div className="text-right hidden sm:block">
                         <p className="text-xs text-zinc-500 mb-1">Progress</p>
                         <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-emerald-500 transition-all" 
                             style={{ width: `${project.progress}%` }} 
                           />
                         </div>
                       </div>
                       <div className={cn(
                         "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                         project.status === "In Review" ? "bg-amber-500/10 text-amber-500" :
                         project.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" :
                         project.status === "Onboarding" ? "bg-blue-500/10 text-blue-500" :
                         "bg-zinc-800 text-zinc-400"
                       )}>
                         {project.status}
                       </div>
                     </div>
                   </div>
                 </Card>
               </Link>
             ))}
          </div>
        </div>

        {/* Activity Feed Snippet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Activity Log</h2>
            <Link href="/dashboard/activity" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Full log
            </Link>
          </div>
          <Card className="bg-zinc-900 border-zinc-800 shadow-none">
            <CardContent className="p-6">
              <div className="space-y-6">
                {[
                  { time: "2h ago", text: "Client uploaded Logo.png", type: "file" },
                  { time: "4h ago", text: "New invoice generated for Acme", type: "payment" },
                  { time: "1d ago", text: "Starlight Inc. approved Design", type: "approval" },
                  { time: "2d ago", text: "Added Mike to Mobile App project", type: "team" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-zinc-300">{item.text}</p>
                      <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-wider">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
