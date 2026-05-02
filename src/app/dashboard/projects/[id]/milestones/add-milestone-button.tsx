"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMilestone } from "@server/projects";
import { cn } from "@/lib/utils";

export function AddMilestoneButton({ 
  projectId, 
  label = "Add Milestone", 
  variant = "default" 
}: { 
  projectId: string; 
  label?: string; 
  variant?: "default" | "primary" 
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const dueDate = formData.get("dueDate") as string;

    const result = await createMilestone(projectId, {
      title,
      description,
      amount,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Milestone created successfully");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={cn(
            "gap-2 font-medium transition-all shadow-md",
            variant === "primary" 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "bg-white text-zinc-950 hover:bg-zinc-200"
          )}
        >
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Create a new project stage and set the payment amount.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-zinc-400">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., UI Design Phase"
                required
                className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-zinc-400">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What will be delivered in this stage?"
                className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-zinc-400">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  required
                  className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate" className="text-zinc-400">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Creating..." : "Create Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
