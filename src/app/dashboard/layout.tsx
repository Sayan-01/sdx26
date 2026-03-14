"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  Bell, 
  Layers,
  Search,
  Plus,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard", href: "/dashboard" },
    { icon: <Briefcase className="h-4 w-4" />, label: "Projects", href: "/dashboard/projects" },
    { icon: <Users className="h-4 w-4" />, label: "Team", href: "/dashboard/team" },
    { icon: <Bell className="h-4 w-4" />, label: "Activity", href: "/dashboard/activity" },
    { icon: <Settings className="h-4 w-4" />, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden selection_color">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/50 flex flex-col bg-zinc-950">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Milestack</span>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-zinc-900 text-white" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4">
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
             <p className="text-xs text-zinc-500 mb-3">CURRENT AGENCY</p>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs">PP</div>
                <div className="overflow-hidden">
                   <p className="text-sm font-medium truncate">Pixel Perfect</p>
                   <p className="text-[10px] text-zinc-500">Pro Plan</p>
                </div>
             </div>
          </div>
          
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-sm">
           <div className="flex items-center gap-4 grow max-w-xl">
             <div className="relative w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
               <Input 
                 placeholder="Search projects, files..." 
                 className="pl-10 h-10 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700 w-full rounded-full"
               />
             </div>
           </div>

           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950" />
             </Button>
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" title="John Doe" />
           </div>
        </header>

        {/* Content Area */}
        <div className="h-full overflow-auto p-8 box-1">
          {children}
        </div>
      </main>
    </div>
  );
}
