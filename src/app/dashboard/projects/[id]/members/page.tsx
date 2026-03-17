"use client";

import React from "react";
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Mail,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const members = [
    { id: 1, name: "John Doe", email: "john@agency.com", role: "admin", designation: "Agency Owner", status: "active", avatar: "bg-indigo-500/10 text-indigo-500" },
    { id: 2, name: "Mike Ross", email: "mike@agency.com", role: "member", designation: "Lead Designer", status: "active", avatar: "bg-emerald-500/10 text-emerald-500" },
    { id: 3, name: "Sarah Connor", email: "sarah@agency.com", role: "member", designation: "Developer", status: "active", avatar: "bg-rose-500/10 text-rose-500" },
    { id: 4, name: "Harvey Specter", email: "harvey@agency.com", role: "viewer", designation: "Legal", status: "pending", avatar: "bg-zinc-800 text-zinc-400 border border-dashboard-border" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Project Team</h2>
          <p className="text-sm text-zinc-400">Manage who has access to this project and their permissions.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
          <UserPlus className="h-4 w-4" />
          Assign Member
        </Button>
      </div>

      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 pt-3">
          <div className="relative flex-grow w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <Input 
              placeholder="Search team members..." 
              className="pl-9 h-9 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
            />
          </div>
          <Button variant="ghost" className="h-9 px-4 rounded-lg text-xs text-zinc-400 hover:text-white transition-all gap-2 font-medium">
            <Filter className="h-3.5 w-3.5" />
            Filter View
          </Button>
        </div>

        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-b-xl border-t border-dashboard-border/60 mt-2">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 mt-1",
                    member.avatar
                  )}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{member.name}</h3>
                      {member.status === "pending" && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md font-medium uppercase tracking-wider border border-amber-500/20 flex items-center gap-1.5">
                           PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                      <Mail className="h-3 w-3 opacity-70" />
                      {member.email}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider pt-0.5">{member.designation}</p>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0">
                   <div className={cn(
                     "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                     member.role === "admin" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                     member.role === "viewer" ? "bg-zinc-800/80 text-zinc-400 border-dashboard-border/50" :
                     "bg-blue-500/10 text-blue-500 border-blue-500/20"
                   )}>
                     {member.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : 
                      member.role === "viewer" ? <Shield className="h-3 w-3" /> : 
                      <ShieldAlert className="h-3 w-3" />}
                     {member.role}
                   </div>
                   <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                         <MoreVertical className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg">
                         <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
