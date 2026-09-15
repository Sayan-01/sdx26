"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Clock, Upload, FileText, Plus, ExternalLink, Search, Copy, Check, Sparkles, AlertCircle, HelpCircle, FolderOpen, ArrowRight, RefreshCw, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { uploadPortalOnboardingItem } from "@server/onboarding";
import { toast } from "sonner";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";

interface OnboardingItem {
  id: string;
  label: string;
  status: "PENDING" | "UPLOADED" | "APPROVED" | "REJECTED";
  fileUrl?: string | null;
  projectId?: string;
  agencyId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface PortalOnboardingClientProps {
  initialItems: OnboardingItem[];
  token: string;
}

// Helper to recognize cloud/asset providers from URLs
function getUrlProviderInfo(url?: string | null) {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes("figma.com")) {
    return { name: "Figma File", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
  }
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com")) {
    return { name: "Google Drive", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  }
  if (lower.includes("loom.com")) {
    return { name: "Loom Video", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  }
  if (lower.includes("notion.so") || lower.includes("notion.site")) {
    return { name: "Notion Doc", color: "text-zinc-200 bg-zinc-700/20 border-zinc-600/30" };
  }
  if (lower.includes("dropbox.com")) {
    return { name: "Dropbox", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
  }
  if (lower.includes("github.com")) {
    return { name: "GitHub Repo", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  }
  return { name: "External Resource", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
}

export default function PortalOnboardingClient({ initialItems }: PortalOnboardingClientProps) {
  const [items, setItems] = useState<OnboardingItem[]>(initialItems);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [extraDialogOpen, setExtraDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OnboardingItem | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTION_REQUIRED" | "IN_REVIEW" | "APPROVED">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = items.length;
    const approved = items.filter((i) => i.status === "APPROVED").length;
    const uploaded = items.filter((i) => i.status === "UPLOADED").length;
    const pending = items.filter((i) => i.status === "PENDING" || i.status === "REJECTED").length;
    const completionPercent = total > 0 ? Math.round(((approved + uploaded * 0.5) / total) * 100) : 0;
    const isAllDone = total > 0 && approved === total;
    const isAllSubmitted = total > 0 && approved + uploaded === total;

    return { total, approved, uploaded, pending, completionPercent, isAllDone, isAllSubmitted };
  }, [items]);

  // Filtering items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === "ACTION_REQUIRED" && item.status !== "PENDING" && item.status !== "REJECTED") {
        return false;
      }
      if (activeTab === "IN_REVIEW" && item.status !== "UPLOADED") {
        return false;
      }
      if (activeTab === "APPROVED" && item.status !== "APPROVED") {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesLabel = item.label.toLowerCase().includes(query);
        const matchesStatus = item.status.toLowerCase().includes(query);
        const matchesUrl = item.fileUrl?.toLowerCase().includes(query);
        return matchesLabel || matchesStatus || matchesUrl;
      }

      return true;
    });
  }, [items, activeTab, searchQuery]);

  const handleOpenUpload = (item: OnboardingItem) => {
    setSelectedItem(item);
    setFileUrl(item.fileUrl || "");
    setUploadDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedItem || !fileUrl.trim()) {
      toast.error("Please provide a valid URL or link");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await uploadPortalOnboardingItem(selectedItem.id, fileUrl.trim());
      if (res.success && res.item) {
        setItems((prev) => prev.map((i) => (i.id === selectedItem.id ? { ...i, ...res.item } : i)));
        setUploadDialogOpen(false);
        setFileUrl("");
        setSelectedItem(null);
        toast.success("Resource submitted for agency review!");
      } else {
        toast.error(res.error || "Failed to upload item");
      }
    } catch {
      toast.error("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = (item: OnboardingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.fileUrl) return;
    navigator.clipboard.writeText(item.fileUrl);
    setCopiedId(item.id);
    toast.success("Resource URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const detectedProvider = getUrlProviderInfo(fileUrl);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-10">
      {/* Original Heading with Stats Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading
          title="Onboarding & Resources"
          description="Please provide the following assets to begin your project journey."
        />

        <div className="flex items-center gap-1 p-1 bg-[#151518] rounded-xl border border-dashboard-border shadow-sm">
          <div className="px-4 py-2 text-center border-r border-dashboard-border">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Approved</p>
            <p className="text-base font-bold text-emerald-500">{stats.approved}</p>
          </div>
          <div className="px-4 py-2 text-center border-r border-dashboard-border">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">In Review</p>
            <p className="text-base font-bold text-indigo-400">{stats.uploaded}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pending</p>
            <p className="text-base font-bold text-amber-500">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#151518] rounded-xl border border-dashboard-border overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "ALL" ? "bg-zinc-800 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40",
            )}
          >
            All Items
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-700/60 text-zinc-300">{stats.total}</span>
          </button>

          <button
            onClick={() => setActiveTab("ACTION_REQUIRED")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "ACTION_REQUIRED" ? "bg-zinc-800 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40",
            )}
          >
            Needs Action
            {stats.pending > 0 && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{stats.pending}</span>}
          </button>

          <button
            onClick={() => setActiveTab("IN_REVIEW")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "IN_REVIEW" ? "bg-zinc-800 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40",
            )}
          >
            In Review
            {stats.uploaded > 0 && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">{stats.uploaded}</span>}
          </button>

          <button
            onClick={() => setActiveTab("APPROVED")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
              activeTab === "APPROVED" ? "bg-zinc-800 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40",
            )}
          >
            Approved
            {stats.approved > 0 && <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{stats.approved}</span>}
          </button>
        </div>

        {/* Search Box */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 pr-8 bg-[#151518] border-dashboard-border text-xs rounded-xl focus-visible:ring-indigo-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Deliverables Card */}
      <DashboardCard
        title="Project Resources"
        icon={
            <FileText className="h-4 w-4 text-indigo-400" />
        }
        extra={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <span>{(filteredItems.length / items.length) * 100}% Completed</span>
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(filteredItems.length / items.length) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-[#151518] px-3 py-1 rounded-full border border-dashboard-border">{items.length} Items Total</span>
          </div>
        }
        className="h-full w-full"
      >
        {filteredItems.length === 0 ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 text-zinc-500">
              <FolderOpen className="h-8 w-8 stroke-1" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-300">No resources found</p>
              <p className="text-xs text-zinc-500 max-w-sm">
                {searchQuery ? `No items matched "${searchQuery}". Try searching for something else.` : "There are no onboarding items in this category."}
              </p>
            </div>
            {(searchQuery || activeTab !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("ALL");
                }}
                className="mt-2 text-xs border-dashboard-border bg-[#151518] hover:bg-zinc-800"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-dashboard-border">
            {filteredItems.map((item) => {
              const provider = getUrlProviderInfo(item.fileUrl);
              const isApproved = item.status === "APPROVED";
              const isUploaded = item.status === "UPLOADED";
              const isRejected = item.status === "REJECTED";
              const isPending = item.status === "PENDING";

              return (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 py-4 hover:bg-zinc-900/40 transition-all duration-200 gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 shadow-inner",
                        isApproved && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
                        isUploaded && "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5",
                        isRejected && "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5",
                        isPending && "bg-zinc-800/40 text-zinc-500 border-zinc-700/40 group-hover:border-zinc-600",
                      )}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isUploaded ? (
                        <Clock className="h-5 w-5 animate-pulse" />
                      ) : isRejected ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            "font-semibold text-sm sm:text-base tracking-tight truncate",
                            isApproved ? "text-zinc-200" : isRejected ? "text-rose-200" : "text-zinc-100 group-hover:text-white",
                          )}
                        >
                          {item.label}
                        </h3>

                        {/* Provider tag if URL submitted */}
                        {provider && (
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1", provider.color)}>
                            <Globe className="h-3 w-3" />
                            {provider.name}
                          </span>
                        )}
                      </div>

                      {/* Status subtitle and link previews */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isApproved && "bg-emerald-400",
                              isUploaded && "bg-amber-400 animate-pulse",
                              isRejected && "bg-rose-400",
                              isPending && "bg-zinc-600",
                            )}
                          />
                          <span className="capitalize">{isApproved ? "Approved by agency" : isUploaded ? "Under review" : isRejected ? "Changes requested" : "Action required"}</span>
                        </span>

                        {item.fileUrl && (
                          <>
                            <span className="text-zinc-700">•</span>
                            <div className="flex items-center gap-2">
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline inline-flex items-center gap-1 font-medium transition-colors"
                              >
                                View link
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <button
                                onClick={(e) => handleCopyLink(item, e)}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                                title="Copy link"
                              >
                                {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/40">
                    {isPending || isRejected ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenUpload(item)}
                        className={cn(
                          "h-9 px-4 font-bold rounded-xl shadow-sm transition-all active:scale-95 text-xs flex items-center gap-2",
                          isRejected ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-white text-zinc-950 hover:bg-zinc-200 hover:shadow-md",
                        )}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {isRejected ? "Resubmit Asset" : "Provide Asset"}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border flex items-center gap-1.5",
                            isApproved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          )}
                        >
                          {isApproved ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              In Review
                            </>
                          )}
                        </div>

                        {/* Replace / Update link button if client needs to correct */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenUpload(item)}
                          className="h-8 px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-xs flex items-center gap-1.5"
                          title="Update submitted URL"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span className="hidden md:inline">Update</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      {/* Submission Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      >
        <DialogContent className="bg-[#19191b] border-dashboard-border text-white">
          <DialogHeader>
            <DialogTitle>Provide Resource: {selectedItem?.label}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-url">Link to Resource (URL)</Label>
              <Input
                id="file-url"
                placeholder="Google Drive link, Figma link, etc."
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="bg-[#151518]"
              />
              <p className="text-[10px] text-zinc-500 italic">Note: In production, this would be a file upload. For now, please provide a URL.</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              className="border-dashboard-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isSubmitting}
              className="bg-white text-zinc-950 hover:bg-zinc-200"
            >
              {isSubmitting ? "Submitting..." : "Submit Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extra Resource / Need Help Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#19191c] via-[#161619] to-[#121214] border border-dashboard-border relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
          <Plus className="h-32 w-32 text-indigo-400 rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
              <Share2 className="h-3.5 w-3.5" />
              <span>Additional Materials</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Need to share something extra with the team?</h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium max-w-xl">Have additional brand guidelines, typography packages, test accounts, or project notes? Add them directly here.</p>
          </div>
          <Button
            onClick={() => setExtraDialogOpen(true)}
            variant="outline"
            className="h-11 px-6 border-dashboard-border bg-[#141417] hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Extra Resource
          </Button>
        </div>
      </div>

      {/* Extra Resource Help Modal */}
      <Dialog
        open={extraDialogOpen}
        onOpenChange={setExtraDialogOpen}
      >
        <DialogContent className="bg-[#18181b] border-dashboard-border text-white sm:max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Plus className="h-3.5 w-3.5" />
              <span>Extra Deliverables</span>
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-white">Send Additional Resources</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs leading-relaxed">
              If your agency hasn&apos;t added an item to your checklist yet, you can share links directly or reach out via the messages tab.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs text-zinc-300">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <p className="font-semibold text-white">How to submit unlisted assets:</p>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
                <li>Notify your project manager in the portal chat to add a dedicated checklist item.</li>
                <li>Ensure all links have public viewing permissions.</li>
                <li>You can also email your assigned account lead directly.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setExtraDialogOpen(false);
                toast.info("Tip: You can use the Project Chat or Files tab to upload files directly!");
              }}
              className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
