'use client';

import React, { useState, useRef } from "react";
import { 
  FileBox, 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal, 
  History, 
  Eye, 
  Download,
  Trash2,
  Image as ImageIcon,
  FileArchive,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  Video,
  Plus,
  Check,
  Copy,
  Clock,
  Sparkles,
  GitBranch,
  Layers,
  ArrowUpRight,
  FileCode,
  Share2,
  Calendar,
  User as UserIcon,
  Milestone as MilestoneIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  uploadFile, 
  addFileVersion, 
  deleteFile, 
  updateFileStatus 
} from "@server/projects";
import { formatDistanceToNow, format } from "date-fns";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MilestoneOption {
  id: string;
  title: string;
  status?: string;
  orderIndex?: number;
}

interface FileVersionItem {
  id: string;
  versionNumber: number;
  storageKey: string;
  fileName: string;
  fileSizeBytes: number;
  changeNote?: string | null;
  createdAt: string | Date;
  uploadedBy?: {
    name: string | null;
  };
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  rawSize: number;
  version: number;
  status: "uploaded" | "under_review" | "approved" | "revision_requested";
  uploader: string;
  at: string;
  rawCreatedAt: Date;
  milestoneId?: string | null;
  milestone: string;
  fileUrl: string;
  fileVersions: FileVersionItem[];
  iconBg: string;
  iconColor: string;
  isLink: boolean;
}

export default function FilesClient({
  projectId,
  rawFiles,
  milestones = [],
  limits,
  storageUsed: initialStorageUsed
}: {
  projectId: string;
  rawFiles: any[];
  milestones?: MilestoneOption[];
  limits?: { maxProjects: number; maxTeamMembers: number; maxStorageGb: number };
  storageUsed?: number;
}) {
  const router = useRouter();

  const getFileIcon = (type: string | null) => {
    const t = (type || "").toLowerCase();
    if (t.includes("figma")) return <Layers className="h-4 w-4" />;
    if (t.includes("preview") || t.includes("website") || t.includes("staging")) return <Globe className="h-4 w-4" />;
    if (t.includes("video") || t.includes("loom") || t.includes("youtube")) return <Video className="h-4 w-4" />;
    if (t.includes("github") || t.includes("git")) return <GitBranch className="h-4 w-4" />;
    if (t.startsWith("link")) return <LinkIcon className="h-4 w-4" />;
    if (t.includes("image") || t.includes("png") || t.includes("jpg") || t.includes("webp") || t.includes("svg")) return <ImageIcon className="h-4 w-4" />;
    if (t.includes("zip") || t.includes("rar") || t.includes("archive") || t.includes("tar")) return <FileArchive className="h-4 w-4" />;
    if (t.includes("pdf")) return <FileText className="h-4 w-4" />;
    if (t.includes("code") || t.includes("json") || t.includes("typescript") || t.includes("javascript")) return <FileCode className="h-4 w-4" />;
    return <FileBox className="h-4 w-4" />;
  };

  const getIconStyles = (type: string | null) => {
    const t = (type || "").toLowerCase();
    if (t.includes("figma")) return { bg: "bg-purple-500/10", color: "text-purple-400" };
    if (t.includes("preview") || t.includes("website") || t.includes("staging")) return { bg: "bg-emerald-500/10", color: "text-emerald-400" };
    if (t.includes("video") || t.includes("loom")) return { bg: "bg-rose-500/10", color: "text-rose-400" };
    if (t.includes("github")) return { bg: "bg-slate-500/10", color: "text-slate-300" };
    if (t.startsWith("link")) return { bg: "bg-cyan-500/10", color: "text-cyan-400" };
    if (t.includes("image") || t.includes("png") || t.includes("jpg")) return { bg: "bg-blue-500/10", color: "text-blue-400" };
    if (t.includes("zip") || t.includes("rar") || t.includes("archive")) return { bg: "bg-amber-500/10", color: "text-amber-400" };
    if (t.includes("pdf")) return { bg: "bg-rose-500/10", color: "text-rose-400" };
    return { bg: "bg-indigo-500/10", color: "text-indigo-400" };
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 KB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const mapRawFile = (file: any): FileItem => {
    const styles = getIconStyles(file.fileType);
    const sizeInBytes = file.fileVersions?.[0]?.fileSizeBytes ? Number(file.fileVersions[0].fileSizeBytes) : 0;
    const isLinkType = (file.fileType || "").toLowerCase().startsWith("link");
    
    return {
      id: file.id,
      name: file.fileName,
      type: file.fileType || "unknown",
      size: isLinkType ? "External Link" : formatSize(sizeInBytes),
      rawSize: sizeInBytes,
      version: file.fileVersions?.length ? Math.max(...file.fileVersions.map((v: any) => v.versionNumber || 1)) : 1,
      status: (file.status ? file.status.toLowerCase() : "uploaded") as any,
      uploader: file.uploader?.name || "Team Member",
      at: formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }),
      rawCreatedAt: new Date(file.createdAt),
      milestoneId: file.milestoneId || null,
      milestone: file.milestone?.title || "No milestone",
      fileUrl: file.url,
      fileVersions: file.fileVersions || [],
      iconBg: styles.bg,
      iconColor: styles.color,
      isLink: isLinkType
    };
  };

  const [files, setFiles] = useState<FileItem[]>(rawFiles.map(mapRawFile));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"ALL" | "FILE" | "LINK" | "IMAGE" | "DOCUMENT">("ALL");
  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>("ALL");
  const [storageUsed, setStorageUsed] = useState(initialStorageUsed || 0);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<"FILE" | "LINK">("FILE");
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("none");
  const [linkCategory, setLinkCategory] = useState<"link/preview" | "link/figma" | "link/video" | "link/github" | "link/other">("link/preview");
  const [linkUrl, setLinkUrl] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Version Modal State
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState(false);
  const [activeFileForVersion, setActiveFileForVersion] = useState<FileItem | null>(null);
  const [newVersionUrl, setNewVersionUrl] = useState("");
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [newVersionNote, setNewVersionNote] = useState("");
  const [isSubmittingVersion, setIsSubmittingVersion] = useState(false);

  // History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeFileForHistory, setActiveFileForHistory] = useState<FileItem | null>(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeFileForDelete, setActiveFileForDelete] = useState<FileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers
  const handleOpenUploadModal = () => {
    setSelectedFileObj(null);
    setCustomTitle("");
    setSelectedMilestoneId("none");
    setLinkUrl("");
    setVersionNote("");
    setUploadTab("FILE");
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileObj(file);
      if (!customTitle) {
        setCustomTitle(file.name);
      }
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadTab === "FILE") {
      if (!selectedFileObj) {
        toast.error("Please select a file to upload");
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading(`Uploading ${selectedFileObj.name}...`);

      try {
        const simulatedUrl = `https://milestack-uploads.s3.amazonaws.com/projects/${projectId}/${Date.now()}-${selectedFileObj.name}`;
        const milestoneToPass = selectedMilestoneId === "none" ? undefined : selectedMilestoneId;

        const res = await uploadFile(projectId, {
          fileName: customTitle.trim() || selectedFileObj.name,
          fileType: selectedFileObj.type || "application/octet-stream",
          fileSizeBytes: selectedFileObj.size,
          url: simulatedUrl,
          milestoneId: milestoneToPass,
        });

        if (res.success && res.file) {
          const newMappedFile = mapRawFile(res.file);
          setFiles(prev => [newMappedFile, ...prev]);
          setStorageUsed(prev => prev + selectedFileObj.size);
          toast.success("File uploaded successfully!", { id: toastId });
          setIsUploadModalOpen(false);
          router.refresh();
        } else {
          toast.error(res.error || "Failed to upload file", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred during upload", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // LINK UPLOAD
      if (!linkUrl.trim()) {
        toast.error("Please enter a valid URL");
        return;
      }

      let formattedUrl = linkUrl.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const title = customTitle.trim() || (
        linkCategory === "link/figma" ? "Figma Prototype" :
        linkCategory === "link/preview" ? "Website Preview" :
        linkCategory === "link/video" ? "Loom Walkthrough" :
        linkCategory === "link/github" ? "GitHub Repository" : "Project Deliverable Link"
      );

      setIsSubmitting(true);
      const toastId = toast.loading("Adding deliverable link...");

      try {
        const milestoneToPass = selectedMilestoneId === "none" ? undefined : selectedMilestoneId;

        const res = await uploadFile(projectId, {
          fileName: title,
          fileType: linkCategory,
          fileSizeBytes: 0,
          url: formattedUrl,
          milestoneId: milestoneToPass,
        });

        if (res.success && res.file) {
          const newMappedFile = mapRawFile(res.file);
          setFiles(prev => [newMappedFile, ...prev]);
          toast.success("Deliverable link added successfully!", { id: toastId });
          setIsUploadModalOpen(false);
          router.refresh();
        } else {
          toast.error(res.error || "Failed to add link", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred", { id: toastId });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenNewVersionModal = (file: FileItem) => {
    setActiveFileForVersion(file);
    setNewVersionUrl(file.isLink ? file.fileUrl : "");
    setNewVersionFile(null);
    setNewVersionNote("");
    setIsNewVersionModalOpen(true);
  };

  const handleSubmitNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFileForVersion) return;

    let targetUrl = activeFileForVersion.fileUrl;
    let size = 0;

    if (activeFileForVersion.isLink) {
      if (!newVersionUrl.trim()) {
        toast.error("Please enter a valid URL for the new version");
        return;
      }
      targetUrl = newVersionUrl.trim();
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = `https://${targetUrl}`;
      }
    } else {
      if (!newVersionFile) {
        toast.error("Please select an updated file");
        return;
      }
      targetUrl = `https://milestack-uploads.s3.amazonaws.com/projects/${projectId}/v${activeFileForVersion.version + 1}-${newVersionFile.name}`;
      size = newVersionFile.size;
    }

    setIsSubmittingVersion(true);
    const toastId = toast.loading(`Publishing v${activeFileForVersion.version + 1}...`);

    try {
      const res = await addFileVersion(activeFileForVersion.id, projectId, {
        url: targetUrl,
        fileSizeBytes: size,
        changeNote: newVersionNote.trim() || `Updated to version ${activeFileForVersion.version + 1}`,
      });

      if (res.success && res.version) {
        setFiles(prev => prev.map(f => {
          if (f.id === activeFileForVersion.id) {
            const updatedVersions = [res.version as any, ...(f.fileVersions || [])];
            return {
              ...f,
              version: res.version.versionNumber,
              fileUrl: targetUrl,
              size: f.isLink ? "External Link" : formatSize(size || f.rawSize),
              rawSize: size || f.rawSize,
              fileVersions: updatedVersions
            };
          }
          return f;
        }));

        if (size > 0) {
          setStorageUsed(prev => prev + size);
        }

        toast.success(`Version ${res.version.versionNumber} published!`, { id: toastId });
        setIsNewVersionModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to add version", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating version", { id: toastId });
    } finally {
      setIsSubmittingVersion(false);
    }
  };

  const handleOpenHistoryModal = (file: FileItem) => {
    setActiveFileForHistory(file);
    setIsHistoryModalOpen(true);
  };

  const handleOpenDeleteModal = (file: FileItem) => {
    setActiveFileForDelete(file);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!activeFileForDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting asset...");

    try {
      const res = await deleteFile(activeFileForDelete.id, projectId);
      if (res.success) {
        setFiles(prev => prev.filter(f => f.id !== activeFileForDelete.id));
        if (activeFileForDelete.rawSize > 0) {
          setStorageUsed(prev => Math.max(0, prev - activeFileForDelete.rawSize));
        }
        toast.success("Asset deleted successfully", { id: toastId });
        setIsDeleteModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete file", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during deletion", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (fileId: string, newStatus: "UPLOADED" | "UNDER_REVIEW" | "APPROVED" | "REVISION_REQUESTED") => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await updateFileStatus(fileId, projectId, newStatus);
      if (res.success) {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: newStatus.toLowerCase() as any } : f));
        toast.success(`Status updated to ${newStatus.replace("_", " ")}`, { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status", { id: toastId });
      }
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard! 📋");
  };

  // Filter Files
  const filteredFiles = files.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.milestone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.uploader.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMilestone = 
      selectedMilestoneFilter === "ALL" ||
      (selectedMilestoneFilter === "NO_MILESTONE" && !f.milestoneId) ||
      f.milestoneId === selectedMilestoneFilter;

    let matchesType = true;
    if (selectedTypeFilter === "FILE") matchesType = !f.isLink;
    if (selectedTypeFilter === "LINK") matchesType = f.isLink;
    if (selectedTypeFilter === "IMAGE") matchesType = f.type.includes("image");
    if (selectedTypeFilter === "DOCUMENT") matchesType = f.type.includes("pdf") || f.type.includes("doc") || f.type.includes("text");

    return matchesSearch && matchesMilestone && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Approved
          </span>
        );
      case "revision_requested":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="size-1.5 rounded-full bg-rose-400" />
            Revision Requested
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="size-1.5 rounded-full bg-indigo-400" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-400" />
            Uploaded
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 h-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Project Files &amp; Deliverables</h2>
            <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground font-mono">
              {files.length} Assets
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Manage project files, staging links, Figma deliverables, and version control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleOpenUploadModal} 
            className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add File or Link
          </Button>
        </div>
      </div>

      {/* Storage Limit Bar */}
      {limits && (
        <div className="p-4 px-5 rounded-2xl bg-zinc-900/50 border border-dashboard-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 shrink-0">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Plan Storage Usage
            </h4>
            <p className="text-sm text-zinc-300 font-medium">
              Using <span className="text-white font-bold">{formatSize(storageUsed)}</span> of{" "}
              <span className="text-white font-bold">
                {limits.maxStorageGb >= 999999 ? "Unlimited" : `${limits.maxStorageGb} GB`}
              </span>
              <span className="text-xs text-zinc-500 ml-2 font-normal">(External links do not count against storage)</span>
            </p>
          </div>

          {limits.maxStorageGb < 999999 && (
            <div className="flex-1 w-full max-w-md">
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-1.5 border border-zinc-800/50">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    (storageUsed / (limits.maxStorageGb * 1024 * 1024 * 1024)) * 100 > 90
                      ? "bg-rose-500"
                      : (storageUsed / (limits.maxStorageGb * 1024 * 1024 * 1024)) * 100 > 75
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                  )}
                  style={{
                    width: `${Math.min(
                      100,
                      (storageUsed / (limits.maxStorageGb * 1024 * 1024 * 1024)) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>Starter Quota</span>
                <span>{((storageUsed / (limits.maxStorageGb * 1024 * 1024 * 1024)) * 100).toFixed(1)}% Used</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Files Card */}
      <DashboardCard
        icon={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full grow">
            {/* Search Input */}
            <div className="relative flex-1 group min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <Input
                placeholder="Search assets, milestones, uploaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-xs rounded-xl"
              />
            </div>

            {/* Milestone Filter Dropdown */}
            <div className="w-full sm:w-56 shrink-0">
              <Select value={selectedMilestoneFilter} onValueChange={setSelectedMilestoneFilter}>
                <SelectTrigger className="h-9 bg-[#151518] border-dashboard-border text-xs rounded-xl text-zinc-300">
                  <SelectValue placeholder="Filter by Milestone" />
                </SelectTrigger>
                <SelectContent className="bg-[#18191f] border-zinc-800 text-xs text-zinc-200">
                  <SelectItem value="ALL">All Milestones</SelectItem>
                  <SelectItem value="NO_MILESTONE">General (No Milestone)</SelectItem>
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.orderIndex ? `#${m.orderIndex} ` : ""}{m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        extra={
          /* Type Pills Filter */
          <div className="hidden lg:flex items-center gap-1 bg-[#121316] p-1 rounded-xl border border-dashboard-border text-xs">
            {(["ALL", "FILE", "LINK", "IMAGE", "DOCUMENT"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTypeFilter(type)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer",
                  selectedTypeFilter === type
                    ? "bg-zinc-800 text-white font-semibold shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {type === "ALL" ? "All" : type === "FILE" ? "Files" : type === "LINK" ? "Links" : type === "IMAGE" ? "Images" : "Docs"}
              </button>
            ))}
          </div>
        }
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box min-h-[350px]">
          {files.length === 0 ? (
            <div className="p-12 text-center text-sm text-zinc-500 flex flex-col items-center justify-center gap-3">
              <div className="size-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <FileBox className="h-7 w-7" />
              </div>
              <div className="font-semibold text-zinc-300 text-base">No deliverables or files yet</div>
              <p className="text-xs text-zinc-500 max-w-sm">
                Upload your first design deliverable, staging preview link, or specification document to share with the client.
              </p>
              <Button onClick={handleOpenUploadModal} variant="outline" className="mt-2 text-xs border-zinc-700 hover:bg-zinc-800">
                <Plus className="size-3.5 mr-1.5" />
                Add First Asset
              </Button>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No files or links match the search or filter criteria.
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
              >
                {/* Left: Icon & Title & Metadata */}
                <div className="flex items-start md:items-center gap-4 w-full md:w-auto min-w-0">
                  <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashboard-border/50 transition-transform group-hover:scale-105", file.iconBg, file.iconColor)}>
                    {getFileIcon(file.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors truncate hover:underline flex items-center gap-1.5"
                      >
                        <span>{file.name}</span>
                        {file.isLink && <ArrowUpRight className="size-3 text-zinc-500" />}
                      </a>

                      {/* Version Pill (Click to view history) */}
                      <button
                        onClick={() => handleOpenHistoryModal(file)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700/80 border border-dashboard-border/60 text-[10px] text-zinc-300 font-medium transition-colors cursor-pointer"
                        title="Click to view version history"
                      >
                        <History className="size-2.5 text-zinc-400" />
                        v{file.version}
                      </button>

                      {file.isLink && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 font-mono">
                          Link
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-mono">
                        {file.size}
                      </span>
                      <span className="size-1 rounded-full bg-zinc-700" />
                      
                      {/* Milestone Badge */}
                      <span className="flex items-center gap-1 text-zinc-400">
                        <MilestoneIcon className="size-3 text-indigo-400" />
                        <span className={file.milestoneId ? "text-zinc-300 font-medium" : "text-zinc-500"}>
                          {file.milestone}
                        </span>
                      </span>

                      <span className="size-1 rounded-full bg-zinc-700" />
                      <span>By {file.uploader}</span>
                      <span className="size-1 rounded-full bg-zinc-700" />
                      <span>{file.at}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pl-14 md:pl-0">
                  {/* Status Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer focus:outline-none">
                        {getStatusBadge(file.status)}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#18191f] border-zinc-800 text-xs text-zinc-300">
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-zinc-500">
                        Update Status
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusChange(file.id, "UPLOADED")}>
                        Mark as Uploaded
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(file.id, "UNDER_REVIEW")}>
                        Mark Under Review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(file.id, "APPROVED")}>
                        Mark as Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(file.id, "REVISION_REQUESTED")}>
                        Request Revision
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Open / Preview */}
                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                        title={file.isLink ? "Open URL" : "Preview file"}
                      >
                        {file.isLink ? <ExternalLink className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </a>

                    {/* New Version Quick Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenNewVersionModal(file)}
                      className="h-8 px-2.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg gap-1.5"
                      title="Upload new version"
                    >
                      <Plus className="h-3 w-3" />
                      <span>New Version</span>
                    </Button>

                    {/* More Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#18191f] border-zinc-800 text-xs text-zinc-300 w-44">
                        <DropdownMenuItem onClick={() => handleCopyLink(file.fileUrl)} className="gap-2">
                          <Copy className="size-3.5" />
                          <span>Copy Link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenHistoryModal(file)} className="gap-2">
                          <History className="size-3.5" />
                          <span>Version History</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenNewVersionModal(file)} className="gap-2">
                          <Plus className="size-3.5" />
                          <span>Add New Version</span>
                        </DropdownMenuItem>
                        
                        {!file.isLink && (
                          <a href={file.fileUrl} download className="w-full">
                            <DropdownMenuItem className="gap-2">
                              <Download className="size-3.5" />
                              <span>Download</span>
                            </DropdownMenuItem>
                          </a>
                        )}

                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem 
                          onClick={() => handleOpenDeleteModal(file)} 
                          className="gap-2 text-rose-400 focus:text-rose-300 focus:bg-rose-500/10"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Delete Asset</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>

      {/* ======================================================== */}
      {/* 1. UPLOAD ASSET & LINK MODAL */}
      {/* ======================================================== */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#121318] border-zinc-800 text-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="size-4 text-cyan-400" />
              Add Project Asset &amp; Deliverable
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Upload files or share preview links and assign them directly to project milestones.
            </DialogDescription>
          </DialogHeader>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 mt-1">
            <button
              type="button"
              onClick={() => setUploadTab("FILE")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                uploadTab === "FILE"
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Upload className="size-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadTab("LINK")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
                uploadTab === "LINK"
                  ? "bg-zinc-800 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <LinkIcon className="size-3.5" />
              Add External Link
            </button>
          </div>

          <form onSubmit={handleCreateAsset} className="space-y-4 mt-2">
            {/* FILE TAB */}
            {uploadTab === "FILE" ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-700/80 hover:border-zinc-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-900/40 hover:bg-zinc-900/70"
                >
                  <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-2 text-zinc-300">
                    <Upload className="size-5" />
                  </div>
                  {selectedFileObj ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-white">{selectedFileObj.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{formatSize(selectedFileObj.size)}</div>
                      <div className="text-[10px] text-indigo-400 font-medium">Click to change file</div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-zinc-200">Click to select file or drag &amp; drop</div>
                      <div className="text-[10px] text-zinc-500">PDF, PNG, JPG, ZIP, RAR, or DOC up to 50MB</div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Asset Title</label>
                  <Input
                    placeholder="e.g. Wireframe Specification Doc"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-xs rounded-lg mt-1.5"
                  />
                </div>
              </div>
            ) : (
              /* LINK TAB */
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Link Type</label>
                  <Select value={linkCategory} onValueChange={(val: any) => setLinkCategory(val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-xs rounded-lg text-zinc-200 h-10! mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18191f] border-zinc-800 text-xs text-zinc-200">
                      <SelectItem value="link/preview">🌐 Website Development Preview / Staging</SelectItem>
                      <SelectItem value="link/figma">🎨 Figma Prototype &amp; Design Canvas</SelectItem>
                      <SelectItem value="link/video">🎥 Loom / Video Walkthrough</SelectItem>
                      <SelectItem value="link/github">💻 GitHub Repository / Pull Request</SelectItem>
                      <SelectItem value="link/other">🔗 Other Deliverable Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Deliverable URL</label>
                  <Input
                    placeholder="https://preview.vercel.app or https://figma.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-xs rounded-lg font-mono mt-1.5"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Asset Title</label>
                  <Input
                    placeholder="e.g. Frontend Staging Preview v1"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-xs rounded-lg mt-1.5"
                  />
                </div>
              </div>
            )}

            {/* Common: Milestone Selector */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  Assign to Milestone
                  <MilestoneIcon className="size-3.5 text-indigo-400" />
                </label>
                <span className="text-[10px] text-zinc-500">Optional</span>
              </div>
              <Select value={selectedMilestoneId} onValueChange={setSelectedMilestoneId}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-xs rounded-lg text-zinc-200 h-10!">
                  <SelectValue placeholder="Select a milestone" />
                </SelectTrigger>
                <SelectContent className="bg-[#18191f] border-zinc-800 text-xs text-zinc-200">
                  <SelectItem value="none">General Asset (No specific milestone)</SelectItem>
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.orderIndex ? `Milestone #${m.orderIndex}: ` : ""}{m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs px-5 rounded-xl cursor-pointer"
              >
                {isSubmitting ? "Saving..." : uploadTab === "FILE" ? "Upload File" : "Save Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 2. NEW VERSION MODAL */}
      {/* ======================================================== */}
      <Dialog open={isNewVersionModalOpen} onOpenChange={setIsNewVersionModalOpen}>
        <DialogContent className="sm:max-w-[460px] bg-[#121318] border-zinc-800 text-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="size-4 text-emerald-400" />
              Publish New Version: {activeFileForVersion?.name}
            </DialogTitle>
            
            <DialogDescription className="text-xs text-zinc-400 border-t border-zinc-700/80 pt-3 mt-2">
              Updating to <span className="text-white font-bold font-mono">v{(activeFileForVersion?.version || 1) + 1}</span>. Past versions remain saved in version history.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitNewVersion} className="space-y-4 mt-2">
            {activeFileForVersion?.isLink ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Updated Deliverable URL</label>
                <Input
                  value={newVersionUrl}
                  onChange={(e) => setNewVersionUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="bg-zinc-900 border-zinc-800 text-xs rounded-lg mt-1.5 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Select Replacement File</label>
                <Input
                  type="file"
                  onChange={(e) => setNewVersionFile(e.target.files?.[0] || null)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-xs rounded-lg mt-1.5"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Change Note</label>
                <span className="text-[10px] text-zinc-500">What was updated?</span>
              </div>
              <Input
                placeholder="e.g. Revised checkout flow based on client review"
                value={newVersionNote}
                onChange={(e) => setNewVersionNote(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-xs rounded-lg mt-1.5"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsNewVersionModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingVersion}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-5 rounded-xl cursor-pointer"
              >
                {isSubmittingVersion ? "Publishing..." : `Publish v${(activeFileForVersion?.version || 1) + 1}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 3. VERSION HISTORY MODAL */}
      {/* ======================================================== */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#121318] border-zinc-800 text-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <History className="size-4 text-indigo-400" />
              Version History: {activeFileForHistory?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Audit trail of every iteration and deliverable update.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 box">
            {(!activeFileForHistory?.fileVersions || activeFileForHistory.fileVersions.length === 0) ? (
              <div className="text-center py-6 text-xs text-zinc-500">
                Single version (v1) active. No past versions logged.
              </div>
            ) : (
              activeFileForHistory.fileVersions.map((v, idx) => (
                <div 
                  key={v.id || idx} 
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                        v{v.versionNumber}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                          Current Live
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-zinc-300 font-medium">
                      {v.changeNote || "Standard version update"}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span>By {v.uploadedBy?.name || "Team Member"}</span>
                      <span>•</span>
                      <span>{v.createdAt ? format(new Date(v.createdAt), "MMM d, yyyy h:mm a") : "Recent"}</span>
                    </div>
                  </div>

                  <a 
                    href={v.storageKey || activeFileForHistory?.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="h-7 text-[11px] border-zinc-700 hover:bg-zinc-800 gap-1">
                      <ExternalLink className="size-3" />
                      Open
                    </Button>
                  </a>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHistoryModalOpen(false)}
              className="text-xs border-zinc-800 text-zinc-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 4. DELETE ASSET MODAL */}
      {/* ======================================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-[#121318] border-zinc-800 text-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="size-4" />
              Delete Asset
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Are you sure you want to delete <span className="text-white font-semibold">{activeFileForDelete?.name}</span>? All file versions will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs px-5 rounded-xl cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
