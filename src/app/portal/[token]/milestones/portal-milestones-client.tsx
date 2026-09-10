"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Milestone as MilestoneIcon,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  MessageSquare,
  Send,
  Loader2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ExternalLink,
  CircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createPortalMilestoneMessage,
  approvePortalMilestone,
} from "./actions";
import { createPortalCheckout } from "../payments/actions";

type TaskAssignee = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
};

type Task = {
  id: string;
  milestoneId: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date | string;
  assignee: TaskAssignee | null;
};

type MessageUser = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  role: string | null;
};

type MessageClient = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

type MilestoneMessage = {
  id: string;
  projectId: string;
  milestoneId: string | null;
  content: string;
  createdAt: Date | string;
  senderUserId: string | null;
  senderClientId: string | null;
  senderUser: MessageUser | null;
  senderClient: MessageClient | null;
};

type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  orderIndex: number;
  dueDate: Date | string | null;
  amount: number | null;
  status: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "APPROVED" | "PAID";
  createdAt: Date | string;
  updatedAt: Date | string;
  tasks: Task[];
  messages: MilestoneMessage[];
  payments?: any;
};

type ClientInfo = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

type PortalMilestonesClientProps = {
  initialMilestones: Milestone[];
  token: string;
  clientInfo?: ClientInfo;
};

export default function PortalMilestonesClient({
  initialMilestones,
  token,
  clientInfo,
}: PortalMilestonesClientProps) {
  const router = useRouter();
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

  React.useEffect(() => {
    setMilestones(initialMilestones);
  }, [initialMilestones]);

  // Expanded milestones state
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (initialMilestones.length > 0) {
      const activeIdx = initialMilestones.findIndex(
        (m) => m.status !== "APPROVED" && m.status !== "PAID"
      );
      const target = activeIdx >= 0 ? initialMilestones[activeIdx] : initialMilestones[0];
      if (target) map[target.id] = true;
    }
    return map;
  });

  // Active tab per milestone ("tasks" | "discussion")
  const [activeTabs, setActiveTabs] = useState<Record<string, "tasks" | "discussion">>({});

  // Message drafts & send states
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage] = useState<Record<string, boolean>>({});

  // Action states
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [paying, setPaying] = useState<Record<string, boolean>>({});

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

  // Milestone task progress calculation
  const calculateProgress = (milestone: Milestone) => {
    if (milestone.status === "PAID" || milestone.status === "APPROVED") return 100;
    if (!milestone.tasks || milestone.tasks.length === 0) {
      if (milestone.status === "IN_REVIEW") return 85;
      if (milestone.status === "IN_PROGRESS") return 40;
      return 0;
    }
    const completed = milestone.tasks.filter((t) => t.status === "COMPLETED").length;
    return Math.round((completed / milestone.tasks.length) * 100);
  };

  // Client approve milestone
  const handleApprove = async (milestoneId: string) => {
    setApproving((prev) => ({ ...prev, [milestoneId]: true }));
    const res = await approvePortalMilestone(milestoneId);
    setApproving((prev) => ({ ...prev, [milestoneId]: false }));

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Milestone approved successfully!");
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: "APPROVED" } : m))
      );
      router.refresh();
    }
  };

  // Client pay milestone
  const handlePay = async (milestone: Milestone) => {
    if (!milestone.amount || milestone.amount <= 0) {
      toast.error("Invalid payment amount for this milestone");
      return;
    }

    setPaying((prev) => ({ ...prev, [milestone.id]: true }));
    try {
      const res = await createPortalCheckout({
        amount: milestone.amount,
        milestoneId: milestone.id,
        title: milestone.title,
      });

      if (res.url) {
        window.location.href = res.url;
      } else if (res.error) {
        toast.error(res.error);
        setPaying((prev) => ({ ...prev, [milestone.id]: false }));
      }
    } catch (err) {
      toast.error("Failed to initialize payment gateway");
      setPaying((prev) => ({ ...prev, [milestone.id]: false }));
    }
  };

  // Client post message on milestone
  const handleSendMessage = async (milestoneId: string) => {
    const text = messageDrafts[milestoneId]?.trim();
    if (!text) return;

    setSendingMessage((prev) => ({ ...prev, [milestoneId]: true }));
    const res = await createPortalMilestoneMessage(milestoneId, text);
    setSendingMessage((prev) => ({ ...prev, [milestoneId]: false }));

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Feedback submitted");
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

  // Aggregates
  const paidAmount = milestones
    .filter((m) => m.status === "PAID")
    .reduce((acc, m) => acc + (m.amount || 0), 0);
  const completedCount = milestones.filter(
    (m) => m.status === "APPROVED" || m.status === "PAID"
  ).length;
  const percentage =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const totalTasks = milestones.reduce((sum, m) => sum + (m.tasks?.length || 0), 0);
  const completedTasks = milestones.reduce(
    (sum, m) => sum + (m.tasks?.filter((t) => t.status === "COMPLETED").length || 0),
    0
  );

  const stats = [
    {
      label: "Project Roadmap",
      value: `${percentage}%`,
      subtitle: `${completedCount} of ${milestones.length} phases done`,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
    {
      label: "Deliverables Completed",
      value: `${completedTasks}/${totalTasks}`,
      subtitle: "tasks verified",
      icon: <CheckSquare className="h-4 w-4" />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Paid To Date",
      value: `$${paidAmount.toLocaleString()}`,
      subtitle: "settled milestones",
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Current Stage",
      value: `Phase ${Math.min(completedCount + 1, milestones.length || 1)}`,
      subtitle: "active development",
      icon: <MilestoneIcon className="h-4 w-4" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <DashboardHeading
          title="Project Roadmap & Deliverables"
          description="Track the progress of each development phase, review actionable deliverables, and discuss feedback directly with the team."
        />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#19191b] border-dashboard-border p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
              <div className={cn("p-1.5 rounded-lg", stat.bg, stat.color)}>{stat.icon}</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-zinc-500">{stat.subtitle}</span>
            </div>
          </Card>
        ))}
      </div>

      
        <div className="space-y-4 ">
          {milestones.length > 0 ? (
            milestones.map((m, i) => {
              const isExpanded = !!expandedMilestones[m.id];
              const currentTab = getActiveTab(m.id);
              const progress = calculateProgress(m);
              const isPaid = m.status === "PAID";
              const isApproved = m.status === "APPROVED";
              const isInReview = m.status === "IN_REVIEW";
              const isInProgress = m.status === "IN_PROGRESS";
              const canApprove = isInReview;
              const canPay = (isApproved || isInReview) && !isPaid && (m.amount || 0) > 0;

              return (
                <div
                  key={m.id}
                  className={cn(
                    "border border-dashboard-border rounded-xl bg-[#151518] transition-all duration-300 overflow-hidden",
                    m.status === "PENDING" && i > completedCount && "opacity-80"
                  )}
                >
                  {/* Primary Milestone Row */}
                  <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Stage indicator icon */}
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center border font-bold text-sm shrink-0 mt-0.5",
                          isPaid || isApproved
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : i === completedCount
                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm"
                            : "bg-zinc-800/60 border-zinc-700/50 text-zinc-500"
                        )}
                      >
                        {isPaid || isApproved ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-zinc-100 text-base truncate">
                            {m.title}
                          </h3>

                          {/* Status Badge */}
                          <div
                            className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border",
                              isPaid
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : isApproved
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                : isInReview
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : isInProgress
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
                            )}
                          >
                            {m.status.replace("_", " ")}
                          </div>
                        </div>

                        
                      </div>
                    </div>

                    {/* Financial, Date & Actions */}
                    <div className="flex flex-wrap items-center gap-6 justify-between xl:justify-end shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-zinc-800/60">
                      <div className="flex items-center gap-6">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> Amount
                          </span>
                          <p className="text-sm font-bold text-zinc-200">
                            ${m.amount?.toLocaleString() || "0"}
                          </p>
                        </div>

                        <div className="h-6 w-px bg-zinc-800" />

                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Due Date
                          </span>
                          <p className="text-xs font-medium text-zinc-300">
                            {m.dueDate ? format(new Date(m.dueDate), "MMM dd, yyyy") : "TBD"}
                          </p>
                        </div>

                        <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

                        {/* Progress widget */}
                        <div className="space-y-1 w-24">
                          <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                            <span>Progress</span>
                            <span className={cn(progress === 100 ? "text-emerald-400" : "text-zinc-400")}>
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

                      {/* Action Buttons for Client */}
                      <div className="flex items-center gap-2">
                        {/* Approve Deliverables Button (when in review) */}
                        {canApprove && (
                          <Button
                            size="sm"
                            disabled={approving[m.id]}
                            onClick={() => handleApprove(m.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5 font-semibold"
                          >
                            {approving[m.id] ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            )}
                            Approve Phase
                          </Button>
                        )}

                        {/* Pay Milestone Button */}
                        {canPay && (
                          <Button
                            size="sm"
                            disabled={paying[m.id]}
                            onClick={() => handlePay(m)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5 font-semibold"
                          >
                            {paying[m.id] ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5" />
                            )}
                            Pay Milestone
                          </Button>
                        )}

                        {/* Expand/Collapse Toggle */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(m.id)}
                          className="h-8 gap-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                        >
                          <span className="flex items-center gap-1 text-[11px]">
                            <CheckSquare className="h-3.5 w-3.5 text-zinc-400" />
                            {m.tasks?.length || 0}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                            {m.messages?.length || 0}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Milestone Details */}
                  {isExpanded && (
                    <div className="border-t border-dashboard-border bg-[#19191b]/80">
                      {/* Tabs Header */}
                      <div className="flex items-center justify-between px-6 border-b border-dashboard-border/60 bg-[#151518]/50">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveTab(m.id, "tasks")}
                            className={cn(
                              "py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2",
                              currentTab === "tasks"
                                ? "border-indigo-500 text-white"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                            )}
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                            <span>Deliverables & Tasks</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-400">
                              {m.tasks?.length || 0}
                            </span>
                          </button>

                          <button
                            onClick={() => setActiveTab(m.id, "discussion")}
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
                              {m.messages?.length || 0}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Tab 1: Tasks / Deliverables View */}
                      {currentTab === "tasks" && (
                        <div className="p-6 space-y-3">
                          {m.tasks && m.tasks.length > 0 ? (
                            <div className="divide-y divide-zinc-800/50 rounded-xl border border-dashboard-border/60 bg-[#151518] overflow-hidden">
                              {m.tasks.map((task) => {
                                const isDone = task.status === "COMPLETED";

                                return (
                                  <div
                                    key={task.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div
                                        className={cn(
                                          "w-5 h-5 rounded-md border flex items-center justify-center shrink-0",
                                          isDone
                                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                            : "border-zinc-700 bg-zinc-800/40 text-zinc-500"
                                        )}
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                          <Clock className="h-3 w-3" />
                                        )}
                                      </div>

                                      <div className="min-w-0">
                                        <p
                                          className={cn(
                                            "text-xs font-semibold truncate",
                                            isDone
                                              ? "text-zinc-500 line-through"
                                              : "text-zinc-200"
                                          )}
                                        >
                                          {task.title}
                                        </p>
                                        {task.description && (
                                          <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                                            {task.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0 sm:pl-0 pl-8">
                                      {/* Priority badge */}
                                      <div
                                        className={cn(
                                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                          task.priority === "HIGH"
                                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            : task.priority === "MEDIUM"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        )}
                                      >
                                        {task.priority.toLowerCase()}
                                      </div>

                                      {/* Assigned team member */}
                                      {task.assignee && (
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 overflow-hidden shrink-0">
                                            {task.assignee.avatarUrl ? (
                                              <img
                                                src={task.assignee.avatarUrl}
                                                alt={task.assignee.name || ""}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              task.assignee.name?.charAt(0) || "?"
                                            )}
                                          </div>
                                          <span className="text-[11px] text-zinc-400">
                                            {task.assignee.name}
                                          </span>
                                        </div>
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
                                No individual task breakdown posted for this phase yet.
                              </p>
                              <p className="text-[11px] text-zinc-600">
                                The agency will detail deliverables and progress here.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab 2: Discussion & Feedback View */}
                      {currentTab === "discussion" && (
                        <div className="p-6 space-y-4">
                          {/* Messages Thread */}
                          {m.messages && m.messages.length > 0 ? (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                              {m.messages.map((message) => {
                                const isClient = !!message.senderClientId;
                                const isOwner = message.senderUser?.role === "OWNER";
                                const authorName = isClient
                                  ? message.senderClient?.name || clientInfo?.name || "Client"
                                  : message.senderUser?.name || "Agency Team";
                                const authorAvatar = isClient
                                  ? message.senderClient?.avatarUrl || clientInfo?.avatarUrl
                                  : message.senderUser?.avatarUrl;

                                return (
                                  <div
                                    key={message.id}
                                    className={cn(
                                      "flex gap-3 p-3.5 rounded-xl border transition-colors",
                                      isClient
                                        ? "bg-indigo-950/20 border-indigo-500/20"
                                        : "bg-[#151518] border-dashboard-border/60"
                                    )}
                                  >
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
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-zinc-200">
                                          {authorName}
                                        </span>

                                        {isClient ? (
                                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                                            You (Client)
                                          </span>
                                        ) : isOwner ? (
                                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                                            Agency Owner
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                                            Agency Team
                                          </span>
                                        )}

                                        <span className="text-[10px] text-zinc-500">
                                          {formatDistanceToNow(new Date(message.createdAt), {
                                            addSuffix: true,
                                          })}
                                        </span>
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
                              <p>No feedback or notes yet on this milestone.</p>
                              <p className="text-[11px] text-zinc-600">
                                You can ask questions, provide feedback, or leave notes for the agency below.
                              </p>
                            </div>
                          )}

                          {/* Client Message Composer */}
                          <div className="flex gap-3 pt-2">
                            <textarea
                              rows={2}
                              value={messageDrafts[m.id] || ""}
                              onChange={(e) =>
                                setMessageDrafts((prev) => ({
                                  ...prev,
                                  [m.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                  e.preventDefault();
                                  handleSendMessage(m.id);
                                }
                              }}
                              placeholder="Write a message, request revisions, or provide feedback on this milestone... (Ctrl + Enter to send)"
                              className="flex-1 bg-[#151518] border border-dashboard-border rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            />
                            <Button
                              type="button"
                              disabled={
                                sendingMessage[m.id] || !messageDrafts[m.id]?.trim()
                              }
                              onClick={() => handleSendMessage(m.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white h-auto px-4 rounded-xl gap-1.5 self-end text-xs font-semibold"
                            >
                              {sendingMessage[m.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              Send Feedback
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                <MilestoneIcon className="h-8 w-8" />
              </div>
              <p className="text-zinc-500 text-xs font-medium">
                No milestones defined for this project yet.
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
