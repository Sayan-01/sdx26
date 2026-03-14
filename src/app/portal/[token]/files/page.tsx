"use client";

import React, { useState } from "react";
import { 
  FileBox, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Download, 
  Eye,
  History,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ClientFilesPage() {
  const [files, setFiles] = useState([
    { 
      id: 1, 
      name: "Homepage_Design_Final.png", 
      type: "image/png", 
      size: "4.2 MB", 
      version: 3, 
      status: "approved", 
      at: "2h ago",
      milestone: "UI Design Phase"
    },
    { 
      id: 2, 
      name: "User_Flow_v2.pdf", 
      type: "application/pdf", 
      size: "1.2 MB", 
      version: 2, 
      status: "under_review", 
      at: "1d ago",
      milestone: "UX Strategy"
    },
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="max-w-2xl space-y-3">
         <h1 className="text-3xl font-bold">Deliverables</h1>
         <p className="text-zinc-500 text-lg leading-relaxed">
            Review and download files shared by the agency. Track versions and provide feedback directly on deliverables.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {files.map((file) => (
          <Card key={file.id} className={cn(
            "bg-zinc-900 border-zinc-800 shadow-none hover:border-zinc-700 transition-all group overflow-hidden",
            file.status === "under_review" && "border-blue-500/30 ring-1 ring-blue-500/10"
          )}>
            <div className="aspect-video bg-zinc-950 border-b border-zinc-800 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
               <FileBox className="h-16 w-16 text-zinc-900 group-hover:scale-110 transition-transform duration-500" />
               
               <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900/80 backdrop-blur rounded-lg border border-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                     <History className="h-3 w-3 text-zinc-500" />
                     Version {file.version}
                  </div>
               </div>

               <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button variant="outline" className="h-10 border-zinc-700 bg-zinc-900/80 backdrop-blur hover:bg-zinc-800 text-sm font-medium">
                     <Eye className="h-4 w-4 mr-2" />
                     Preview
                  </Button>
               </div>
            </div>
            
            <div className="p-6 space-y-6">
               <div className="space-y-1">
                  <h3 className="text-lg font-bold group-hover:text-white transition-colors truncate">{file.name}</h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-2">
                     {file.size} <span className="text-zinc-800">•</span> {file.milestone}
                  </p>
               </div>

               <div className="flex items-center justify-between">
                  <div className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                    file.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  )}>
                    {file.status.replace("_", " ")}
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white">
                        <Download className="h-5 w-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white">
                        <MessageSquare className="h-5 w-5" />
                     </Button>
                  </div>
               </div>

               {file.status === "under_review" && (
                 <div className="pt-4 border-t border-zinc-800 flex gap-2">
                    <Button className="flex-grow bg-white text-zinc-950 hover:bg-zinc-200 font-bold h-11 rounded-xl">
                       Approve Version {file.version}
                    </Button>
                    <Button variant="ghost" className="text-zinc-500 hover:text-zinc-300 font-bold h-11 px-4">
                       Revise
                    </Button>
                 </div>
               )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
