"use client";

import React, { useEffect, useState, useMemo } from "react";
import { UserPlus, Search, MoreVertical, Mail, Shield, Trash2, ExternalLink, Plus, Download, Loader2, Edit, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardHeading from "../_components/dashboard-heading";
import Link from "next/link";
import { getAllTeamMembers } from "../../../../server/teamMember";
import { toast } from "sonner";

export default function AgencyTeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTeamMembers();
      if(res.success) {
        setTeams(res.teamMembers);
      } else {
        toast.error("Failed to fetch team members");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching team");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(()=> {
    fetchTeams();
  }, [])

  const filteredTeams = useMemo(() => {
    if (!searchTerm) return teams;
    return teams.filter((member) => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teams, searchTerm]);

  const exportToCSV = () => {
    if (filteredTeams.length === 0) return;
    
    const headers = ["Name", "Email", "Role", "Designation", "Joined", "Status"];
    const csvData = filteredTeams.map(member => [
      member.name || "Unnamed",
      member.email,
      member.role,
      member.teamMembers?.[0]?.designation || (member.role === "OWNER" ? "Founder" : "Team Member"),
      new Date(member.createdAt).toLocaleDateString(),
      member.password ? "Active" : "Pending"
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `agency-team-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeading
          title="Agency Team"
          description="Manage your internal team members and their roles across the whole agency."
        />
        <Link href="/dashboard/team/invite">
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2 h-10">
          <UserPlus className="h-4 w-4" />
          Invite Team Member
        </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={filteredTeams.length === 0}
            className="bg-[#19191b] border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2 h-10 px-4 transition-colors hidden sm:flex"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchTeams}
            disabled={isLoading}
            className="bg-[#19191b] border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800 h-10 w-10 transition-colors"
          >
            <Plus className={cn("h-4 w-4 transition-transform", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-dashboard-border overflow-hidden bg-[#151518]">
        <Table>
          <TableHeader className="bg-[#19191b]">
            <TableRow className="border-dashboard-border hover:bg-transparent">
              <TableHead className="w-[300px] text-zinc-400 font-bold uppercase tracking-widest text-[10px] p-5">Member</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Designation</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Role</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Joined</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] ">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                    <p className="text-sm text-zinc-500">Loading team members...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-bold text-zinc-400">No team members found</p>
                    <p className="text-xs text-zinc-500">Try adjusting your search or inviting someone.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((member: any, i: number) => (
                <TableRow
                  key={member.id}
                  className="border-dashboard-border hover:bg-[#19191b] transition-colors group"
                >
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-dashboard-border flex items-center justify-center font-bold text-xs text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white transition-colors uppercase">
                        {(member.name || "?")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name || "Unnamed User"}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                <TableCell className="text-zinc-400">{member.designation || "Team Member"}</TableCell>
                  <TableCell>
                  <span className={cn("py-0.5 rounded text-[10px] font-bold uppercase tracking-widest", member.role === "OWNER" ? "text-emerald-500" : "text-zinc-500")}>{member.role}</span>
                  </TableCell>
                <TableCell className="text-zinc-500 text-sm">{new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", member.password ? "bg-emerald-500" : "bg-amber-500")} />
                      <span className="text-sm font-medium">{member.password ? "Active" : "Pending"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-600 hover:text-white h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#19191b] border-dashboard-border text-zinc-400 w-50">
                        <DropdownMenuLabel className="text-white text-xs">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-dashboard-border" />
                        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer gap-2">
                          <UserCheck className="h-4 w-4" /> Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer gap-2">
                          <Edit className="h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-dashboard-border" />
                        <DropdownMenuItem className="focus:bg-zinc-800 text-red-500 focus:text-red-400 cursor-pointer gap-2">
                          <Trash2 className="h-4 w-4" /> Remove from Agency
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#19191b] border-dashboard-border shadow-none p-0">
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center text-zinc-500">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Team Permissions</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Control exactly what your staff can see – specifically payments and client management.</p>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-zinc-400 hover:text-white"
            >
              Manage Roles <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
