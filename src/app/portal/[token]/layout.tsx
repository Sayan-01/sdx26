import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import { PortalNav } from "@/components/portal/portal-nav";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getClientSession();
  
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "";
  const entryPath = `/portal/${token}`;

  // If session exists and we are at the entry page (exactly /[token]), 
  // redirect specifically to dashboard.
  if (session && (currentPath === entryPath || currentPath === `${entryPath}/`)) {
    redirect(`${entryPath}/dashboard`);
  }

  // If no session and we are NOT on the entry page, MUST redirect back to entry.
  if (!session && currentPath !== entryPath && currentPath !== `${entryPath}/`) {
    redirect(entryPath);
  }

  // If no session and it is the entry page, just render without the nav/sidebar
  if (!session) {
    return <>{children}</>;
  }

  // Session exists, fetch current project details
  const project = await prisma.project.findFirst({
    where: {
      id: session.projectId,
      agencyId: session.agencyId,
      clientId: session.clientId,
    },
    include: {
      client: true,
    }
  });

  if (!project) {
    redirect(entryPath);
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-zinc-100 selection_color font-sans">
      <PortalNav token={token} />

      {/* Main Content Area */}
      <main className="flex-grow pl-[280px]">
        {/* Unified Top Header */}
        <header className="h-20 px-10 bg-[#0f0f0f]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between border-b border-dashboard-border">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight">{project.name}</h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Active Project • <span className="text-zinc-300">{project.client.company || project.client.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#19191b] border border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all relative">
              <Bell className="h-4 w-4" />
              <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-500 border-2 border-[#151518]" />
            </button>
            <div className="h-8 w-px bg-dashboard-border" />
            <Button variant="outline" className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800 gap-2 h-10 px-5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all text-zinc-200">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              Assistant
            </Button>
          </div>
        </header>

        {/* Page Main Content */}
        <div className="p-10 max-w-7xl mx-auto fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
