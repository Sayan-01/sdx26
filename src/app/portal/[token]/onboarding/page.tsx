"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Upload, 
  AlertCircle,
  FileText,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ClientOnboardingPage() {
  const [items, setItems] = useState([
    { id: 1, label: "Agency Logo", status: "approved", help: "High-resolution SVG or PNG favored.", file: "logo_v1.svg" },
    { id: 2, label: "Brand Guidelines", status: "uploaded", help: "PDF or link to Figma/Canva design book.", file: "brand_book.pdf" },
    { id: 3, label: "Hosting Access", status: "pending", help: "Provide credentials or invite to account.", file: null },
    { id: 4, label: "Domain Access", status: "pending", help: "Access to GoDaddy, Namecheap, etc.", file: null },
    { id: 5, label: "Website Content", status: "pending", help: "Copy/Text for main pages.", file: null },
    { id: 6, label: "Images & Assets", status: "approved", help: "Photos, icons, illustrations.", file: "assets_zip.zip" },
  ]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="max-w-2xl">
         <h1 className="text-3xl font-bold">Welcome aboard, Acme Corp.</h1>
         <p className="text-zinc-500 mt-3 text-lg leading-relaxed">
            To get started with your project, we need a few things from your side. 
            Upload them here and our team will review them within 24 hours.
         </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
              item.status === "approved" ? "bg-emerald-500/5 border-emerald-500/10" : 
              item.status === "uploaded" ? "bg-zinc-900 border-zinc-800" : 
              "bg-zinc-900/50 border-zinc-800 border-dashed"
            )}
          >
            <div className="flex items-start gap-5">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                item.status === "approved" ? "bg-emerald-500/20 text-emerald-500" : 
                item.status === "uploaded" ? "bg-blue-500/10 text-blue-500" : 
                "bg-zinc-800 text-zinc-600"
              )}>
                {item.status === "approved" ? <CheckCircle2 className="h-5 w-5" /> : 
                 item.status === "uploaded" ? <Clock className="h-5 w-5" /> : 
                 <FileText className="h-5 w-5" />}
              </div>
              <div>
                <h3 className={cn(
                  "text-lg font-bold",
                  item.status === "approved" ? "text-emerald-500" : "text-white"
                )}>
                  {item.label}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{item.help}</p>
                {item.file && (
                   <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-400">
                      <Upload className="h-3 w-3" />
                      {item.file}
                   </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
               {item.status === "pending" ? (
                 <Button className="w-full md:w-auto bg-white text-zinc-950 hover:bg-zinc-200 gap-2 font-bold px-6 h-11 rounded-xl">
                   <Upload className="h-4 w-4" />
                   Upload File
                 </Button>
               ) : item.status === "uploaded" ? (
                 <div className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                    Awaiting Review
                 </div>
               ) : (
                 <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                    Approved
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Ready to proceed?</h3>
            <p className="text-zinc-400 text-sm">Once you've uploaded all items, we'll schedule our kickoff call.</p>
         </div>
         <Button variant="outline" className="h-12 px-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 rounded-2xl font-bold">
            Notify Agency
         </Button>
      </div>
    </div>
  );
}
