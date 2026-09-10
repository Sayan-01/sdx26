"use client";

import React, { useEffect, useState, useMemo } from "react";
import { UserPlus, Search, MoreVertical, Mail, Shield, Trash2, ExternalLink, Plus, Download, Loader2, Edit, UserCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DashboardHeading from "../_components/dashboard-heading";
import Link from "next/link";
import { getAllTeamMembers, updateMemberRole, updateMemberName, removeMember } from "../../../../server/teamMember";
import { toast } from "sonner";

export default function AgencyTeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [editRole, setEditRole] = useState<"OWNER" | "TEAM">("TEAM");
  const [editDesignation, setEditDesignation] = useState("");
  const [editName, setEditName] = useState("");

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTeamMembers();
      if (res.success) {
        setTeams(res.teamMembers);
        console.log(res.teamMembers);

      } else {
        toast.error("Failed to fetch team members");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching team");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    if (!searchTerm) return teams;
    return teams.filter((member) => member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || member.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teams, searchTerm]);

  const exportToCSV = () => {
    if (filteredTeams.length === 0) return;

    const headers = ["Name", "Email", "Role", "Designation", "Joined", "Status"];
    const csvData = filteredTeams.map((member) => [
      member.name || "Unnamed",
      member.email,
      member.role,
      member.teamMembers?.[0]?.designation || (member.role === "OWNER" ? "Founder" : "Team Member"),
      new Date(member.createdAt).toLocaleDateString(),
      member.password ? "ACCEPTED" : "PENDING",
    ]);

    const csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `agency-team-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully!");
  };

  // ── Dialog openers ──────────────────────────────────────────────────────
  const openPermissionsDialog = (member: any) => {
    setSelectedMember(member);
    setEditRole(member.role || "TEAM");
    setEditDesignation(member.designation || "");
    setPermissionsDialogOpen(true);
  };

  const openProfileDialog = (member: any) => {
    setSelectedMember(member);
    setEditName(member.name || "");
    setProfileDialogOpen(true);
  };

  const openRemoveDialog = (member: any) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleUpdatePermissions = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    try {
      const res = await updateMemberRole(selectedMember.id, editRole, editDesignation);
      if (res.success) {
        toast.success("Permissions updated successfully");
        setPermissionsDialogOpen(false);
        fetchTeams();
      } else {
        toast.error(res.error || "Failed to update permissions");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!selectedMember || !editName.trim()) return;
    setIsSaving(true);
    try {
      const res = await updateMemberName(selectedMember.id, editName);
      if (res.success) {
        toast.success("Profile updated successfully");
        setProfileDialogOpen(false);
        fetchTeams();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    try {
      const res = await removeMember(selectedMember.userId);
      if (res.success) {
        toast.success("Member removed from agency");
        setRemoveDialogOpen(false);
        fetchTeams();
      } else {
        toast.error(res.error || "Failed to remove member");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
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

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#19191b]/50 p-2 rounded-xl border border-dashboard-border card_shadow">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
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
            <RefreshCw className={cn("h-4 w-4 transition-transform", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-dashboard-border overflow-hidden bg-[#19191b] group relative card_shadow">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-[#151518] overflow-hidden">
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
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                      <p className="text-sm text-zinc-500">Loading team members...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTeams.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center"
                  >
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
                    <TableCell className="px-5 py-6">
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
                      <span className={cn("py-0.5 rounded text-[10px] font-bold uppercase tracking-widest", member.role === "OWNER" ? "text-emerald-500" : "text-zinc-500")}>{member.role || "TEAM"}</span>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", member.status == "ACCEPTED" ? "bg-emerald-500" : "bg-amber-500")} />
                        <span className="text-sm font-medium">{member.status == "ACCEPTED" ? "Accepted" : "Pending"}</span>
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
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#19191b] border-dashboard-border text-zinc-400 w-52"
                        >
                          <DropdownMenuLabel className="text-white text-xs">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-dashboard-border" />
                          <DropdownMenuItem
                            onClick={() => openPermissionsDialog(member)}
                            className="focus:bg-zinc-800 focus:text-white cursor-pointer gap-2"
                          >
                            <UserCheck className="h-4 w-4" /> Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openProfileDialog(member)}
                            className="focus:bg-zinc-800 focus:text-white cursor-pointer gap-2"
                          >
                            <Edit className="h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-dashboard-border" />
                          <DropdownMenuItem
                            onClick={() => openRemoveDialog(member)}
                            className="focus:bg-zinc-800 text-red-500 focus:text-red-400 cursor-pointer gap-2"
                          >
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#19191b] border-dashboard-border group relative card_shadow transition-all duration-300 p-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-dashboard-border/50 flex items-center justify-center text-zinc-500">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Team Permissions</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Control exactly what your staff can see – specifically payments and client management.</p>
            </div>
            <Link href="/dashboard/team/roles">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-zinc-400 hover:text-white"
              >
                Manage Roles <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ── Edit Permissions Dialog ─────────────────────────────────────── */}
      <Dialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
      >
        <DialogContent className="bg-[#19191b] border-dashboard-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription className="text-zinc-500">Update role and designation for {selectedMember?.name || selectedMember?.email}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Role</Label>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  type="button"
                  onClick={() => setEditRole("TEAM")}
                  className={cn(
                    "flex-1 border-dashboard-border transition-colors",
                    editRole === "TEAM" ? "bg-white/70 border border-white opacity-100" : "opacity-50 bg-transparent text-zinc-400  hover:bg-zinc-800",
                  )}
                >
                  Team
                </Button>
                <Button
                  size="lg"
                  type="button"
                  onClick={() => setEditRole("OWNER")}
                  className={cn(
                    "flex-1 border-dashboard-border transition-colors",
                    editRole === "OWNER" ? "bg-white/70 border-white opacity-100" : "opacity-50 bg-transparent text-zinc-400  hover:bg-zinc-800",
                  )}
                >
                  Owner
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Designation</Label>
              <Input
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                placeholder="e.g. Designer, Developer, Manager"
                className="bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700"
              />
            </div>
          </div>
          <DialogFooter className="bg-transparent border-none p-0 m-0 flex-row gap-4 justify-end">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setPermissionsDialogOpen(false)}
              className="bg-transparent border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleUpdatePermissions}
              disabled={isSaving}
              className="bg-white/70 text-zinc-950 hover:bg-zinc-200 gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Profile Dialog ────────────────────────────────────────── */}
      <Dialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      >
        <DialogContent className="bg-[#19191b] border-dashboard-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription className="text-zinc-500">Update name for {selectedMember?.email}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Full Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter full name"
                className="bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700"
              />
            </div>
          </div>
          <DialogFooter className="bg-transparent border-none p-0 m-0 flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
              className="bg-transparent border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={isSaving || !editName.trim()}
              className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove Member Dialog ───────────────────────────────────────── */}
      <Dialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
      >
        <DialogContent className="bg-[#19191b] border-dashboard-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Are you sure you want to remove <span className="text-white font-medium">{selectedMember?.name || selectedMember?.email}</span> from the agency? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-transparent border-none p-0 m-0 flex-row gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setRemoveDialogOpen(false)}
              className="bg-transparent border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveMember}
              disabled={isSaving}
              className="bg-red-600 text-white hover:bg-red-700 gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
