import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import { SidebarComp } from "@/components/global/sidebar-comp";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { Roboto_Mono } from "next/font/google";

const roboto_Mono = Roboto_Mono({ subsets: ["latin"] });

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
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
    },
  });

  if (!project) {
    redirect(entryPath);
  }

  const clientSidebarNav = [
    {
      title: "Dashboard",
      href: `/portal/${token}/dashboard`,
      icon: "LayoutDashboard",
    },
    {
      title: "Onboarding",
      href: `/portal/${token}/onboarding`,
      icon: "CheckSquare",
    },
    {
      title: "Milestones",
      href: `/portal/${token}/milestones`,
      icon: "Milestone",
    },
    {
      title: "Files",
      href: `/portal/${token}/files`,
      icon: "FileText",
    },
    {
      title: "Payments",
      href: `/portal/${token}/payments`,
      icon: "CreditCard",
    },
  ];

  const clientSidebarUtils = [
    {
      title: "Help",
      href: `/portal/${token}/help`,
      icon: "HelpCircle",
    },
    {
      title: "Settings",
      href: `/portal/${token}/settings`,
      icon: "Settings",
    },
    {
      title: "Logout",
      href: "/logout",
      icon: "LogOut",
    },
  ];

  return (
    <div className={`flex h-dvh bg-zinc-900/80 ${roboto_Mono.className}`}>
      <aside className="md:w-[260px]">
        <SidebarComp
          userId={session.clientId}
          defaultOption={true}
          sidebarNav={clientSidebarNav}
          sidebarUtils={clientSidebarUtils}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col pt-[64px] md:pt-0 flex-1 relative overflow-auto border-l-2 border-dashed border-dashboard-border">
        {/* Unified Top Header */}
        <header className="border-b-2 border-dashed border-dashboard-border max-md:fixed top-0 z-40 flex items-center h-16 md:px-6 px-5 justify-between">
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
            <Button
              variant="outline"
              className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800 gap-2 h-10 px-5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all text-zinc-200"
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              Assistant
            </Button>
          </div>
        </header>
        {/* Page Main Content */}
        <main className="box h-[calc(100vh-64px)] overflow-y-auto flex box p-6">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
