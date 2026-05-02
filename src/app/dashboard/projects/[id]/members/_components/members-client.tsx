"use client";

import React, { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Mail,
  Filter,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AssignMemberModal from "./assign-member-modal";
import { removeProjectMember, updateProjectMemberRole } from "@server/projectMembers";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectMemberRole } from "@/generated/prisma";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";

type Member = {
  id: string;
  role: ProjectMemberRole;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
};

type Props = {
  projectId: string;
  initialMembers: Member[];
};

export default function MembersClient({ projectId, initialMembers }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const filteredMembers = initialMembers.filter(m => 
    (m.user.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (m.user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member from the project?")) return;

    setLoadingMemberId(memberId);
    const result = await removeProjectMember(memberId, projectId);
    setLoadingMemberId(null);

    if (result.success) {
      toast.success("Member removed successfully");
    } else {
      toast.error(result.error || "Failed to remove member");
    }
  };

  const handleUpdateRole = async (memberId: string, role: ProjectMemberRole) => {
    setLoadingMemberId(memberId);
    const result = await updateProjectMemberRole(memberId, projectId, role);
    setLoadingMemberId(null);

    if (result.success) {
      toast.success(`Role updated to ${role}`);
    } else {
      toast.error(result.error || "Failed to update role");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Project Team</h2>
          <p className="text-sm text-zinc-400">Manage who has access to this project and their permissions.</p>
        </div>
        <AssignMemberModal projectId={projectId} />
      </div>

      <DashboardCard
        icon={
          <div className="relative grow w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
            />
          </div>
        }
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box min-h-0">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-sm font-semibold shrink-0 mt-1 border border-dashboard-border/50 overflow-hidden">
                    {member.user.avatarUrl ? (
                      <img
                        src={member.user.avatarUrl}
                        alt={member.user.name || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (member.user.name || member.user.email)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{member.user.name || "Unnamed"}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                      <Mail className="h-3 w-3 opacity-70" />
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      member.role === "ADMIN"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : member.role === "VIEWER"
                          ? "bg-zinc-800/80 text-zinc-400 border-dashboard-border/50"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    )}
                  >
                    {member.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : member.role === "VIEWER" ? <Shield className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                    {member.role}
                  </div>
                  <div className="flex items-center gap-1">
                    {loadingMemberId === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-600 mr-2" />
                    ) : (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#19191b] border-dashboard-border text-zinc-300"
                          >
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.id, "ADMIN")}
                              className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                            >
                              Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.id, "MEMBER")}
                              className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                            >
                              Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateRole(member.id, "VIEWER")}
                              className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                            >
                              Viewer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <p className="text-sm italic">No team members found.</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
