import React from 'react';
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { 
  CheckSquare, 
  Milestone as MilestoneIcon, 
  TrendingUp,
  Layout,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function PortalDashboardPage({
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
            onboardingItem: {
                take: 5
            },
            activityLogs: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!project) {
        redirect(`/portal/${token}`);
    }

    // Stats calculation
    const completedMilestones = project.milestones.filter(m => m.status === 'APPROVED' || m.status === 'PAID').length;
    const totalMilestones = project.milestones.length;
    const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    const pendingOnboarding = project.onboardingItem.filter(i => i.status === 'PENDING').length;
    const nextMilestone = project.milestones.find(m => m.status === 'PENDING' || m.status === 'IN_PROGRESS');

    return (
        <div className="space-y-10">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Overall Progress" 
                    value={`${Math.round(progress)}%`} 
                    icon={<TrendingUp className="h-5 w-5 text-indigo-400" />}
                    desc={`${completedMilestones}/${totalMilestones} Milestones`}
                />
                <StatCard 
                    title="Next Milestone" 
                    value={nextMilestone?.title || "Completed"} 
                    icon={<MilestoneIcon className="h-5 w-5 text-emerald-400" />}
                    desc={nextMilestone?.dueDate ? format(new Date(nextMilestone.dueDate), 'MMM d') : "No deadline"}
                />
                 <StatCard 
                    title="Requirements" 
                    value={pendingOnboarding.toString()} 
                    icon={<CheckSquare className="h-5 w-5 text-amber-400" />}
                    desc="Awaiting upload"
                />
                 <StatCard 
                    title="Status" 
                    value={project.status} 
                    icon={<Layout className="h-5 w-5 text-sky-400" />}
                    desc="Active project"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Milestones & Onboarding */}
                <div className="lg:col-span-2 space-y-10">
                    <Section 
                        title="Recent Milestones" 
                        actionText="View Roadmap" 
                        actionHref={`/portal/${token}/milestones`}
                    >
                        <div className="space-y-4">
                            {project.milestones.length > 0 ? project.milestones.slice(0, 5).map((m) => (
                                <div key={m.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#151518] border border-dashboard-border group hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            m.status === 'APPROVED' || m.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-400"
                                        )}>
                                            <MilestoneIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[13px]">{m.title}</p>
                                            <p className="text-[11px] text-zinc-500 font-medium">{m.status.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[13px] text-zinc-200">${m.amount}</p>
                                        <p className="text-[11px] text-zinc-600">{m.dueDate ? format(new Date(m.dueDate), 'MMM d') : "-"}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 rounded-2xl bg-[#151518] border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                                    No milestones created yet.
                                </div>
                            )}
                        </div>
                    </Section>

                    <Section 
                        title="Onboarding Checklist" 
                        actionText="Upload Documents" 
                        actionHref={`/portal/${token}/onboarding`}
                    >
                         <div className="space-y-4">
                            {project.onboardingItem.length > 0 ? project.onboardingItem.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#151518] border border-dashboard-border group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border flex items-center justify-center transition-colors",
                                            item.status === 'APPROVED' ? "bg-emerald-500 border-emerald-500" : "border-zinc-700 bg-transparent"
                                        )}>
                                            {item.status === 'APPROVED' && <CheckSquare className="h-3 w-3 text-white" />}
                                        </div>
                                        <p className="text-[13px] font-bold">{item.label}</p>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                        item.status === 'PENDING' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                    )}>
                                        {item.status}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 rounded-2xl bg-[#151518] border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                                    No onboarding tasks assigned.
                                </div>
                            )}
                        </div>
                    </Section>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="space-y-8">
                     <Section title="Recent Activity">
                        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                            {project.activityLogs.length > 0 ? project.activityLogs.map((log) => (
                                <div key={log.id} className="relative">
                                    <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0f0f0f] bg-zinc-700" />
                                    <p className="text-[12px] font-bold leading-tight text-zinc-200">
                                        {formatActivityAction(log.action)}
                                    </p>
                                    <p className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">
                                        {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-zinc-600 text-[11px] italic">No recent activity.</p>
                            )}
                        </div>
                    </Section>

                    {/* Support Card */}
                    <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <MessageSquare className="h-20 w-20 text-indigo-500" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Need help?</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-6">Our team is available to assist you with any questions about the project.</p>
                        <button className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">
                            Message Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, desc }: { title: string, value: string, icon: React.ReactNode, desc: string }) {
    return (
        <div className="p-6 rounded-3xl bg-[#151518] border border-dashboard-border hover:border-zinc-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
                <div className="p-2 rounded-xl bg-zinc-900 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold tracking-tight mb-1 truncate">{value}</p>
            <p className="text-[11px] text-zinc-600 font-medium truncate">{desc}</p>
        </div>
    );
}

function Section({ title, children, actionText, actionHref }: { title: string, children: React.ReactNode, actionText?: string, actionHref?: string }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 font-mono">{title}</h3>
                {actionText && (
                    <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                        {actionText} →
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

function formatActivityAction(action: string) {
    return action.replace('client.', '').replace(/_/g, ' ');
}
