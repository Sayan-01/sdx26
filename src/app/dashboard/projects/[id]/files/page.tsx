"use client";

import React, { useState } from "react";
import { 
  FileBox, 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  History, 
  Eye, 
  Download,
  Trash2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FilesPage() {
  const [files, setFiles] = useState([
    { 
      id: 1, 
      name: "Homepage_Design_Final.png", 
      type: "image/png", 
      size: "4.2 MB", 
      version: 3, 
      status: "approved", 
      uploader: "Mike Ross", 
      at: "2h ago",
      milestone: "UI Design Phase"
    },
    { 
      id: 2, 
      name: "Brand_Asset_Pack.zip", 
      type: "application/zip", 
      size: "128.5 MB", 
      version: 1, 
      status: "uploaded", 
      uploader: "Client", 
      at: "5h ago",
      milestone: "Discovery"
    },
    { 
      id: 3, 
      name: "User_Flow_v2.pdf", 
      type: "application/pdf", 
      size: "1.2 MB", 
      version: 2, 
      status: "revision_requested", 
      uploader: "Sarah Connor", 
      at: "1d ago",
      milestone: "UX Strategy"
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Files</h2>
          <p className="text-zinc-500">Manage deliverables, assets, and version history.</p>
        </div>
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
         <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
               placeholder="Filter by name, milestone, or uploader..." 
               className="pl-10 h-10 bg-transparent border-none focus:ring-0 w-full"
            />
         </div>
         <div className="flex items-center gap-2 pr-2">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2">
               <Filter className="h-4 w-4" />
               Filter
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {files.map((file) => (
           <Card key={file.id} className="bg-zinc-900 border-zinc-800 shadow-none hover:bg-zinc-800/40 transition-colors group">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                      <FileBox className="h-6 w-6" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <h3 className="font-medium">{file.name}</h3>
                         <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                           <History className="h-3 w-3" />
                           v{file.version}
                         </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                         <span>{file.size}</span>
                         <span className="w-1 h-1 rounded-full bg-zinc-800" />
                         <span>{file.milestone}</span>
                         <span className="w-1 h-1 rounded-full bg-zinc-800" />
                         <span>Uploaded by {file.uploader}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className={cn(
                     "hidden sm:flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                     file.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                     file.status === "revision_requested" ? "bg-rose-500/10 text-rose-500" :
                     "bg-zinc-800 text-zinc-500"
                   )}>
                     {file.status.replace("_", " ")}
                   </div>
                   
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white">
                         <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white">
                         <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-rose-500">
                         <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white">
                         <MoreHorizontal className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
             </div>
           </Card>
         ))}
      </div>

      <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center space-y-4">
         <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Upload className="h-6 w-6" />
         </div>
         <div className="space-y-1">
            <p className="font-medium">Drop files to upload</p>
            <p className="text-sm text-zinc-500">or click to browse from your computer</p>
         </div>
      </div>
    </div>
  );
}
