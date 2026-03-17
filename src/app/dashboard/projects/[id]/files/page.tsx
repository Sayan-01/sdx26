"use client";

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

export default function FilesPage() {
  const [files, setFiles] = useState([
    { 
      id: 1, 
      name: "Homepage_Design_Final.png", 
      type: "image", 
      size: "4.2 MB", 
      version: 3, 
      status: "approved", 
      uploader: "Mike Ross", 
      at: "2h ago",
      milestone: "UI Design Phase",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    { 
      id: 2, 
      name: "Brand_Asset_Pack.zip", 
      type: "archive", 
      size: "128.5 MB", 
      version: 1, 
      status: "uploaded", 
      uploader: "Client", 
      at: "5h ago",
      milestone: "Discovery",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500"
    },
    { 
      id: 3, 
      name: "User_Flow_v2.pdf", 
      type: "pdf", 
      size: "1.2 MB", 
      version: 2, 
      status: "revision_requested", 
      uploader: "Sarah Connor", 
      at: "1d ago",
      milestone: "UX Strategy",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500"
    },
  ]);

  const getFileIcon = (type: string) => {
    switch(type) {
      case "image": return <ImageIcon className="h-4 w-4" />;
      case "archive": return <FileArchive className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      default: return <FileBox className="h-4 w-4" />;
    }
  };

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

      <div className="flex flex-col gap-2 min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 pt-3">
          <div className="relative flex-grow w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <Input 
               placeholder="Filter by name, milestone, or uploader..." 
               className="pl-9 h-9 bg-[#151518] border-dashboard-border focus-visible:ring-1 focus-visible:ring-zinc-700 w-full text-zinc-200 placeholder:text-zinc-500 text-sm rounded-lg"
            />
          </div>
          <Button variant="ghost" className="h-9 px-4 rounded-lg text-xs text-zinc-400 hover:text-white transition-all gap-2 font-medium">
             <Filter className="h-3.5 w-3.5" />
             Filter View
          </Button>
        </div>

        <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 border-0 rounded-b-xl border-t border-dashboard-border/60 mt-2">
          <div className="divide-y divide-zinc-800/60 overflow-y-auto flex-1 box">
             {files.map((file) => (
               <div 
                 key={file.id} 
                 className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-900/50 transition-colors group"
               >
                 <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashboard-border/50",
                      file.iconBg, file.iconColor
                    )}>
                       {getFileIcon(file.type)}
                    </div>
                    <div className="space-y-1 flex-grow">
                       <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{file.name}</h3>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/50 border border-dashboard-border/50 text-[10px] text-zinc-400 font-medium">
                            <History className="h-3 w-3" />
                            v{file.version}
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
                    <div className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                      file.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      file.status === "revision_requested" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {file.status.replace("_", " ")}
                    </div>
                    
                    <div className="flex items-center gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                          <Eye className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                          <Download className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg sm:flex">
                          <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </div>
                 </div>
               </div>
             ))}
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
        </Card>
      </div>
    </div>
  );
}
