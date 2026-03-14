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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const members = [
    { id: 1, name: "John Doe", email: "john@agency.com", role: "admin", designation: "Agency Owner", status: "active" },
    { id: 2, name: "Mike Ross", email: "mike@agency.com", role: "member", designation: "Lead Designer", status: "active" },
    { id: 3, name: "Sarah Connor", email: "sarah@agency.com", role: "member", designation: "Developer", status: "active" },
    { id: 4, name: "Harvey Specter", email: "harvey@agency.com", role: "viewer", designation: "Legal", status: "pending" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Team</h2>
          <p className="text-zinc-500">Manage who has access to this project and their permissions.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
           <Input 
             placeholder="Search team members..." 
             className="pl-10 h-10 bg-zinc-900 border-zinc-800 focus:ring-zinc-700 rounded-lg"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="bg-zinc-900 border-zinc-800 shadow-none hover:bg-zinc-800/40 transition-colors group">
            <div className="p-5 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{member.name}</h3>
                    {member.status === "pending" && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-amber-500/20">PENDING</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium pt-1">{member.designation}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                 <div className={cn(
                   "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                   member.role === "admin" ? "bg-emerald-500/10 text-emerald-500" :
                   member.role === "viewer" ? "bg-zinc-800 text-zinc-500" :
                   "bg-blue-500/10 text-blue-500"
                 )}>
                   {member.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : 
                    member.role === "viewer" ? <Shield className="h-3 w-3" /> : 
                    <ShieldAlert className="h-3 w-3" />}
                   {member.role}
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
