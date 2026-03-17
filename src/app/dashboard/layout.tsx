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

const roboto_Mono = Roboto_Mono({ subsets: ["latin"] });

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();

  

  return (
    <div className={`flex h-screen bg-zinc-900/80 ${roboto_Mono.className}`}>
      <aside className="md:w-[240px]">
        <Sidebar userId={session?.user?.id || ""} />
      </aside>
      <div className="flex flex-col pt-[64px] md:pt-0 flex-1 relative overflow-auto border-l-2 border-dashed dark:border-zinc-800">
        <Header />
        <main className="box h-[calc(100vh-64px)] overflow-y-auto flex box p-5">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
