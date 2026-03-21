"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Milestone, 
  FileBox, 
  Wallet, 
  Layers, 
  CheckSquare, 
  MessageSquare,
  LogOut,
  Settings,
  ChevronRight,
  ShieldCheck,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const pathname = usePathname();
  const { token } = React.use(params);

  const tabs = [
    { label: "Onboarding", icon: <CheckSquare className="h-4 w-4" />, href: `/portal/${token}/onboarding` },
    { label: "Milestones", icon: <Milestone className="h-4 w-4" />, href: `/portal/${token}/milestones` },
    { label: "Files", icon: <FileBox className="h-4 w-4" />, href: `/portal/${token}/files` },
    { label: "Payments", icon: <Wallet className="h-4 w-4" />, href: `/portal/${token}/payments` },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white selection_color font-sans">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] border-r border-dashboard-border bg-[#151518] flex flex-col z-50">
        <div className="flex flex-col h-full relative">
          {/* Logo Area */}
          <div className="px-8 py-10">
            <div className="flex items-center gap-3.5 group cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">Milestack</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto box">
            <div className="px-4 pb-3">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Workspace</p>
            </div>
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link 
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all group",
                    isActive 
                      ? "bg-[#1e1e21] text-white border border-dashboard-border shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/3"
                  )}
                >
                  <span className={cn(
                    "transition-colors duration-300 shrink-0",
                    isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
                  )}>
                    {tab.icon}
                  </span>
                  <span className="flex-1">{tab.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Side Area */}
          <div className="p-4 mt-auto">
            <div className="p-6 rounded-2xl bg-[#19191b] border border-dashboard-border group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Support Contact</p>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-dashboard-border flex items-center justify-center text-xs font-bold">JD</div>
                <div>
                  <p className="text-xs font-bold text-white">John Doe</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Project Manager</p>
                </div>
              </div>
              <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] uppercase tracking-widest font-bold h-9 rounded-xl transition-all shadow-lg shadow-indigo-500/10">
                Open Chat
              </Button>
            </div>
            
            <div className="flex items-center justify-between px-6 py-6 mt-2">
              <button className="text-zinc-600 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                <Settings className="h-4 w-4" />
              </button>
              <button className="text-zinc-600 hover:text-rose-500 transition-colors p-2 hover:bg-white/5 rounded-lg">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow pl-[280px]">
        {/* Top Navbar */}
        <header className="h-20 px-10 bg-[#0f0f0f]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between border-b border-dashboard-border">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight">Acme Web Redesign</h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Portal Access • <span className="text-zinc-300">Acme Corp</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#19191b] border border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all relative">
              <Bell className="h-4 w-4" />
              <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 border-2 border-[#151518]" />
            </button>
            <div className="h-8 w-px bg-dashboard-border" />
            <Button variant="outline" className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800 gap-2 h-10 px-5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              Help Center
            </Button>
          </div>
        </header>

        {/* Page Content Backdrop with gradient */}
        <div className="p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

