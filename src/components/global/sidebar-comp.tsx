"use client";

import UpgradeCard from "@/app/dashboard/_components/upgrade-card";
import { cn } from "@/lib/utils";
import {
  ArrowBigDown,
  Bell,
  Brain,
  Briefcase,
  Calendar,
  ChartPie,
  ChartSpline,
  ChevronDown,
  ChevronLeftCircleIcon,
  FileText,
  Hash,
  HelpCircle,
  Instagram,
  Layers,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  TvMinimalPlay,
  Users,
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  Milestone,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Poppins } from "next/font/google";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";

export interface History {
  id?: string;
  contentId: string;
  contentTitle: string;
  userId?: string;
}

const iconMap: Record<string, any> = {
  Bell,
  Briefcase,
  ChartPie,
  HelpCircle,
  LogOut,
  Settings,
  Users,
  Layers,
  FileText,
  CreditCard,
  LayoutDashboard,
  CheckSquare,
  Milestone,
};

export function SidebarComp({
  userId,
  defaultOption = false,
  sidebarNav,
  sidebarUtils,
  activePlan,
}: {
  userId: string | undefined;
  defaultOption?: boolean;
  sidebarNav: any[];
  sidebarUtils: any[];
  activePlan?: string;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const openState = useMemo(() => (defaultOption ? { open: true } : {}), [defaultOption]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet
      modal={!defaultOption}
      {...openState}
    >
      <DialogTitle className="hidden">Sidebar Navigation</DialogTitle>
      <SheetTrigger className="h-9 w-9 flex flex-col items-center justify-center rounded-lg border border-[#545454]/30 fixed z-50 md:hidden left-5 top-[14px] outline-none bg-zinc-700">
        <div className="h-px bg-white/70 w-4 mb-[5px]" />
        <div className="h-px bg-white/70 w-4" />
      </SheetTrigger>
      <SheetContent
        showX={!defaultOption}
        side="left"
        className={cn("w-[260px] gap-0 hidden flex-col min-[1150px]:flex justify-between h-full p-6 bg-transparent border-0", {
          "hidden md:flex z-0 ": defaultOption,
          "flex md:hidden z-100 ": !defaultOption,
        })}
      >
        <div className="">
          <Link
            href="/"
            className={`flex items-center p-2 justify-start rounded-xl`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-zinc-700 text-lg bg-zinc-800 text-zinc-400">
              <Layers size={18} />
            </div>
            <div>
              <h1 className={`px-3 text-black dark:text-white font-semibold`}>Milestack.</h1>
              <p className="px-3 text-black dark:text-zinc-400 text-xs">For Modern Agencies</p>
            </div>
          </Link>
          <p className="text-xs pl-2 py-2 font-medium text-neutral-500 dark:text-zinc-400 mt-3">Menu</p>
        </div>
        <nav className=" overflow-y-auto px-0.5 relative mb-auto">
          <ul className="space-y-1 ">
            {sidebarNav.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-[8px] py-[8px] text-sm rounded-md",
                    pathname === item.href ? "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-300" : "hover:bg-gray-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300",
                  )}
                >
                  {(() => {
                    const Icon = typeof item.icon === "string" ? iconMap[item.icon] || HelpCircle : item.icon;
                    return (
                      <Icon
                        strokeWidth={2}
                        className={cn("h-[18px] w-[18px] mr-2", pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-400")}
                      />
                    );
                  })()}
                  {item.title}
                </Link>
              </li>
            ))}
            <div className="h-4 w-full bg-zinc-900 md:hidden block" />
          </ul>
        </nav>

        <div className="mt-0 pt-3  relative">
          <div className="h-[60px] bg-gradient-to-b from-transparent via-zinc-900 z-10 to-zinc-900 pointer-events-none absolute -top-[40px] left-0 w-full md:hidden block" />

          <UpgradeCard activePlan={activePlan} />
          {sidebarUtils.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn("flex items-center px-[10px] py-[10px] text-sm rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400")}
            >
              {(() => {
                const Icon = typeof item.icon === "string" ? iconMap[item.icon] || HelpCircle : item.icon;
                return (
                  <Icon
                    strokeWidth={2.2}
                    className="mr-3 h-[18px] w-[18px]"
                  />
                );
              })()}
              {item.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
