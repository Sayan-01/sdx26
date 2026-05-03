"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Upload, FileText, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { uploadPortalOnboardingItem } from "@server/onboarding";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PortalOnboardingClientProps {
  initialItems: any[];
  token: string;
}

export default function PortalOnboardingClient({ initialItems, token }: PortalOnboardingClientProps) {
  const [items, setItems] = useState(initialItems);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async () => {
    if (!selectedItem || !fileUrl.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await uploadPortalOnboardingItem(selectedItem.id, fileUrl);
      if (res.success && res.item) {
        setItems(items.map((i) => (i.id === selectedItem.id ? res.item : i)));
        setUploadDialogOpen(false);
        setFileUrl("");
        setSelectedItem(null);
        toast.success("Item uploaded successfully");
      } else {
        toast.error(res.error || "Failed to upload item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    approved: items.filter((i) => i.status === "APPROVED").length,
    pending: items.filter((i) => i.status === "PENDING").length,
    uploaded: items.filter((i) => i.status === "UPLOADED").length,
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading
          title="Onboarding & Resources"
          description="Please provide the following assets to begin your project journey."
        />
        <div className="flex gap-2 p-1 bg-[#151518] rounded-xl border border-dashboard-border shadow-md">
          <div className="px-4 py-2 text-center border-r border-dashboard-border">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Approved</p>
            <p className="text-lg font-bold text-emerald-500">{stats.approved}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pending</p>
            <p className="text-lg font-bold text-amber-500">{stats.pending}</p>
          </div>
        </div>
      </div>

      <DashboardCard
        title="Project Resources"
        icon={<FileText className="h-4 w-4 text-indigo-400" />}
        extra={
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#151518] px-3 py-1 rounded-full border border-dashboard-border">
            {items.length} Items Total
          </span>
        }
        className="h-full w-full"
      >
        <div className="divide-y divide-zinc-800/60 overflow-y-auto box">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex w-full hover:bg-zinc-900/50 transition-colors group px-6 min-h-[95px] items-center border-b border-dashboard-border last:border-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl border border-dashboard-border/50 flex items-center justify-center transition-all duration-300 shrink-0 shadow-inner",
                      item.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" : item.status === "UPLOADED" ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800/20 text-zinc-600",
                    )}
                  >
                    {item.status === "APPROVED" ? <CheckCircle2 className="h-5 w-5" /> : item.status === "UPLOADED" ? <Clock className="h-5 w-5" /> : <FileText className={`h-5 w-5 ${item.status === "REJECTED" ? "text-red-500" : "text-zinc-600"}`} />}
                  </div>
                  <div>
                    <h3 className={cn("font-semibold transition-colors text-sm sm:text-base", item.status === "APPROVED" ? "text-emerald-500" : "text-zinc-200 group-hover:text-white")}>
                      {item.label}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 font-medium leading-relaxed">
                      Item status: <span className="text-zinc-400 lowercase">{item.status}</span> 
                      {item.fileUrl && <span className="text-zinc-700 mx-1">•</span>} 
                      {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400/80 hover:text-indigo-300 transition-colors">view file</a>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-16 sm:pl-0">
                  <div className="flex items-center gap-4">
                    {item.status === "PENDING" || item.status === "REJECTED" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setUploadDialogOpen(true);
                        }}
                        className="h-9 px-5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-lg shadow-sm transition-all active:scale-95 text-[11px] uppercase tracking-wider"
                      >
                        <Upload className="h-3.5 w-3.5 mr-2" />
                        Update
                      </Button>
                    ) : (
                      <div
                        className={cn(
                          "w-24 h-7 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                          item.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                        )}
                      >
                        {item.status === "UPLOADED" ? "In Review" : "Approved"}
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
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
              <p className="text-[10px] text-zinc-500 italic">
                Note: In production, this would be a file upload. For now, please provide a URL.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="border-dashboard-border">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isSubmitting} className="bg-white text-zinc-950 hover:bg-zinc-200">
              {isSubmitting ? "Submitting..." : "Submit Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-8 rounded-2xl bg-[#19191b] border border-dashboard-border relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
          <Plus className="h-20 w-20 text-indigo-500 rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-bold text-white tracking-tight">Need to provide something else?</h3>
            <p className="text-zinc-500 text-sm font-medium">Add additional resources or notes for the project team.</p>
          </div>
          <Button
            variant="outline"
            className="h-11 px-6 border-dashboard-border bg-[#151518] hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold rounded-xl transition-all"
          >
            Add Extra Resource
          </Button>
        </div>
      </div>
    </div>
  );
}
