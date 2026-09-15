"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Upload, MoreHorizontal, Plus, Play, Trash2, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { updateOnboardingStatus, addOnboardingItem, deleteOnboardingItem } from "@server/onboarding";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnboardingItem {
  id: string;
  label: string;
  status: "PENDING" | "UPLOADED" | "APPROVED" | "REJECTED";
  fileUrl: string | null;
  updatedAt: string | Date;
}

interface OnboardingClientProps {
  initialItems: OnboardingItem[];
  projectId: string;
}

export default function OnboardingClient({ initialItems, projectId }: OnboardingClientProps) {
  const [items, setItems] = useState(initialItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = {
    total: items.length,
    approved: items.filter((i) => i.status === "APPROVED").length,
    pending: items.filter((i) => i.status === "PENDING").length,
    uploaded: items.filter((i) => i.status === "UPLOADED").length,
  };

  const handleStatusUpdate = async (itemId: string, status: string) => {
    try {
      const res = await updateOnboardingStatus(itemId, status);
      if (res.success) {
        setItems(items.map((i) => (i.id === itemId ? { ...i, status: status as OnboardingItem["status"] } : i)));
        toast.success(`Item ${status.toLowerCase()} successfully`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddItem = async () => {
    if (!newItemLabel.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await addOnboardingItem(projectId, newItemLabel);
      if (res.success && res.item) {
        setItems([...items, res.item]);
        setNewItemLabel("");
        setIsAddDialogOpen(false);
        toast.success("Item added successfully");
      } else {
        toast.error(res.error || "Failed to add item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await deleteOnboardingItem(itemId);
      if (res.success) {
        setItems(items.filter((i) => i.id !== itemId));
        toast.success("Item deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const progressPercentage = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Onboarding Checklist</h2>
          <p className="text-sm text-zinc-400">Manage required assets and client homework.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-dashboard-border bg-[#151518] hover:bg-zinc-800 gap-2 font-medium"
          >
            <Play className="h-4 w-4" />
            Send Reminder
          </Button>

          <Dialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#19191b] border-dashboard-border text-white">
              <DialogHeader>
                <DialogTitle>Add Onboarding Item</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-label">Label</Label>
                  <Input
                    id="item-label"
                    placeholder="e.g. Brand Guidelines"
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    className="bg-[#151518]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-dashboard-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddItem}
                  disabled={isSubmitting}
                  className="bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  {isSubmitting ? "Adding..." : "Add Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-5 min-h-0 flex-1">
        {/* Progress Bar Card */}
        <Card className="bg-[#19191b] border-dashboard-border p-5 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Overall Progress</span>
              <div className="text-3xl font-bold text-zinc-200">{progressPercentage}%</div>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.approved} <span className="text-zinc-500">Approved</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.uploaded} <span className="text-zinc-500">Review</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-sm font-medium text-zinc-300">
                  {stats.pending} <span className="text-zinc-500">Pending</span>
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-[#151518] rounded-full overflow-hidden border border-dashboard-border/50">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* Checklist Items */}
        <div className="border border-dashboard-border rounded-xl bg-[#19191b] flex-1 flex flex-col min-h-0">
          <Card className="bg-[#151518] flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl ">
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-zinc-500 space-y-2">
                  <p>No onboarding items yet.</p>
                  <Button
                    variant="link"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="text-indigo-400"
                  >
                    Add your first item
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="group p-4 px-5 hover:bg-zinc-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 border-b"
                  >
                    <div className="flex items-start md:items-center gap-4 relative z-10 w-full group/inner">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-dashboard-border/50",
                          item.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : item.status === "UPLOADED"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-zinc-800/50 text-zinc-400 border-dashboard-border/50",
                        )}
                      >
                        {item.status === "APPROVED" ? <CheckCircle2 className="h-5 w-5" /> : item.status === "UPLOADED" ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{item.label}</h3>
                        {item.fileUrl && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#19191b] border border-dashboard-border/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <Upload className="h-3 w-3 text-zinc-500" />
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-medium text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
                            >
                              Download File <span className="text-zinc-600 ml-0.5">({new Date(item.updatedAt).toLocaleDateString()})</span> <Link className="h-3 w-3 text-zinc-500" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end md:pl-0">
                      {item.status === "UPLOADED" && (
                        <div className="flex gap-2 mr-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, "APPROVED")}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 h-8 px-3 rounded-lg font-medium transition-colors"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(item.id, "REJECTED")}
                            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 h-8 px-3 rounded-lg font-medium transition-colors"
                          >
                            Request Revision
                          </Button>
                        </div>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#19191b] border-dashboard-border text-zinc-300"
                        >
                          <DropdownMenuItem
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
