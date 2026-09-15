"use client";

import React, { useState } from "react";
import { 
  FileBox, 
  Search, 
  Filter, 
  History, 
  Eye, 
  Download,
  Image as ImageIcon,
  FileArchive,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";

export default function PortalFilesClient({ token, rawFiles }: { token: string; rawFiles: any[] }) {

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
      size: formatSize(0), // Size typically fetched from FileVersion
      version: 1, 
      status: file.status.toLowerCase(),
      uploader: file.uploader?.name || "Unknown",
      at: formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }),
      milestone: file.milestone?.title || "No milestone",
      fileUrl: file.fileUrl,
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
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 h-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeading 
          title="Project Deliverables" 
          description="Review and download the latest assets shared by your project team." 
        />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
             <Input 
               placeholder="Search assets..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="h-10 pl-9 bg-[#151518] border-dashboard-border rounded-xl focus-visible:ring-indigo-500/20 text-xs"
             />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-dashboard-border bg-[#151518] text-zinc-500">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DashboardCard
        title="Files & Assets"
        icon={<FileBox className="h-4 w-4 text-indigo-400" />}
        extra={
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#151518] px-3 py-1 rounded-full border border-dashboard-border">
            {files.length} Resources
          </span>
        }
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto box min-h-[300px]">
          {files.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center justify-center h-full min-h-[300px]">
              <FileBox className="h-10 w-10 text-zinc-700 mb-4 opacity-50" />
              <p>No files have been uploaded yet.</p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashboard-border/50 transition-transform group-hover:scale-105", file.iconBg, file.iconColor)}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{file.name}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/50 border border-dashboard-border/50 text-[10px] text-zinc-400 font-medium">
                        <History className="h-3 w-3" />v{file.version}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 font-medium tracking-wide">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px]">{file.size}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>{file.milestone}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>By {file.uploader}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>{file.at}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-16 md:pl-0">
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
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
                    {file.fileUrl && (
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    {file.fileUrl && (
                      <a href={file.fileUrl} download>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
