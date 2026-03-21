import React from "react";
import { CheckCircle2, Clock, DollarSign, Calendar, Milestone as MilestoneIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { format } from "date-fns";

export default async function ClientMilestonesPage({
    params
}: {
    params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getClientSession();

  if (!session) {
    redirect(`/portal/${token}`);
  }

  const project = await prisma.project.findFirst({
    where: {
      id: session.projectId,
      agencyId: session.agencyId,
      clientId: session.clientId,
    },
    include: {
      milestones: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!project) {
    redirect(`/portal/${token}`);
  }

  const milestones = project.milestones;
  const paidAmount = milestones.filter(m => m.status === "PAID").reduce((acc, m) => acc + (m.amount || 0), 0);
  const completedCount = milestones.filter(m => m.status === "APPROVED" || m.status === "PAID").length;
  const percentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const stats = [
    { label: "Completion", value: `${percentage}%`, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Received", value: `$${paidAmount.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Phases", value: milestones.length.toString(), icon: <MilestoneIcon className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Current Step", value: `${completedCount + 1}`, icon: <Calendar className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Project Roadmap</h1>
        <p className="text-zinc-500 text-sm max-w-2xl">
          Track the progress of your project phases, review milestones, and manage pending payments.
        </p>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-none bg-[#151518] hover:bg-[#19191c] transition-colors border-dashboard-border group overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</CardTitle>
              <div className={cn("p-2.5 rounded-xl transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Development Phases</h2>
            <span className="text-[10px] font-bold text-zinc-500 bg-[#151518] px-3 py-1.5 rounded-full border border-dashboard-border uppercase">
                Step {completedCount} of {milestones.length}
            </span>
        </div>

        <div className="border border-dashboard-border rounded-2xl bg-[#151518] overflow-hidden">
            <div className="divide-y divide-zinc-800/50">
                {milestones.length > 0 ? milestones.map((m, i) => (
                    <div key={m.id} className={cn(
                        "flex items-center justify-between p-6 hover:bg-[#1a1a1d] transition-all group",
                        (m.status === 'PENDING' && i > completedCount) && "opacity-40 grayscale-[0.5]"
                    )}>
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                m.status === 'PAID' || m.status === 'APPROVED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                i === completedCount ? "bg-indigo-500 border-indigo-400 text-white animate-pulse" :
                                "bg-zinc-900 border-zinc-800 text-zinc-600"
                            )}>
                                {m.status === 'PAID' || m.status === 'APPROVED' ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-bold">{i + 1}</span>}
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors">{m.title}</h3>
                                <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {m.dueDate ? format(new Date(m.dueDate), 'MMM dd, yyyy') : "TBD"}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="flex items-center gap-1.5 text-zinc-400">${m.amount?.toLocaleString() || '0'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                m.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                m.status === 'IN_REVIEW' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                "bg-zinc-800 text-zinc-500 border-zinc-700"
                            )}>
                                {m.status.replace('_', ' ')}
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-800 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center space-y-4">
                        <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-700">
                            <MilestoneIcon className="h-8 w-8" />
                        </div>
                        <p className="text-zinc-500 text-xs font-medium">No milestones defined for this project yet.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
