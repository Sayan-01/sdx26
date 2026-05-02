'use client'
import React, { useState } from "react";
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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getFilesByProjectId } from "@server/projects";
import { formatDistanceToNow } from "date-fns";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";

export default function FilesClient({ projectId, rawFiles }: { projectId: string; rawFiles: any[] }) {

  const getFileIcon = (type: string | null) => {
    const t = (type || "").toLowerCase();
    if (t.includes("image") || t.includes("png") || t.includes("jpg")) return <ImageIcon className="h-4 w-4" />;
    if (t.includes("zip") || t.includes("rar") || t.includes("archive")) return <FileArchive className="h-4 w-4" />;
    if (t.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <FileBox className="h-4 w-4" />;
  };

  const getIconStyles = (type: string | null) => {
    const t = (type || "").toLowerCase();
    if (t.includes("image") || t.includes("png") || t.includes("jpg")) return { bg: "bg-blue-500/10", color: "text-blue-500" };
    if (t.includes("zip") || t.includes("rar") || t.includes("archive")) return { bg: "bg-amber-500/10", color: "text-amber-500" };
    if (t.includes("pdf")) return { bg: "bg-rose-500/10", color: "text-rose-500" };
    return { bg: "bg-indigo-500/10", color: "text-indigo-500" };
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const files = rawFiles.map(file => {
    const styles = getIconStyles(file.fileType);
    return {
      id: file.id,
      name: file.fileName,
      type: file.fileType || "unknown",
      size: formatSize(0), // No size in File model, could fetch from FileVersion if needed
      version: 1, // Fallback, could be length of fileVersions
      status: file.status.toLowerCase(),
      uploader: file.uploader.name || "Unknown",
      at: formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }),
      milestone: file.milestone?.title || "No milestone",
      iconBg: styles.bg,
      iconColor: styles.color
    };
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.milestone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.uploader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Project Files</h2>
          <p className="text-sm text-zinc-400">Manage deliverables, assets, and version history.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      <DashboardCard
        icon={
          <div className="relative grow w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <Input
              placeholder="Search team members..."
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
            />
          </div>
        }
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
          {files.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">No files uploaded yet.</div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashboard-border/50", file.iconBg, file.iconColor)}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{file.name}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/50 border border-dashboard-border/50 text-[10px] text-zinc-400 font-medium">
                        <History className="h-3 w-3" />v{file.version}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                      <span className="text-zinc-400">{file.size}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>{file.milestone}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>By {file.uploader}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>{file.at}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-14 md:pl-0">
                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      file.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : file.status === "revision_requested"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    )}
                  >
                    {file.status.replace("_", " ")}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg sm:flex"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 m-5 rounded-xl bg-[#19191b] border border-dashed border-dashboard-border flex flex-col items-center justify-center text-center space-y-4 hover:bg-zinc-900/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-[#151518] border border-dashboard-border flex items-center justify-center text-zinc-500">
            <Upload className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">Drop files to upload</h3>
            <p className="text-xs text-zinc-500">Drag and drop assets, PDFs, or design files here, or click to browse.</p>
          </div>
        </div>
      </DashboardCard>

    
    </div>
  );
}
