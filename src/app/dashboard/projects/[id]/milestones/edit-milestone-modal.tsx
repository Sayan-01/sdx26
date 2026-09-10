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
import { updateMilestone } from "@server/projects";
import { Loader2 } from "lucide-react";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  dueDate: Date | string | null;
};

type Props = {
  projectId: string;
  milestone: Milestone;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function EditMilestoneModal({
  projectId,
  milestone,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: milestone.title,
    description: milestone.description || "",
    amount: milestone.amount?.toString() || "0",
    dueDate: milestone.dueDate
      ? new Date(milestone.dueDate).toISOString().split("T")[0]
      : "",
  });

  // Keep in sync when milestone prop changes
  React.useEffect(() => {
    setFormData({
      title: milestone.title,
      description: milestone.description || "",
      amount: milestone.amount?.toString() || "0",
      dueDate: milestone.dueDate
        ? new Date(milestone.dueDate).toISOString().split("T")[0]
        : "",
    });
  }, [milestone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error("Milestone title is required");
    }

    setLoading(true);
    const result = await updateMilestone(projectId, milestone.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      amount: parseFloat(formData.amount) || 0,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Milestone updated successfully");
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
              Edit Milestone
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Update stage title, deliverables description, budget amount, and due date.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-xs text-zinc-400">
                Milestone Title
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-xs text-zinc-400">
                Deliverables Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What will be delivered in this phase?"
                className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500 min-h-[90px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-amount" className="text-xs text-zinc-400">
                  Amount ($)
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate" className="text-xs text-zinc-400">
                  Due Date
                </Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="bg-[#19191b] border-dashboard-border text-zinc-100 focus:ring-indigo-500 [color-scheme:dark]"
                />
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
