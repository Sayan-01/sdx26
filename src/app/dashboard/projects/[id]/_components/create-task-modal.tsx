"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTask } from "@server/projects";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  projectId: string;
  milestones: { id: string; title: string }[];
  teamMembers: { user: { id: string; name: string | null } }[];
};

export default function CreateTaskModal({ projectId, milestones, teamMembers }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    milestoneId: milestones[0]?.id || "",
    assigneeId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required");
    if (!formData.milestoneId) return toast.error("Milestone is required");

    setLoading(true);
    const result = await createTask(projectId, formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task created successfully");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        milestoneId: milestones[0]?.id || "",
        assigneeId: "",
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        className="text-xs text-zinc-500 hover:text-white h-6 gap-1.5"
      >
        <Plus className="h-3 w-3" />
        Add Task
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#19191b] border-dashboard-border text-white">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Add a new task to your project and assign it to a team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Design Homepage"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-[#151518] border-dashboard-border text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-400">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Details about the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#151518] border-dashboard-border text-zinc-200 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full h-10 rounded-lg border border-dashboard-border bg-[#151518] px-3 py-1 text-sm text-zinc-200 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Milestone</Label>
                <select
                  value={formData.milestoneId}
                  onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-dashboard-border bg-[#151518] px-3 py-1 text-sm text-zinc-200 focus:outline-none"
                >
                  <option value="" disabled>Select Milestone</option>
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Assign To</Label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full h-10 rounded-lg border border-dashboard-border bg-[#151518] px-3 py-1 text-sm text-zinc-200 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-dashboard-border bg-transparent text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[100px]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
