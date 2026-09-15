"use client";

import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  CheckSquare,
  Send,
  Crown,
  Users,
  Eye,
  AlertCircle,
  Loader2,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMilestoneButton } from "./add-milestone-button";
import EditMilestoneModal from "./edit-milestone-modal";
import CreateMilestoneTaskModal from "./create-milestone-task-modal";
import {
  updateMilestoneStatus,
  deleteMilestone,
  updateTaskStatus,
  deleteTask,
  createMilestoneMessage,
  deleteMilestoneMessage,
} from "@server/projects";
import { MilestoneStatus, TaskStatus, TaskPriority } from "@/generated/prisma";

type TaskAssignee = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

type Task = {
  id: string;
  milestoneId: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  createdAt: Date | string;
  assignee: TaskAssignee | null;
};

type MessageUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string | null;
};

type MessageClient = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

type MilestoneMessage = {
  id: string;
  projectId: string;
  milestoneId: string | null;
  senderId: string;
  content: string;
  createdAt: Date | string;
  senderUserId: string | null;
  senderClientId: string | null;
  senderUser: MessageUser | null;
  senderClient: MessageClient | null;
};

type MilestoneItem = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  dueDate: Date | string | null;
  amount: number | null;
  status: MilestoneStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  tasks: Task[];
  messages: MilestoneMessage[];
  payments?: any;
};

type TeamMember = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
};

type UserRolePermissions = {
  isOwner: boolean;
  isMember: boolean;
  isViewer: boolean;
  canManageMilestones: boolean;
  canManageTasks: boolean;
  canPostMessages: boolean;
  effectiveRole: "OWNER" | "MEMBER" | "VIEWER";
};

type Props = {
  projectId: string;
  initialMilestones: MilestoneItem[];
  userRole: UserRolePermissions;
  teamMembers: TeamMember[];
  currentUserId: string;
};

const statusConfig: Record<
  MilestoneStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800",
    dotClass: "bg-zinc-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
    dotClass: "bg-indigo-400",
  },
  IN_REVIEW: {
    label: "In Review",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    dotClass: "bg-amber-400",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  PAID: {
    label: "Paid",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
};

const items: { label: string; value: MilestoneStatus; ownerOnly?: boolean }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Approved", value: "APPROVED", ownerOnly: true },
  { label: "Paid", value: "PAID", ownerOnly: true },
];

export default function MilestonesClient({
  projectId,
  initialMilestones,
  userRole,
  teamMembers,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones);

  // Keep state synchronized with server props
  React.useEffect(() => {
    setMilestones(initialMilestones);
  }, [initialMilestones]);

  // Track expanded state for each milestone (default expand first active/pending)
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (initialMilestones.length > 0) {
      // expand first non-completed, or first one
      const activeIdx = initialMilestones.findIndex(
        (m) => m.status !== "APPROVED" && m.status !== "PAID"
      );
      const target = activeIdx >= 0 ? initialMilestones[activeIdx] : initialMilestones[0];
      if (target) map[target.id] = true;
    }
    return map;
  });

  // Track tab for each milestone ("tasks" | "discussion")
  const [activeTabs, setActiveTabs] = useState<Record<string, "tasks" | "discussion">>({});

  // Message drafts per milestone
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage] = useState<Record<string, boolean>>({});

  // Modals
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [taskModalMilestone, setTaskModalMilestone] = useState<MilestoneItem | null>(null);

  // Inline loading states
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});
  const [taskToggling, setTaskToggling] = useState<Record<string, boolean>>({});

  const toggleExpand = (milestoneId: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }));
  };

  const getActiveTab = (milestoneId: string): "tasks" | "discussion" => {
    return activeTabs[milestoneId] || "tasks";
  };

  const setActiveTab = (milestoneId: string, tab: "tasks" | "discussion") => {
    setActiveTabs((prev) => ({
      ...prev,
      [milestoneId]: tab,
    }));
  };

  // Milestone calculations
  const calculateMilestoneProgress = (milestone: MilestoneItem) => {
    if (milestone.status === "PAID" || milestone.status === "APPROVED") return 100;
    if (!milestone.tasks || milestone.tasks.length === 0) {
      if (milestone.status === "IN_REVIEW") return 80;
      if (milestone.status === "IN_PROGRESS") return 40;
      return 0;
    }
    const completed = milestone.tasks.filter((t) => t.status === "COMPLETED").length;
    return Math.round((completed / milestone.tasks.length) * 100);
  };

  // Status changer handler
  const handleStatusChange = async (milestoneId: string, newStatus: MilestoneStatus) => {
    setStatusLoading((prev) => ({ ...prev, [milestoneId]: true }));
    // Optimistic update
    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, status: newStatus } : m))
    );

    const res = await updateMilestoneStatus(projectId, milestoneId, newStatus);
    setStatusLoading((prev) => ({ ...prev, [milestoneId]: false }));

    if (res.error) {
      toast.error(res.error);
      router.refresh();
    } else {
      toast.success(`Milestone marked as ${newStatus.replace("_", " ")}`);
      router.refresh();
    }
  };

  // Delete milestone
  const handleDeleteMilestone = async (milestone: MilestoneItem) => {
    if (!confirm(`Are you sure you want to delete milestone "${milestone.title}"? All associated tasks will be removed.`)) {
      return;
    }

    const res = await deleteMilestone(projectId, milestone.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Milestone deleted");
      setMilestones((prev) => prev.filter((m) => m.id !== milestone.id));
      router.refresh();
    }
  };

  // Toggle task status
  const handleToggleTask = async (milestoneId: string, task: Task) => {
    if (!userRole.canManageTasks) {
      toast.error("You do not have permission to modify task status");
      return;
    }

    const nextStatus: TaskStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTaskToggling((prev) => ({ ...prev, [task.id]: true }));

    // Optimistic update
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          tasks: m.tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)),
        };
      })
    );

    const res = await updateTaskStatus(projectId, task.id, nextStatus);
    setTaskToggling((prev) => ({ ...prev, [task.id]: false }));

    if (res.error) {
      toast.error(res.error);
      router.refresh();
    } else {
      toast.success(
        nextStatus === "COMPLETED" ? "Task marked complete" : "Task marked pending"
      );
      router.refresh();
    }
  };

  // Delete task
  const handleDeleteTask = async (milestoneId: string, taskId: string, taskTitle: string) => {
    if (!confirm(`Delete task "${taskTitle}"?`)) return;

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          tasks: m.tasks.filter((t) => t.id !== taskId),
        };
      })
    );

    const res = await deleteTask(projectId, taskId);
    if (res.error) {
      toast.error(res.error);
      router.refresh();
    } else {
      toast.success("Task deleted");
      router.refresh();
    }
  };

  // Post message to milestone
  const handleSendMessage = async (milestoneId: string) => {
    const text = messageDrafts[milestoneId]?.trim();
    if (!text) return;

    setSendingMessage((prev) => ({ ...prev, [milestoneId]: true }));
    const res = await createMilestoneMessage(projectId, milestoneId, text);
    setSendingMessage((prev) => ({ ...prev, [milestoneId]: false }));

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Comment posted");
      setMessageDrafts((prev) => ({ ...prev, [milestoneId]: "" }));
      if (res.message) {
        setMilestones((prev) =>
          prev.map((m) => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              messages: [...m.messages, res.message as any],
            };
          })
        );
      }
      router.refresh();
    }
  };

  // Delete message
  const handleDeleteMessage = async (milestoneId: string, messageId: string) => {
    const res = await deleteMilestoneMessage(projectId, messageId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Comment deleted");
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.id !== milestoneId) return m;
          return {
            ...m,
            messages: m.messages.filter((msg) => msg.id !== messageId),
          };
        })
      );
      router.refresh();
    }
  };

  // Aggregate project statistics
  const totalBudget = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const totalTasks = milestones.reduce((sum, m) => sum + (m.tasks?.length || 0), 0);
  const completedTasks = milestones.reduce(
    (sum, m) => sum + (m.tasks?.filter((t) => t.status === "COMPLETED").length || 0),
    0
  );
  const completedMilestones = milestones.filter(
    (m) => m.status === "APPROVED" || m.status === "PAID"
  ).length;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 h-full">
      {/* Header & Role Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Milestones, Tasks & Discussions
            </h2>
            {/* Dynamic Role Badge */}
            {userRole.isOwner ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold shadow-xs">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Owner View (Full Control)</span>
              </div>
            ) : userRole.isMember ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold shadow-xs">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                <span>Project Member View (Tasks & Notes)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-semibold">
                <Eye className="h-3.5 w-3.5 text-zinc-400" />
                <span>Viewer (Read-Only)</span>
              </div>
            )}
          </div>
          {/* <p className="text-xs text-zinc-400 leading-relaxed">
            Manage development phases, assign & track actionable tasks, and collaborate on deliverable feedback.
          </p> */}
        </div>

        {/* Action Button for Owners */}
        <div className="flex items-center gap-3">
          {userRole.canManageMilestones && (
            <AddMilestoneButton projectId={projectId} label="New Milestone" />
          )}
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-[#19191b] border-dashboard-border p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Milestones</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {completedMilestones}/{milestones.length}
            </span>
            <span className="text-xs text-zinc-500">completed</span>
          </div>
        </Card>

        <Card className="bg-[#19191b] border-dashboard-border p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Work Breakdown</span>
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {completedTasks}/{totalTasks}
            </span>
            <span className="text-xs text-zinc-500">tasks done</span>
          </div>
        </Card>

        <Card className="bg-[#19191b] border-dashboard-border p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Phase Budget</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${totalBudget.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500">USD</span>
          </div>
        </Card>

        <Card className="bg-[#19191b] border-dashboard-border p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Discussions</span>
            <MessageSquare className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {milestones.reduce((acc, m) => acc + (m.messages?.length || 0), 0)}
            </span>
            <span className="text-xs text-zinc-500">comments</span>
          </div>
        </Card>
      </div>

      {/* Main Milestones List */}
      <div className="space-y-5">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => {
            const isExpanded = !!expandedMilestones[milestone.id];
            const currentTab = getActiveTab(milestone.id);
            const progress = calculateMilestoneProgress(milestone);
            const isCompleted =
              milestone.status === "APPROVED" || milestone.status === "PAID";
            const isInReview = milestone.status === "IN_REVIEW";
            const isInProgress = milestone.status === "IN_PROGRESS";
            const currentConfig = statusConfig[milestone.status] || statusConfig.PENDING;

            return (
              <div
                key={milestone.id}
                className={cn(
                  "border border-dashboard-border rounded-xl bg-[#151518] transition-all duration-300 overflow-hidden shadow-xs",
                )}
              >
                {/* Milestone Primary Header */}
                <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    {/* Stage number badge */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border mt-0.5",
                        currentConfig.badgeClass
                      )}
                    >
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-zinc-100 truncate">
                          {milestone.title}
                        </h3>

                        {/* Status dropdown or badge */}
                        {userRole.isOwner || userRole.isMember ? (
                          <Select
                            value={milestone.status}
                            onValueChange={(val) =>
                              handleStatusChange(milestone.id, val as MilestoneStatus)
                            }
                            disabled={statusLoading[milestone.id]}
                          >
                            <SelectTrigger
                              className={cn(
                                "px-2 pr-1 !h-7 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-colors gap-1.5 cursor-pointer shadow-none",
                                currentConfig.badgeClass
                              )}
                            >
                              {statusLoading[milestone.id] ? (
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
                            <SelectContent className="bg-[#19191b] ring-zinc-600 text-zinc-200 -mt-0.5">
                              <SelectGroup>
                                {items
                                  .filter(
                                    (item) =>
                                      !item.ownerOnly ||
                                      userRole.isOwner ||
                                      item.value === milestone.status
                                  )
                                  .map((item) => {
                                    const config = statusConfig[item.value];
                                    return (
                                      <SelectItem
                                        key={item.value}
                                        value={item.value}
                                        className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white"
                                      >
                                        <span className="flex items-center gap-1.5">
                                          <span
                                            className={cn(
                                              "w-1.5 h-1.5 rounded-full",
                                              config.dotClass
                                            )}
                                          />
                                          <span className="">{item.label}</span>
                                        </span>
                                      </SelectItem>
                                    );
                                  })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div
                            className={cn(
                              "px-2 !h-7 rounded-md border text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5",
                              currentConfig.badgeClass
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                currentConfig.dotClass
                              )}
                            />
                            {currentConfig.label}
                          </div>
                        )}
                      </div>

                      
                    </div>
                  </div>

                  {/* Financial & Due Date Box */}
                  <div className="flex flex-wrap items-center gap-6 justify-between xl:justify-end shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-zinc-800/60">
                    <div className="flex items-center gap-6">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> Amount
                        </span>
                        <p className="text-sm font-bold text-zinc-200">
                          ${milestone.amount?.toLocaleString() || "0"}
                        </p>
                      </div>

                      <div className="h-6 w-px bg-zinc-800" />

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Due Date
                        </span>
                        <p className="text-xs font-medium text-zinc-300">
                          {milestone.dueDate
                            ? format(new Date(milestone.dueDate), "MMM dd, yyyy")
                            : "TBD"}
                        </p>
                      </div>

                      <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

                      {/* Progress widget */}
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                          <span>Tasks</span>
                          <span
                            className={cn(
                              progress === 100 ? "text-emerald-400" : "text-zinc-400"
                            )}
                          >
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500 rounded-full",
                              progress === 100
                                ? "bg-emerald-500"
                                : isInReview
                                ? "bg-amber-500"
                                : "bg-indigo-500"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* Collapse/Expand Toggle Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(milestone.id)}
                        className="h-8 gap-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                      >
                        <span className="flex items-center gap-1 text-[11px]">
                          <CheckSquare className="h-3.5 w-3.5 text-zinc-400" />
                          {milestone.tasks.length}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                          {milestone.messages.length}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </Button>

                      {/* Owner milestone edit/delete menu */}
                      {userRole.canManageMilestones && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#19191b] border-dashboard-border text-zinc-200 text-xs"
                          >
                            <DropdownMenuItem
                              onClick={() => setEditingMilestone(milestone)}
                              className="cursor-pointer gap-2 hover:bg-zinc-800"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
                              Edit Milestone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteMilestone(milestone)}
                              className="cursor-pointer gap-2 text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                              Delete Milestone
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Tasks & Discussions Tabs */}
                {isExpanded && (
                  <div className="border-t border-dashboard-border bg-[#19191b]/70">
                    {/* Tab Selection Header */}
                    <div className="flex items-center justify-between px-6 border-b border-dashboard-border/60 bg-[#151518]/50">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab(milestone.id, "tasks")}
                          className={cn(
                            "py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2",
                            currentTab === "tasks"
                              ? "border-indigo-500 text-white"
                              : "border-transparent text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                          <span>Actionable Tasks</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-400">
                            {milestone.tasks.length}
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveTab(milestone.id, "discussion")}
                          className={cn(
                            "py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2",
                            currentTab === "discussion"
                              ? "border-indigo-500 text-white"
                              : "border-transparent text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Discussion & Feedback</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-400">
                            {milestone.messages.length}
                          </span>
                        </button>
                      </div>

                      {/* Tab-specific actions */}
                      {currentTab === "tasks" && userRole.canManageTasks && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTaskModalMilestone(milestone)}
                          className="h-7 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-1.5 font-medium"
                        >
                          <Plus className="h-3 w-3" />
                          Add Task
                        </Button>
                      )}
                    </div>

                    {/* Content Section: Tasks Tab */}
                    {currentTab === "tasks" && (
                      <div className="p-6 space-y-3">
                        {milestone.tasks.length > 0 ? (
                          <div className="divide-y divide-zinc-800/50 rounded-xl border border-dashboard-border/60 bg-[#151518] overflow-hidden">
                            {milestone.tasks.map((task) => {
                              const isTaskCompleted = task.status === "COMPLETED";

                              return (
                                <div
                                  key={task.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 transition-colors group"
                                >
                                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                    {/* Task completion toggle button */}
                                    <button
                                      type="button"
                                      disabled={!userRole.canManageTasks || taskToggling[task.id]}
                                      onClick={() => handleToggleTask(milestone.id, task)}
                                      className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                                        isTaskCompleted && !taskToggling[task.id] ? "bg-emerald-500 border-emerald-500 text-zinc-950" : "border-zinc-600 hover:border-zinc-400 bg-zinc-900/60",
                                        !userRole.canManageTasks && "cursor-not-allowed opacity-60",
                                      )}
                                      title={userRole.canManageTasks ? "Toggle task status" : "Read-only view"}
                                    >
                                      {taskToggling[task.id] ? <Loader2 className="h-3 w-3 animate-spin text-zinc-400" /> : null}
                                    </button>

                                    <div className="min-w-0">
                                      <p className={cn("text-xs font-semibold transition-colors truncate", isTaskCompleted ? "text-zinc-500 line-through" : "text-zinc-200 group-hover:text-white")}>
                                        {task.title}
                                      </p>
                                      {task.description && <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{task.description}</p>}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0 sm:pl-0 pl-8">
                                    {/* Priority Badge */}
                                    <div
                                      className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                        task.priority === "HIGH"
                                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                          : task.priority === "MEDIUM"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                      )}
                                    >
                                      {task.priority.toLowerCase()}
                                    </div>

                                    {/* Assignee pill */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 overflow-hidden shrink-0">
                                        {task.assignee?.avatarUrl ? (
                                          <img
                                            src={task.assignee.avatarUrl}
                                            alt={task.assignee.name || ""}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          task.assignee?.name?.charAt(0) || "?"
                                        )}
                                      </div>
                                      <span className="text-[11px] text-zinc-400">{task.assignee?.name || "Unassigned"}</span>
                                    </div>

                                    {/* Delete task button (for owner or assignee) */}
                                    {userRole.canManageTasks && (userRole.isOwner || task.assigneeId === currentUserId) && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteTask(milestone.id, task.id, task.title)}
                                        className="h-6 w-6 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-8 px-4 rounded-xl border border-dashed border-card text-center flex flex-col items-center justify-center space-y-2">
                            <CheckSquare className="h-8 w-8 text-zinc-600" />
                            <p className="text-xs font-medium text-zinc-400">
                              No tasks created for this milestone stage yet.
                            </p>
                            {userRole.canManageTasks && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTaskModalMilestone(milestone)}
                                className="mt-1 h-7 text-xs bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Create First Task
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section: Discussion & Messages Tab */}
                    {currentTab === "discussion" && (
                      <div className="p-6 space-y-4">
                        {/* Messages Feed */}
                        {milestone.messages.length > 0 ? (
                          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {milestone.messages.map((message) => {
                              const authorName =
                                message.senderUser?.name ||
                                message.senderClient?.name ||
                                "Team Member";
                              const authorAvatar =
                                message.senderUser?.avatarUrl ||
                                message.senderClient?.avatarUrl;
                              const isOwnerAuthor =
                                message.senderUser?.role === "OWNER";
                              const isClientAuthor = !!message.senderClientId;
                              const canDeleteMsg =
                                userRole.isOwner ||
                                message.senderUserId === currentUserId;

                              return (
                                <div
                                  key={message.id}
                                  className="flex gap-3 p-3.5 rounded-xl bg-[#151518] border border-dashboard-border/60 hover:border-zinc-700/60 transition-colors group/msg"
                                >
                                  {/* Author avatar */}
                                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0 overflow-hidden mt-0.5">
                                    {authorAvatar ? (
                                      <img
                                        src={authorAvatar}
                                        alt={authorName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      authorName.charAt(0)
                                    )}
                                  </div>

                                  <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-zinc-200">
                                          {authorName}
                                        </span>

                                        {/* Author Role Badge */}
                                        {isOwnerAuthor ? (
                                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                                            Owner
                                          </span>
                                        ) : isClientAuthor ? (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                                            Client
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                                            Team
                                          </span>
                                        )}

                                        <span className="text-[10px] text-zinc-500">
                                          {formatDistanceToNow(new Date(message.createdAt), {
                                            addSuffix: true,
                                          })}
                                        </span>
                                      </div>

                                      {/* Delete message button */}
                                      {canDeleteMsg && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleDeleteMessage(milestone.id, message.id)
                                          }
                                          className="h-6 w-6 opacity-0 group-hover/msg:opacity-100 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-opacity"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>

                                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                      {message.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-zinc-500 text-xs flex flex-col items-center justify-center space-y-1">
                            <MessageSquare className="h-6 w-6 text-zinc-600 mb-1" />
                            <p>No discussion or comments yet on this milestone.</p>
                            <p className="text-[11px] text-zinc-600">
                              Post notes or deliverable feedback for team members and client visibility.
                            </p>
                          </div>
                        )}

                        {/* Compose Message Box */}
                        {userRole.canPostMessages ? (
                          <div className="flex gap-3 pt-2">
                            <textarea
                              rows={2}
                              value={messageDrafts[milestone.id] || ""}
                              onChange={(e) =>
                                setMessageDrafts((prev) => ({
                                  ...prev,
                                  [milestone.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                  e.preventDefault();
                                  handleSendMessage(milestone.id);
                                }
                              }}
                              placeholder="Write a message, update, or feedback for this milestone... (Ctrl + Enter to send)"
                              className="flex-1 bg-[#151518] border border-dashboard-border rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            />
                            <Button
                              type="button"
                              disabled={
                                sendingMessage[milestone.id] ||
                                !messageDrafts[milestone.id]?.trim()
                              }
                              onClick={() => handleSendMessage(milestone.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white h-auto px-4 rounded-xl gap-1.5 self-end text-xs font-semibold"
                            >
                              {sendingMessage[milestone.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              Send
                            </Button>
                          </div>
                        ) : (
                          <p className="text-center text-[11px] text-zinc-500 italic">
                            Posting comments is restricted to project team members.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty State for Milestones */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-dashboard-border rounded-xl bg-[#151518]">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border border-dashboard-border/50">
              <Plus className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No milestones created yet
            </h3>
            <p className="text-zinc-500 max-w-sm mb-8 text-sm">
              Define project phases to track deliverables, break work down into actionable tasks, and manage client payments.
            </p>
            {userRole.canManageMilestones && (
              <AddMilestoneButton
                projectId={projectId}
                label="Create First Milestone"
                variant="primary"
              />
            )}
          </div>
        )}
      </div>

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <EditMilestoneModal
          projectId={projectId}
          milestone={editingMilestone}
          open={!!editingMilestone}
          onOpenChange={(open) => !open && setEditingMilestone(null)}
          onSuccess={() => {
            setEditingMilestone(null);
            router.refresh();
          }}
        />
      )}

      {/* Add Task to Specific Milestone Modal */}
      {taskModalMilestone && (
        <CreateMilestoneTaskModal
          projectId={projectId}
          milestoneId={taskModalMilestone.id}
          milestoneTitle={taskModalMilestone.title}
          teamMembers={teamMembers}
          open={!!taskModalMilestone}
          onOpenChange={(open) => !open && setTaskModalMilestone(null)}
          onSuccess={() => {
            setTaskModalMilestone(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
