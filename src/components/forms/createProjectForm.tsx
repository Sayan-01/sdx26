"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Plus, 
  BadgeCheck,
  Zap,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createProject } from "@/lib/queries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  projectDescription: z.string().optional(),
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email("Invalid client email address"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProjectForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [createdData, setCreatedData] = useState<{ projectId: string; magicToken: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const result = await createProject(data);
      if (result.success && result.projectId && result.magicToken) {
        setCreatedData({ 
          projectId: result.projectId, 
          magicToken: result.magicToken 
        });
        toast.success("Project created successfully!");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMagicLink = () => {
    if (!createdData) return;
    const link = `${window.location.origin}/portal/${createdData.magicToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Magic link copied to clipboard");
  };

  if (createdData) {
    const magicLink = `${window.location.origin}/portal/${createdData.magicToken}`;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-2xl mx-auto text-center space-y-10 animate-in zoom-in duration-500 pb-20">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#151518] rounded-full p-1 border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-500/20" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Project Initialized</h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            The creative workspace is ready. You can now invite your client using the magic link below.
          </p>
        </div>

        <Card className="bg-[#19191b] border-dashboard-border shadow-2xl shadow-black/40 w-full overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 text-left border-b border-dashboard-border bg-[#1c1c1e]">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Client Access Portal</p>
                 </div>
                 <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                    Ready
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-[#151518] p-4 rounded-xl border border-dashboard-border group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-zinc-300 truncate tracking-tight">{magicLink}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-zinc-800 shrink-0"
                    onClick={copyMagicLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
               </div>
            </div>
            <div className="p-4 bg-zinc-900/40 flex items-center justify-center">
              <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-2">
                <Info className="h-3 w-3" />
                Valid for 7 days. Can be regenerated in project settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href={`/dashboard/projects/${createdData.projectId}`} className="flex-1 max-w-[280px]">
            <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 h-14 px-8 font-bold rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5">
              Enter Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex-1 max-w-[280px] h-14 px-8 border-dashboard-border bg-[#19191b] text-zinc-400 hover:text-white rounded-2xl" 
            onClick={() => setCreatedData(null)}
          >
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col gap-5">
        <Link 
          href="/dashboard/projects" 
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2 w-fit group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Cancel & Return
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Initialize Project</h1>
          <p className="text-zinc-500 text-lg">Set up a high-performance creative workspace for your client.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <Card className="bg-[#19191b] border-dashboard-border shadow-2xl shadow-black/20 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#151518] border border-dashboard-border flex items-center justify-center text-zinc-500">
                     <Briefcase className="h-5 w-5" />
                   </div>
                   <h2 className="text-xl font-bold">Project Details</h2>
                 </div>
                 
                 <div className="space-y-5">
                   <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Project Name</label>
                      <Input 
                        {...register("projectName")}
                        placeholder="e.g. Q1 Brand Identity" 
                        className={cn(
                          "h-14 bg-[#151518] border-dashboard-border focus-visible:ring-indigo-500/50 rounded-xl text-zinc-200",
                          errors.projectName && "border-rose-500/50 focus-visible:ring-rose-500/20"
                        )}
                      />
                      {errors.projectName && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.projectName.message}</p>}
                   </div>
                   
                   <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Focus Area & Description</label>
                      <Input 
                        {...register("projectDescription")}
                        placeholder="e.g. Strategy, UI/UX and Asset Delivery" 
                        className="h-14 bg-[#151518] border-dashboard-border focus-visible:ring-indigo-500/50 rounded-xl text-zinc-200"
                      />
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#19191b] border-dashboard-border shadow-2xl shadow-black/20 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#151518] border border-dashboard-border flex items-center justify-center text-zinc-500">
                     <User className="h-5 w-5" />
                   </div>
                   <h2 className="text-xl font-bold">Client Identity</h2>
                 </div>
                 
                 <div className="space-y-5">
                   <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Contact Name</label>
                      <Input 
                        {...register("clientName")}
                        placeholder="e.g. Sarah J. Parker" 
                        className={cn(
                          "h-14 bg-[#151518] border-dashboard-border focus-visible:ring-blue-500/50 rounded-xl text-zinc-200",
                          errors.clientName && "border-rose-500/50 focus-visible:ring-rose-500/20"
                        )}
                      />
                      {errors.clientName && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.clientName.message}</p>}
                   </div>
                   
                   <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email for Magic Link</label>
                      <Input 
                        {...register("clientEmail")}
                        type="email"
                        placeholder="client@agency.com" 
                        className={cn(
                          "h-14 bg-[#151518] border-dashboard-border focus-visible:ring-blue-500/50 rounded-xl text-zinc-200",
                          errors.clientEmail && "border-rose-500/50 focus-visible:ring-rose-500/20"
                        )}
                      />
                      {errors.clientEmail && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider mt-1 ml-1">{errors.clientEmail.message}</p>}
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-[#19191b] border-dashboard-border shadow-xl border-dashed">
              <CardContent className="p-8 space-y-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Workspace Automation</h3>
                 
                 <div className="space-y-8">
                   <div className="flex gap-4 group/item">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover/item:scale-110 transition-transform duration-300">
                         <Zap className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                         <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                           Magic Link Invite
                         </p>
                         <p className="text-xs text-zinc-500 leading-relaxed font-medium">System will instantly generate and send a secure access link to the client.</p>
                      </div>
                   </div>

                   <div className="flex gap-4 group/item">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover/item:scale-110 transition-transform duration-300">
                         <BadgeCheck className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                         <p className="text-sm font-bold text-zinc-200">Delivery Pipeline</p>
                         <p className="text-xs text-zinc-500 leading-relaxed font-medium">Standard onboarding stages and file structure will be provisioned automatically.</p>
                      </div>
                   </div>
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-16 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5 group relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Deploying...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span>Initialize Workspace</span>
                  </div>
                )}
              </Button>
              <div className="p-5 rounded-2xl bg-[#151518] border border-dashboard-border flex items-start gap-4">
                 <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                   Wait times are typically under 2 seconds for initial provisioning of the database and secure link generation.
                 </p>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}

