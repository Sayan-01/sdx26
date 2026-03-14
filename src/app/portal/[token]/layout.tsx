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
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const pathname = usePathname();
  const token = params.token;

  const tabs = [
    { label: "Onboarding", icon: <CheckSquare className="h-4 w-4" />, href: `/portal/${token}/onboarding` },
    { label: "Milestones", icon: <Milestone className="h-4 w-4" />, href: `/portal/${token}/milestones` },
    { label: "Files", icon: <FileBox className="h-4 w-4" />, href: `/portal/${token}/files` },
    { label: "Payments", icon: <Wallet className="h-4 w-4" />, href: `/portal/${token}/payments` },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white selection_color">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800/50 bg-zinc-950 flex flex-col z-50">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-12">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950">
                 <Layers className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Milestack</span>
           </div>

           <div className="space-y-1">
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-4">Project Portal</p>
             {tabs.map((tab) => (
               <Link 
                 key={tab.href}
                 href={tab.href}
                 className={cn(
                   "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                   pathname === tab.href 
                     ? "bg-zinc-900 text-white shadow-lg shadow-black/20" 
                     : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                 )}
               >
                 <span className={cn(
                   "transition-colors",
                   pathname === tab.href ? "text-emerald-500" : "text-zinc-600 group-hover:text-zinc-400"
                 )}>
                   {tab.icon}
                 </span>
                 {tab.label}
               </Link>
             ))}
           </div>
        </div>

        <div className="mt-auto p-6 space-y-6">
           <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/30 border border-zinc-800/50">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Agency Contact</p>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">JD</div>
                 <div>
                    <p className="text-xs font-bold">John Doe</p>
                    <p className="text-[10px] text-zinc-500">Project Manager</p>
                 </div>
              </div>
              <Button size="sm" variant="ghost" className="w-full mt-4 text-[10px] bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest font-bold h-8">Contact Support</Button>
           </div>
           
           <div className="flex items-center justify-between px-2">
              <button className="text-zinc-600 hover:text-white transition-colors">
                 <Settings className="h-4 w-4" />
              </button>
              <button className="text-zinc-600 hover:text-rose-500 transition-colors">
                 <LogOut className="h-4 w-4" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow pl-64">
        {/* Top Navbar */}
        <header className="h-20 border-b border-zinc-800/50 flex items-center justify-between px-10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
           <div>
              <h2 className="text-lg font-bold">Acme Web Redesign</h2>
              <p className="text-xs text-zinc-500">Viewing as <span className="text-zinc-300 font-medium">Acme Corp</span></p>
           </div>

           <div className="flex items-center gap-4">
              <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 gap-2 h-10 px-5 text-sm font-medium">
                 <MessageSquare className="h-4 w-4" />
                 Open Chat
              </Button>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-10 max-w-6xl">
           {children}
        </div>
      </main>
    </div>
  );
}
