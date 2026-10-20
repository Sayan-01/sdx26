"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Plus,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Milestone as MilestoneIcon,
  Send,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building,
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClientChangeRequest, respondToChangeRequestByClient } from "@server/scope";
import Link from "next/link";
import { format } from "date-fns";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";

export interface PortalScopeRequest {
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

export default function PortalScopeClient({
  token,
  projectId,
  initialRequests,
}: {
  token: string;
  projectId: string;
  initialRequests: PortalScopeRequest[];
}) {
  const [requests, setRequests] = useState<PortalScopeRequest[]>(initialRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client Create Request Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
  });

  // Client Revision Request Modal
  const [revisionModalRequest, setRevisionModalRequest] = useState<PortalScopeRequest | null>(null);
  const [revisionNote, setRevisionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleClientCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      toast.error("Please enter a request title");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createClientChangeRequest({
        projectId,
        title: createForm.title,
        description: createForm.description,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Change request submitted! Agency will review and provide an estimate.");
        setIsCreateOpen(false);
        setCreateForm({ title: "", description: "" });
        // Optimistically add to state
        if (res.request) {
          setRequests([res.request as unknown as PortalScopeRequest, ...requests]);
        }
      }
    } catch {
      toast.error("Failed to submit change request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecision = async (
    requestId: string,
    decision: "APPROVE" | "REJECT" | "NEEDS_REVISION",
    clientNote?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await respondToChangeRequestByClient({
        requestId,
        decision,
        clientNote,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        if (decision === "APPROVE") {
          toast.success("Proposal approved! A new milestone has been created.");
        } else if (decision === "REJECT") {
          toast.info("Change request declined. No additional work or fee will be created.");
        } else if (decision === "NEEDS_REVISION") {
          toast.success("Revision feedback sent to your agency team.");
        }

        // Update local request state
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id === requestId) {
              return {
                ...r,
                status:
                  decision === "APPROVE"
                    ? "CONVERTED"
                    : decision === "REJECT"
                    ? "REJECTED"
                    : "NEEDS_REVISION",
                clientNote: clientNote || r.clientNote,
                convertedMilestoneId: (res as any)?.milestone?.id || r.convertedMilestoneId,
                convertedMilestone: (res as any)?.milestone || r.convertedMilestone,
              };
            }
            return r;
          })
        );
      }
    } catch {
      toast.error("Failed to submit your response");
    } finally {
      setActionLoading(false);
      setRevisionModalRequest(null);
    }
  };

  const pendingProposals = requests.filter((r) => r.status === "PENDING_CLIENT_APPROVAL");
  const otherRequests = requests.filter((r) => r.status !== "PENDING_CLIENT_APPROVAL");

  const getStatusBadge = (status: PortalScopeRequest["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Awaiting Agency Estimate
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
            <Send className="w-3.5 h-3.5" /> Action Required: Review Proposal
          </span>
        );
      case "APPROVED":
      case "CONVERTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & In Progress
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Declined
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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full pb-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeading
          title="Scope & Change Requests"
          description="Review proposed scope additions, approve budget & timeline changes, or request new features."
        />
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-semibold text-xs"
        >
          <Plus className="h-4 w-4" />
          Request a Change
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-[#19191b] border-dashboard-border rounded-xl py-0">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-zinc-200">
              Transparent Scope Protection
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              You are never billed for unexpected extras. Any out-of-scope addition must be proposed by the agency with clear cost and timeline impacts, and strictly requires your explicit approval before any milestone is scheduled.
            </p>
          </div>
        </div>
      </Card>

      {/* ACTION REQUIRED: Pending Proposals Section */}
      {pendingProposals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
              Proposals Awaiting Your Approval ({pendingProposals.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingProposals.map((req) => (
              <Card
                key={req.id}
                className="bg-[#151518] border-indigo-500/40 rounded-xl overflow-hidden p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-bold text-white">{req.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest">
                        {req.scopeType === "NEW_REQUEST" ? "NEW FEATURE (EXTRA)" : "IN SCOPE"}
                      </span>
                    </div>

                    {req.description && (
                      <ExpandableDescription
                        text={req.description}
                        className="text-xs text-zinc-300 leading-relaxed"
                      />
                    )}

                    {req.agencyNote && (
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mt-2 whitespace-pre-wrap">
                        <span className="font-bold text-zinc-400">Agency Proposal Note: </span>
                        {req.agencyNote}
                      </div>
                    )}
                  </div>

                  {/* Impact & Action Controls */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between pl-5 gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-l h-full border-zinc-800">
                    <div className="text-left lg:text-right space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        Proposed Impact
                      </p>
                      <p className="text-lg font-bold text-emerald-400">
                        {req.costImpact && req.costImpact > 0 ? `$${req.costImpact}` : "$0"}
                        <span className="text-xs text-zinc-400 font-normal ml-1.5">
                          / {req.timelineImpact || "No time added"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        disabled={actionLoading}
                        onClick={() => handleDecision(req.id, "APPROVE")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-md"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Approve Proposal
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => {
                          setRevisionModalRequest(req);
                          setRevisionNote("");
                        }}
                        className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs h-8 px-3 rounded-lg"
                      >
                        Request Revision
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={actionLoading}
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to decline this request? No extra work will be scheduled."
                            )
                          ) {
                            handleDecision(req.id, "REJECT");
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-xs h-8 px-3 rounded-lg"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ALL REQUESTS HISTORY */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Request History & Activity
        </h3>

        <Card className="bg-[#151518] border-dashboard-border rounded-xl overflow-hidden p-0">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-300">No change requests yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                Click "Request a Change" whenever you would like to add new deliverables to your project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {requests.map((req, index) => {
                const isLeftCol = index % 2 === 0;
                const isLastItem = index === requests.length - 1;
                const isLastRowMd =
                  index >= requests.length - (requests.length % 2 === 0 ? 2 : 1);

                return (
                  <div
                    key={req.id}
                    className={cn(
                      "p-4 sm:p-5 flex flex-col justify-between gap-4 hover:bg-zinc-900/40 transition-colors border-dashboard-border",
                      // Mobile bottom border (all except last item)
                      !isLastItem && "border-b",
                      // Desktop bottom border (all except items in the last row)
                      isLastRowMd ? "md:border-b-0" : "md:border-b",
                      // Desktop vertical border between left and right columns
                      isLeftCol && requests.length > 1 && "md:border-r"
                    )}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm font-bold text-zinc-200">{req.title}</h4>
                        {getStatusBadge(req.status)}
                      </div>

                      {req.description && (
                        <ExpandableDescription
                          text={req.description}
                          className="text-xs text-zinc-400 leading-relaxed"
                        />
                      )}

                      {req.clientNote && req.status === "NEEDS_REVISION" && (
                        <p className="text-[11px] text-amber-400/90 pt-1 whitespace-pre-wrap">
                          <span className="font-bold">Your revision request:</span> {req.clientNote}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/60 mt-auto">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                        <span>
                          Initiated By:{" "}
                          <span className="text-zinc-300 font-bold">
                            {req.requestedByRole === "CLIENT" ? "You" : "Agency"}
                          </span>
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span>
                          Type:{" "}
                          <span className="text-zinc-300 font-bold">
                            {req.scopeType === "NEW_REQUEST" ? "New Request" : "In Scope"}
                          </span>
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span>{format(new Date(req.createdAt), "MMM d, yyyy")}</span>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right shrink-0">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            Cost / Time
                          </p>
                          <p className="text-sm font-bold text-zinc-200">
                            {req.costImpact && req.costImpact > 0 ? `$${req.costImpact}` : "$0"}
                            <span className="text-zinc-600 font-normal mx-1">/</span>
                            <span className="text-zinc-400 font-medium">
                              {req.timelineImpact || "Pending"}
                            </span>
                          </p>
                        </div>

                        {req.convertedMilestoneId && (
                          <Link href={`/portal/${token}/milestones`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs h-8 rounded-lg"
                            >
                              <MilestoneIcon className="h-3.5 w-3.5 mr-1" />
                              View Milestone
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* DIALOG 1: Client Submits Request */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-[#18181b] border-dashboard-border text-zinc-100">
          <form onSubmit={handleClientCreate}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Submit a Change Request</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Describe the addition or modification you would like. Our agency team will review it and prepare an official cost and timeline estimate for your approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="reqTitle" className="text-zinc-300 font-semibold">
                  What would you like to add? *
                </Label>
                <Input
                  id="reqTitle"
                  placeholder="e.g. Add a coupon and discount system to the website"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reqDesc" className="text-zinc-300 font-semibold">
                  Details & Requirements
                </Label>
                <Textarea
                  id="reqDesc"
                  placeholder="Please specify any particular behavior, fields, or deadlines..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs min-h-[90px]"
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
                disabled={isSubmitting}
                className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs"
              >
                {isSubmitting ? "Submitting..." : "Submit to Agency"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Client Requests Revision on Agency Proposal */}
      <Dialog
        open={!!revisionModalRequest}
        onOpenChange={(open) => !open && setRevisionModalRequest(null)}
      >
        <DialogContent className="sm:max-w-md bg-[#18181b] border-dashboard-border text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Request a Proposal Revision</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Let the agency know what needs adjustment (e.g., budget adjustments, timeline constraints, or scope tweaks).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="revNote" className="text-zinc-300 font-semibold">
                Revision Details *
              </Label>
              <Textarea
                id="revNote"
                placeholder="e.g. Can we complete this in 3 days instead? We need this live before the product launch."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 text-xs min-h-[90px]"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRevisionModalRequest(null)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={actionLoading || !revisionNote.trim()}
              onClick={() => {
                if (revisionModalRequest) {
                  handleDecision(revisionModalRequest.id, "NEEDS_REVISION", revisionNote);
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs"
            >
              {actionLoading ? "Submitting..." : "Send Revision Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
