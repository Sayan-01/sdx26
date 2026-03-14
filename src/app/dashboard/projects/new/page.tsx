"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Mail, 
  Plus, 
  BadgeCheck,
  Zap,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCreated(true);
    }, 1500);
  };

  if (isCreated) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Project Created!</h1>
          <p className="text-zinc-500 text-lg">
            We've set up the workspace and sent a Magic Link to the client's email.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 w-full flex items-center justify-between gap-4">
           <div className="text-left">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Magic Link</p>
              <p className="text-sm font-mono text-zinc-300 truncate max-w-xs">https://milestack.com/portal/tk_92hfs8skf...</p>
           </div>
           <Button variant="outline" className="h-9 border-zinc-800 text-xs">Copy Link</Button>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/projects/1">
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 h-12 px-8 font-bold rounded-xl">
              Go to Project Dashboard
            </Button>
          </Link>
          <Button variant="ghost" className="h-12 px-8 text-zinc-500 hover:text-white" onClick={() => setIsCreated(false)}>
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <Link href="/dashboard/projects" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-zinc-500 text-lg">Set up a workspace and invite your client to collaborate.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                 <h2 className="text-lg font-bold flex items-center gap-2">
                   <Briefcase className="h-4 w-4 text-zinc-500" />
                   Project Basics
                 </h2>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Project Name</label>
                    <Input 
                      placeholder="e.g. Website Overhaul 2026" 
                      className="h-12 bg-zinc-950 border-zinc-800 focus:ring-zinc-700"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Project Type (optional)</label>
                    <Input 
                      placeholder="e.g. Web Design" 
                      className="h-12 bg-zinc-950 border-zinc-800 focus:ring-zinc-700"
                    />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                 <h2 className="text-lg font-bold flex items-center gap-2">
                   <User className="h-4 w-4 text-zinc-500" />
                   Client Details
                 </h2>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Client Name</label>
                    <Input 
                      placeholder="e.g. Acme Corp" 
                      className="h-12 bg-zinc-950 border-zinc-800 focus:ring-zinc-700"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Client Email</label>
                    <Input 
                      type="email"
                      placeholder="client@example.com" 
                      className="h-12 bg-zinc-950 border-zinc-800 focus:ring-zinc-700"
                      required
                    />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-zinc-900/50 border-zinc-800 shadow-none border-dashed p-6">
              <div className="space-y-6">
                 <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-500">Automated Actions</h3>
                 
                 <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                       <Zap className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-bold">Magic Link Invite</p>
                       <p className="text-xs text-zinc-500 leading-relaxed">System will send a secure entry link to the client. No signup required for them.</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                       <BadgeCheck className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-bold">Onboarding Ready</p>
                       <p className="text-xs text-zinc-500 leading-relaxed">Default checklist (Logo, Brand Assets, etc.) will be active immediately.</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-14 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-lg rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Initiate Project"}
              </Button>
              <p className="text-center text-xs text-zinc-600 mt-4">
                You can add team members and milestones in the next step.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
}
