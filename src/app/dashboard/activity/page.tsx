"use client";

import React from "react";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileBox, 
  MessageSquare, 
  UserPlus, 
  CreditCard,
  Briefcase,
  Layers,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const activities = [
    { id: 1, type: "file", actor: "Mike Ross", action: "uploaded", target: "Homepage_Design_v3.png", project: "Acme Web Redesign", time: "2 hours ago", unread: true },
    { id: 2, type: "approval", actor: "Client (Acme Corp)", action: "approved", target: "Onboarding Checklist", project: "Acme Web Redesign", time: "4 hours ago", unread: true },
    { id: 3, type: "payment", actor: "System", action: "generated invoice for", target: "Milestone 1", project: "Starlight Brand Identity", time: "1 day ago", unread: false },
    { id: 4, type: "message", actor: "Sarah Connor", action: "replied to", target: "Header feedback", project: "Acme Web Redesign", time: "1 day ago", unread: false },
    { id: 5, type: "team", actor: "John Doe", action: "added", target: "Harvey Specter", project: "Legal Audit", time: "2 days ago", unread: false },
    { id: 6, type: "project", actor: "John Doe", action: "created new project", target: "Mobile App MVP", project: "Swiftly", time: "3 days ago", unread: false },
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

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-zinc-500">Stay updated with everything happening across your agency.</p>
        </div>
        <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900">
          Mark all as read
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
           <Input 
             placeholder="Search activity..." 
             className="pl-10 h-10 bg-zinc-900 border-zinc-800 focus:ring-zinc-700 w-full"
           />
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className={cn(
            "p-4 rounded-xl border transition-all flex items-start gap-4 group",
            activity.unread ? "bg-white/5 border-zinc-700 shadow-lg" : "bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
              activity.unread ? "bg-white text-zinc-950" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
            )}>
              {getIcon(activity.type)}
            </div>
            
            <div className="grow space-y-1">
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-white">{activity.actor}</span>{" "}
                <span className="text-zinc-400">{activity.action}</span>{" "}
                <span className="font-bold text-white">{activity.target}</span>{" "}
                {activity.project && (
                  <>
                    <span className="text-zinc-500 text-xs">in</span>{" "}
                    <span className="text-zinc-300 font-medium underline underline-offset-4 decoration-zinc-800 cursor-pointer hover:text-white transition-colors">{activity.project}</span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{activity.time}</span>
                 {activity.unread && (
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 )}
              </div>
            </div>

            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white">
              Details
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
         <Button variant="ghost" className="text-zinc-500 hover:text-white gap-2">
            Load more activity
            <Clock className="h-4 w-4" />
         </Button>
      </div>
    </div>
  );
}
