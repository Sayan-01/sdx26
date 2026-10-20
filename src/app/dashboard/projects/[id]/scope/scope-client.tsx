"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Plus,
  ArrowRight,
  BadgeInfo,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Send,
  Milestone as MilestoneIcon,
  HelpCircle,
  FileEdit,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  createAgencyChangeRequest,
  reviewChangeRequestByAgency,
  cancelChangeRequest,
  getProjectScopeRequests,
} from "@server/scope";
import Link from "next/link";
import { format } from "date-fns";

export interface ScopeRequestItem {
  id: string;
  projectId: string;
  requestedByRole: "AGENCY" | "CLIENT";
  title: string;
  description: string | null;
  scopeType: "IN_SCOPE" | "NEW_REQUEST";
  status:
    | "SUBMITTED"
    | "NEEDS_REVISION"
    | "PENDING_CLIENT_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "CONVERTED";
  costImpact: number | null;
  timelineImpact: string | null;
  agencyNote: string | null;
  clientNote: string | null;
  convertedMilestoneId: string | null;
  convertedMilestone?: {
    id: string;
    title: string;
    status: string;
    amount: number | null;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function ExpandableDescription({
  text,
  maxChars = 130,
  className = "text-xs text-zinc-400 leading-relaxed",
}: {
  text: string;
  maxChars?: number;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show toggle if text is long or has more than 2 line breaks
  const isLong = text.length > maxChars || text.split("\n").filter(Boolean).length > 2;

  if (!isLong) {
    return <p className={cn(className, "whitespace-pre-wrap")}>{text}</p>;
  }

  return (
    <div className="space-y-1">
      <p
        className={cn(
          className,
          "whitespace-pre-wrap transition-all",
          !isExpanded && "line-clamp-2"
        )}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer select-none"
      >
        <span>{isExpanded ? "Show less" : "Show more"}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

export default function ScopeClient({
  projectId,
  initialRequests,
}: {
  projectId: string;
  initialRequests: ScopeRequestItem[];
}) {
  const [requests, setRequests] = useState<ScopeRequestItem[]>(initialRequests);
  const [filter, setFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Agency Create Request Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    scopeType: "NEW_REQUEST" as "IN_SCOPE" | "NEW_REQUEST",
    costImpact: 0,
    timelineImpact: "+2 days",
    agencyNote: "",
  });

  // Agency Review Proposal Modal (for client-submitted or revision requests)
  const [reviewModalRequest, setReviewModalRequest] = useState<ScopeRequestItem | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    scopeType: "NEW_REQUEST" as "IN_SCOPE" | "NEW_REQUEST",
    costImpact: 0,
    timelineImpact: "",
    agencyNote: "",
  });

  // View Details Modal
  const [detailModalRequest, setDetailModalRequest] = useState<ScopeRequestItem | null>(null);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getProjectScopeRequests(projectId);
      if (res.success && res.requests) {
        setRequests(res.requests as unknown as ScopeRequestItem[]);
      }
    } catch {
      toast.error("Failed to refresh requests");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      toast.error("Please enter a title for the request");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createAgencyChangeRequest({
        projectId,
        title: createForm.title,
        description: createForm.description,
        scopeType: createForm.scopeType,
        costImpact: Number(createForm.costImpact) || 0,
        timelineImpact: createForm.timelineImpact,
        agencyNote: createForm.agencyNote,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Change request proposal sent to client for approval");
        setIsCreateOpen(false);
        setCreateForm({
          title: "",
          description: "",
          scopeType: "NEW_REQUEST",
          costImpact: 0,
          timelineImpact: "+2 days",
          agencyNote: "",
        });
        await refreshData();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setCreateLoading(false);
    }
  };

  const openReviewModal = (req: ScopeRequestItem) => {
    setReviewModalRequest(req);
    setReviewForm({
      scopeType: req.scopeType || "NEW_REQUEST",
      costImpact: req.costImpact || 0,
      timelineImpact: req.timelineImpact || "+3 days",
      agencyNote: req.agencyNote || "",
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalRequest) return;

    if (!reviewForm.timelineImpact.trim()) {
      toast.error("Please enter an estimated timeline impact (e.g. +3 days)");
      return;
    }

    setReviewLoading(true);
    try {
      const res = await reviewChangeRequestByAgency({
        requestId: reviewModalRequest.id,
        scopeType: reviewForm.scopeType,
        costImpact: Number(reviewForm.costImpact) || 0,
        timelineImpact: reviewForm.timelineImpact,
        agencyNote: reviewForm.agencyNote,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Official proposal submitted to client for approval");
        setReviewModalRequest(null);
        await refreshData();
      }
    } catch {
      toast.error("Failed to update proposal");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this change request?")) return;
    try {
      const res = await cancelChangeRequest(requestId, "Cancelled by agency");
      if (res.success) {
        toast.success("Change request cancelled");
        await refreshData();
      } else {
        toast.error(res.error || "Failed to cancel request");
      }
    } catch {
      toast.error("Error cancelling request");
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "NEEDS_AGENCY") return r.status === "SUBMITTED" || r.status === "NEEDS_REVISION";
    if (filter === "AWAITING_CLIENT") return r.status === "PENDING_CLIENT_APPROVAL";
    if (filter === "CONVERTED") return r.status === "CONVERTED" || r.status === "APPROVED";
    if (filter === "REJECTED") return r.status === "REJECTED";
    return true;
  });

  const getStatusBadge = (status: ScopeRequestItem["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Client Request • Needs Estimate
          </span>
        );
      case "NEEDS_REVISION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Revision Requested
          </span>
        );
      case "PENDING_CLIENT_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Send className="w-3.5 h-3.5" /> Proposal Sent • Awaiting Client
          </span>
        );
      case "APPROVED":
      case "CONVERTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Converted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Declined by Client
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 h-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">Scope Creep Protection</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshData}
              disabled={isRefreshing}
              className="h-8 w-8 text-zinc-400 hover:text-white"
              title="Refresh Scope Log"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
          <p className="text-sm text-zinc-400">
            Track out-of-scope work, propose transparent cost & timeline impacts, and auto-convert approved requests into milestones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium"
          >
            <Plus className="h-4 w-4" />
            Log Change Request
          </Button>
        </div>
      </div>

      {/* Educational Protection Banner */}
      <Card className="bg-[#19191b] border-dashboard-border rounded-xl py-0">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <BadgeInfo className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-200">
              Bi-directional Scope Management
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Both your agency and clients can initiate requests. Only your agency sets the official{" "}
              <span className="text-zinc-200 font-semibold">Cost Impact ($)</span> and{" "}
              <span className="text-zinc-200 font-semibold">Timeline Impact</span>. Once the client approves in the Portal, a paid Milestone is created automatically.
            </p>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "ALL", label: `All Requests (${requests.length})` },
          {
            key: "NEEDS_AGENCY",
            label: `Needs Agency Estimate (${requests.filter((r) => r.status === "SUBMITTED" || r.status === "NEEDS_REVISION").length})`,
          },
          {
            key: "AWAITING_CLIENT",
            label: `Awaiting Client (${requests.filter((r) => r.status === "PENDING_CLIENT_APPROVAL").length})`,
          },
          {
            key: "CONVERTED",
            label: `Approved / Converted (${requests.filter((r) => r.status === "CONVERTED" || r.status === "APPROVED").length})`,
          },
          {
            key: "REJECTED",
            label: `Declined (${requests.filter((r) => r.status === "REJECTED").length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
              filter === tab.key
                ? "bg-zinc-100 text-zinc-950 border-zinc-200 shadow-sm"
                : "bg-[#19191b] text-zinc-400 border-dashboard-border hover:bg-zinc-800 hover:text-zinc-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-xl">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
              <AlertCircle className="h-10 w-10 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-zinc-300">No change requests found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                {filter === "ALL"
                  ? "Neither you nor the client have logged any out-of-scope requests yet."
                  : "No requests match the selected filter."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
              {filteredRequests.map((req) => {
                const needsAgencyAction = req.status === "SUBMITTED" || req.status === "NEEDS_REVISION";
                return (
                  <div
                    key={req.id}
                    className={cn(
                      "group flex flex-col md:flex-row md:items-center justify-between gap-5 px-5 py-4 transition-colors",
                      needsAgencyAction ? "bg-amber-500/[0.03] hover:bg-amber-500/[0.06]" : "hover:bg-zinc-900/50"
                    )}
                  >
                    <div className="flex items-start md:items-center gap-4 flex-grow w-full">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          req.scopeType === "NEW_REQUEST"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}
                      >
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                            {req.title}
                          </h3>
                          {getStatusBadge(req.status)}
                        </div>
                        {req.description && (
                          <ExpandableDescription
                            text={req.description}
                            className="text-xs text-zinc-400 max-w-2xl font-normal leading-relaxed"
                          />
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pt-0.5">
                          <span className="flex items-center gap-1.5 py-0.5">
                            Initiated By:{" "}
                            <span className="text-zinc-300 font-bold">
                              {req.requestedByRole === "CLIENT" ? "Client" : "Agency"}
                            </span>
                          </span>
                          <span className="text-zinc-700">•</span>
                          <span
                            className={cn(
                              req.scopeType === "NEW_REQUEST" ? "text-amber-500" : "text-emerald-500"
                            )}
                          >
                            {req.scopeType === "NEW_REQUEST" ? "NEW REQUEST (EXTRA)" : "IN SCOPE"}
                          </span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-zinc-500 font-mono">
                            {format(new Date(req.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side stats & actions */}
                    <div className="flex flex-row md:flex-nowrap items-center gap-4 xl:gap-6 md:text-right w-full md:w-auto mt-2 md:mt-0 pl-14 md:pl-0">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                          Estimate
                        </p>
                        <p className="text-sm font-bold text-zinc-200 w-max">
                          {req.costImpact !== null && req.costImpact > 0
                            ? `$${req.costImpact}`
                            : "$0"}
                          <span className="text-zinc-600 font-normal mx-1">/</span>
                          <span className="text-zinc-400 font-medium">
                            {req.timelineImpact || "Not set"}
                          </span>
                        </p>
                      </div>

                      {/* Action buttons based on status */}
                      <div className="flex items-center gap-2">
                        {needsAgencyAction && (
                          <Button
                            size="sm"
                            onClick={() => openReviewModal(req)}
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs h-8 px-3 rounded-lg shadow-sm"
                          >
                            <FileEdit className="h-3.5 w-3.5 mr-1.5" />
                            Review & Propose
                          </Button>
                        )}

                        {req.convertedMilestoneId && (
                          <Link href={`/dashboard/projects/${projectId}/milestones`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs h-8 px-3 rounded-lg"
                            >
                              <MilestoneIcon className="h-3.5 w-3.5 mr-1.5" />
                              View Milestone
                            </Button>
                          </Link>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDetailModalRequest(req)}
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* DIALOG 1: Agency Creates Change Request */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-[#18181b] border-dashboard-border text-zinc-100">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Log Change Request</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Propose an out-of-scope addition or amendment with estimated price and timeline for the client to approve.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-zinc-300 font-semibold">
                  Request Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Add an admin analytics dashboard"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-zinc-300 font-semibold">
                  Scope Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe deliverables and expectations..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs min-h-[70px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 font-semibold">Scope Classification</Label>
                  <Select
                    value={createForm.scopeType}
                    onValueChange={(val: "IN_SCOPE" | "NEW_REQUEST") =>
                      setCreateForm({ ...createForm, scopeType: val })
                    }
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs h-10! mb-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                      <SelectItem value="NEW_REQUEST">New Request (Extra)</SelectItem>
                      <SelectItem value="IN_SCOPE">In Scope ($0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="costImpact" className="text-zinc-300 font-semibold">
                    Proposed Cost ($)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                      id="costImpact"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="300"
                      value={createForm.costImpact}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, costImpact: Number(e.target.value) })
                      }
                      className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timelineImpact" className="text-zinc-300 font-semibold">
                  Estimated Timeline Impact
                </Label>
                <Input
                  id="timelineImpact"
                  placeholder="e.g. +5 extra days, +1 week"
                  value={createForm.timelineImpact}
                  onChange={(e) => setCreateForm({ ...createForm, timelineImpact: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="agencyNote" className="text-zinc-300 font-semibold">
                  Note to Client (Optional)
                </Label>
                <Input
                  id="agencyNote"
                  placeholder="e.g. Will require 3rd party API key from you."
                  value={createForm.agencyNote}
                  onChange={(e) => setCreateForm({ ...createForm, agencyNote: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLoading}
                className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs"
              >
                {createLoading ? "Submitting..." : "Send Proposal to Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Agency Reviews Client Request & Sets Official Cost/Timeline */}
      <Dialog
        open={!!reviewModalRequest}
        onOpenChange={(open) => !open && setReviewModalRequest(null)}
      >
        <DialogContent className="sm:max-w-md bg-[#18181b] border-dashboard-border text-zinc-100">
          {reviewModalRequest && (
            <form onSubmit={handleReviewSubmit}>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Prepare Proposal for Client</DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Review the client's request and specify the official cost and timeline impact for client approval.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                {/* Client Request Context Box */}
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Client Request
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {format(new Date(reviewModalRequest.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="font-semibold text-zinc-200">{reviewModalRequest.title}</p>
                  {reviewModalRequest.description && (
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {reviewModalRequest.description}
                    </p>
                  )}
                  {reviewModalRequest.clientNote && (
                    <div className="pt-2 border-t border-zinc-800 mt-2 text-amber-400 text-[11px] space-y-1.5">
                      <div className="font-bold">Client Revision Feedback: </div>
                      <p>{reviewModalRequest.clientNote}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 font-semibold">Scope Classification</Label>
                    <Select
                      value={reviewForm.scopeType}
                      onValueChange={(val: "IN_SCOPE" | "NEW_REQUEST") =>
                        setReviewForm({ ...reviewForm, scopeType: val })
                      }
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs h-10! mb-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                        <SelectItem value="NEW_REQUEST">New Request (Extra)</SelectItem>
                        <SelectItem value="IN_SCOPE">In Scope ($0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reviewCost" className="text-zinc-300 font-semibold">
                      Official Cost ($)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                      <Input
                        id="reviewCost"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="250"
                        value={reviewForm.costImpact}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, costImpact: Number(e.target.value) })
                        }
                        className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reviewTimeline" className="text-zinc-300 font-semibold">
                    Estimated Timeline Impact *
                  </Label>
                  <Input
                    id="reviewTimeline"
                    placeholder="e.g. +3 business days"
                    value={reviewForm.timelineImpact}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, timelineImpact: e.target.value })
                    }
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reviewAgencyNote" className="text-zinc-300 font-semibold">
                    Proposal Note to Client
                  </Label>
                  <Textarea
                    id="reviewAgencyNote"
                    placeholder="Explain what is included and how it will be delivered..."
                    value={reviewForm.agencyNote}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, agencyNote: e.target.value })
                    }
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs min-h-[60px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setReviewModalRequest(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs"
                >
                  {reviewLoading ? "Submitting..." : "Send Proposal to Client"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: View Full Details */}
      <Dialog
        open={!!detailModalRequest}
        onOpenChange={(open) => !open && setDetailModalRequest(null)}
      >
        <DialogContent className="sm:max-w-lg bg-[#18181b] border-dashboard-border text-zinc-100">
          {detailModalRequest && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-bold">{detailModalRequest.title}</DialogTitle>
                </div>
                <div className="pt-1">{getStatusBadge(detailModalRequest.status)}</div>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                {detailModalRequest.description && (
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                      Description
                    </h4>
                    <p className="p-3 bg-zinc-900/80 rounded-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {detailModalRequest.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-900/80 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      Cost Impact
                    </span>
                    <p className="text-base font-bold text-zinc-100 mt-0.5">
                      {detailModalRequest.costImpact !== null && detailModalRequest.costImpact > 0
                        ? `$${detailModalRequest.costImpact}`
                        : "$0"}
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-900/80 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      Timeline Impact
                    </span>
                    <p className="text-base font-bold text-zinc-100 mt-0.5">
                      {detailModalRequest.timelineImpact || "None"}
                    </p>
                  </div>
                </div>

                {detailModalRequest.agencyNote && (
                  <div>
                    <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      Agency Proposal Note
                    </h4>
                    <p className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {detailModalRequest.agencyNote}
                    </p>
                  </div>
                )}

                {detailModalRequest.clientNote && (
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Client Feedback
                    </h4>
                    <p className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {detailModalRequest.clientNote}
                    </p>
                  </div>
                )}

                {detailModalRequest.convertedMilestone && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        Created Milestone
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {detailModalRequest.convertedMilestone.title}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Status: {detailModalRequest.convertedMilestone.status} • Amount: $
                        {detailModalRequest.convertedMilestone.amount || 0}
                      </p>
                    </div>
                    <Link href={`/dashboard/projects/${projectId}/milestones`}>
                      <Button size="sm" variant="outline" className="text-xs border-emerald-500/40 text-emerald-300">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <DialogFooter className="flex items-center justify-between">
                {detailModalRequest.status !== "CONVERTED" &&
                  detailModalRequest.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleCancelRequest(detailModalRequest.id);
                        setDetailModalRequest(null);
                      }}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs"
                    >
                      Cancel Request
                    </Button>
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailModalRequest(null)}
                  className="border-zinc-700 text-zinc-300 text-xs ml-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
