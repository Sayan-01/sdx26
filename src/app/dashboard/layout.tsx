import React from "react";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Users, Settings, Bell, Layers, Search, Plus, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "./_components/sidebar";
import Header from "./_components/header";
import { auth } from "../../../auth";
import { Roboto_Mono } from "next/font/google";
import { redirect } from "next/navigation";

const roboto_Mono = Roboto_Mono({ subsets: ["latin"] });

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const activePlan = session?.user?.activePlan || "basic";
  const isBasicPlan = activePlan === "basic";

  return (
    <div className={`flex h-dvh  ${roboto_Mono.className}`}>
      <aside className="md:w-[260px]">
        <Sidebar
          userId={session?.user?.id || ""}
          activePlan={activePlan}
        />
      </aside>
      <div className="flex flex-col pt-[64px] md:pt-0 flex-1 relative overflow-auto border border-border ">
        <Header />
        {isBasicPlan && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">Basic Plan</span>
              <p className="text-xs md:text-sm text-zinc-300">
                You are in view-only mode. Upgrade to <strong className="text-white">Starter</strong> or <strong className="text-white">Pro</strong> to create projects and invite team members.
              </p>
            </div>
            <Link href="/#pricing">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold gap-1.5 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}
        <main className="box h-[calc(100vh-64px)] overflow-y-auto flex box">
          <div className="mx-auto w-full max-w-[1400px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
