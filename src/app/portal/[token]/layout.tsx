import React from "react";
import { getClientSession } from "@/lib/client-session";
import { redirect } from "next/navigation";
import { SidebarComp } from "@/components/global/sidebar-comp";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { Roboto_Mono, Sora } from "next/font/google";

const roboto_Mono = Roboto_Mono({ subsets: ["latin"] });

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getClientSession();

  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "";
  const entryPath = `/portal/${token}`;

  if (session && session.token !== token) {
    if (currentPath !== entryPath && currentPath !== `${entryPath}/`) {
      redirect(entryPath);
    }
  }
  // If session exists and we are at the entry page (exactly /[token]),
  // redirect specifically to dashboard.
  if (session && session.token === token && (currentPath === entryPath || currentPath === `${entryPath}/`)) {
    redirect(`${entryPath}/dashboard`);
  }

  // Tenant Validation: Ensure client matches subdomain agency context
  const agencyIdHeader = headersList.get("x-agency-id");
  if (session && agencyIdHeader && session.agencyId !== agencyIdHeader) {
    // Tenant mismatch detected, redirect back to entry path
    redirect(entryPath);
  }

  // If no session and we are NOT on the entry page, MUST redirect back to entry.
  if (!session && currentPath !== entryPath && currentPath !== `${entryPath}/`) {
    redirect(entryPath);
  }

  // If no session and it is the entry page, just render without the nav/sidebar
  if (!session || (session.token !== token && (currentPath === entryPath || currentPath === `${entryPath}/`))) {
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
      title: "Scope & Changes",
      href: `/portal/${token}/scope`,
      icon: "AlertCircle",
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
          upgradeCard={false}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col pt-[64px] md:pt-0 flex-1 relative overflow-auto border-l-2 border-dashed border-dashboard-border">
        {/* Unified Top Header */}
        <header className="border-b-2 border-dashed border-dashboard-border max-md:fixed top-0 z-40 flex items-center h-16 md:px-6 px-5 justify-between">
          {(() => {
            const statusStyles: Record<string, { dot: string; badge: string }> = {
              ACTIVE:    { dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",   badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
              PENDING:   { dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",     badge: "border-amber-500/20 bg-amber-500/10 text-amber-400" },
              ON_HOLD:   { dot: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]",    badge: "border-orange-500/20 bg-orange-500/10 text-orange-400" },
              COMPLETED: { dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]",      badge: "border-blue-500/20 bg-blue-500/10 text-blue-400" },
              ARCHIVED:  { dot: "bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.4)]",     badge: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400" },
            };
            const s = statusStyles[project.status] ?? statusStyles["ACTIVE"];
            return (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-200">
                  <div className={`h-2 w-2 rounded-full animate-pulse ${s.dot} mt-0.5`} />
                  {project.name}
                </div>
                <span className="text-zinc-600">/</span>
                <span className="text-xs text-zinc-400">{project.client.company || project.client.name}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.badge}`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>
            );
          })()}
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
        <main className="box h-[calc(100vh-64px)] overflow-y-auto flex box p-4 md:p-5 lg:p-6">
          <div className="mx-auto w-full h-full flex flex-col min-h-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
