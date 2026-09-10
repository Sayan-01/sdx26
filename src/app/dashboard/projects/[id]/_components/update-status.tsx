"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { updateProject } from "@server/projects";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProjectStatus } from "@/generated/prisma";

interface UpdateStatusProps {
  project: {
    id: string;
    status: ProjectStatus;
    [key: string]: any;
  };
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setProject: (project: any) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ACTIVE: {
    label: "Active",
    badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20",
    dotClass: "bg-amber-500",
  },
  ON_HOLD: {
    label: "On Hold",
    badgeClass: "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20",
    dotClass: "bg-orange-500",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20",
    dotClass: "bg-blue-500",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20",
    dotClass: "bg-zinc-400",
  },
};

const items: { label: string; value: ProjectStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

const UpdateStatus = ({
  project,
  loading,
  setLoading,
  setProject,
}: UpdateStatusProps) => {
  const currentStatus = (project.status || "PENDING") as ProjectStatus;
  const currentConfig = statusConfig[currentStatus] || statusConfig.PENDING;

  const handleStatusChange = async (newStatus: string) => {
    if (!newStatus || newStatus === project.status) return;

    const previousStatus = project.status;
    setLoading(true);

    // Optimistic update
    setProject({ ...project, status: newStatus });

    try {
      const res = await updateProject(project.id, newStatus as ProjectStatus);
      if (res?.error) {
        // Rollback on error
        setProject({ ...project, status: previousStatus });
        toast.error(res.error);
      } else {
        toast.success(`Project status updated to ${statusConfig[newStatus as ProjectStatus]?.label || newStatus}`);
      }
    } catch (err) {
      setProject({ ...project, status: previousStatus });
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={project.status}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger
        className={cn(
          "px-2 pr-1 !h-7 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-colors gap-1.5 cursor-pointer shadow-none",
          currentConfig.badgeClass
        )}
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Updating...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <SelectValue placeholder={currentConfig.label} />
          </span>
        )}
      </SelectTrigger>
      <SelectContent className="bg-[#19191b] border-dashboard-border text-zinc-200">
        <SelectGroup>
          {items.map((item) => {
            const config = statusConfig[item.value];
            return (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
                  <span className="">{item.label}</span>
                </span>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default UpdateStatus;
