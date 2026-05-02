"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserPlus, Search, Check, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { addProjectMember, getAvailableAgencyMembers } from "@server/projectMembers";
import { Input } from "@/components/ui/input";
import { ProjectMemberRole } from "@/generated/prisma";

type Props = {
  projectId: string;
};

export default function AssignMemberModal({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [role, setRole] = useState<ProjectMemberRole>("MEMBER");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  const fetchMembers = async () => {
    setFetching(true);
    const result = await getAvailableAgencyMembers(projectId);
    setFetching(false);
    if (result.success) {
      setAvailableMembers(result.availableMembers || []);
    } else {
      toast.error(result.error || "Failed to fetch team members");
    }
  };

  const handleSubmit = async () => {
    if (!selectedUserId) return toast.error("Please select a member");

    setLoading(true);
    const result = await addProjectMember(projectId, selectedUserId, role, designation);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Member added to project successfully");
      setOpen(false);
      setSelectedUserId(null);
      setRole("MEMBER");
    }
  };

  const filteredMembers = availableMembers.filter(m => 
    (m.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (m.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium"
      >
        <UserPlus className="h-4 w-4" />
        Assign Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#19191b] border-dashboard-border text-white">
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Select a team member from your agency to add to this project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <Input 
                placeholder="Search team members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Select Member</Label>
              <div className="max-h-[200px] overflow-y-auto border border-dashboard-border rounded-lg bg-[#151518] divide-y divide-zinc-800/50">
                {fetching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div 
                      key={member.id}
                      onClick={() => {
                        setSelectedUserId(member.id); 
                        setDesignation(member.designation || "")}}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-800/40",
                        selectedUserId === member.id && "bg-indigo-500/10 hover:bg-indigo-500/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium border border-dashboard-border/50 overflow-hidden">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            member.name?.charAt(0) || "?"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{member.name}</p>
                          <p className="text-[10px] text-zinc-500">{member.email}</p>
                        </div>
                      </div>
                      {selectedUserId === member.id && <Check className="h-4 w-4 text-indigo-500" />}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-600 text-sm italic">
                    {searchQuery ? "No members found matching your search." : "No available team members found."}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Project Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as ProjectMemberRole)}
                className="w-full h-10 rounded-lg border border-dashboard-border bg-[#151518] px-3 py-1 text-sm text-zinc-200 focus:outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
            <div className="space-y-2">
               <Label className="text-zinc-400">Designation</Label>
               <div className="relative group">
                 <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                 <Input 
                   placeholder="e.g. Lead Designer"
                   value={designation}
                   onChange={(e) => setDesignation(e.target.value)}
                   className="pl-9 h-10 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
                 />
               </div>
             </div>

            <DialogFooter className="mt-6 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-dashboard-border bg-transparent text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedUserId}
                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign Member"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
