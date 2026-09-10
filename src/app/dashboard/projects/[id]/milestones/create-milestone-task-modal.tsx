"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createTask } from "@server/projects";
import { Loader2 } from "lucide-react";
import { TaskPriority } from "@/generated/prisma";

type TeamMember = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
};

type Props = {
  projectId: string;
  milestoneId: string;
  milestoneTitle: string;
  teamMembers: TeamMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function CreateMilestoneTaskModal({
  projectId,
  milestoneId,
  milestoneTitle,
  teamMembers,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    assigneeId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error("Task title is required");
    }

    setLoading(true);
    const result = await createTask(projectId, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      milestoneId,
      assigneeId: formData.assigneeId || undefined,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task created successfully");
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        assigneeId: "",
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#151518] border-dashboard-border text-white sm:max-w-[440px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-100">
              Add Task to Milestone
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Adding task under <span className="text-indigo-400 font-semibold">{milestoneTitle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title" className="text-xs text-zinc-400">
                Task Title
              </Label>
              <Input
                id="task-title"
                placeholder="e.g., Implement OAuth login flow"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-desc" className="text-xs text-zinc-400">
                Description (Optional)
              </Label>
              <Textarea
                id="task-desc"
                placeholder="Task criteria or acceptance details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs text-zinc-400">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                  className="w-full h-9 rounded-md border border-dashboard-border bg-[#19191b] px-3 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs text-zinc-400">Assign To</Label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) =>
                    setFormData({ ...formData, assigneeId: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-dashboard-border bg-[#19191b] px-3 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.user.id} value={member.user.id}>
                      {member.user.name || "Unnamed"} ({member.role.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
