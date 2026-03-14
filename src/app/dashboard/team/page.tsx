"use client";

import React from "react";
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Trash2,
  ExternalLink,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AgencyTeamPage() {
  const team = [
    { name: "John Doe", email: "john@agency.com", role: "Owner", designation: "Founder", joined: "Mar 2025", status: "Active" },
    { name: "Mike Ross", email: "mike@agency.com", role: "Member", designation: "Lead Designer", joined: "May 2025", status: "Active" },
    { name: "Sarah Connor", email: "sarah@agency.com", role: "Member", designation: "Senior Developer", joined: "Jun 2025", status: "Active" },
    { name: "Harvey Specter", email: "harvey@agency.com", role: "Member", designation: "Project Manager", joined: "Sep 2025", status: "Active" },
    { name: "Rachel Zane", email: "rachel@agency.com", role: "Member", designation: "Junior Designer", joined: "Feb 2026", status: "Pending" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Agency Team</h2>
          <p className="text-zinc-500">Manage your internal team members and their roles across the whole agency.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Team Member
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10 h-10 bg-zinc-900 border-zinc-800 focus:ring-zinc-700 w-full"
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 hidden sm:flex">Export CSV</Button>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="w-[300px] text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Member</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Designation</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Role</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Joined</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member, i) => (
              <TableRow key={i} className="border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white transition-colors">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400">{member.designation}</TableCell>
                <TableCell>
                   <span className={cn(
                     "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                     member.role === "Owner" ? "text-emerald-500" : "text-zinc-500"
                   )}>
                     {member.role}
                   </span>
                </TableCell>
                <TableCell className="text-zinc-500 text-sm">{member.joined}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    <span className="text-sm font-medium">{member.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 shadow-none">
           <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                 <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                 <h3 className="font-bold">Team Permissions</h3>
                 <p className="text-xs text-zinc-500 leading-relaxed">Control exactly what your staff can see – specifically payments and client management.</p>
              </div>
              <Button variant="link" className="p-0 h-auto text-xs text-zinc-400 hover:text-white">Manage Roles <ExternalLink className="ml-1 h-3 w-3" /></Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
