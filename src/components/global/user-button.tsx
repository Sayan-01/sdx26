"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Sign_Out, getUserAgency } from "../../../server/auth/auth";
import { useSession } from "next-auth/react";

const UserButton = () => {
  const { data: session } = useSession();
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    const fetchAgency = async () => {
      if (session?.user?.id) {
        const agency = await getUserAgency();
        if (agency?.logoUrl) {
          setLogoUrl(agency.logoUrl);
        }
      }
    };
    fetchAgency();
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("") ?? "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-xl bg-[#19191b] border border-dashboard-border hover:bg-zinc-800 transition-all duration-200 outline-none group">
          <Avatar className="h-7 w-7 rounded-lg shrink-0">
            <AvatarImage
              src={logoUrl || session?.user?.avatarUrl || ""}
              alt={session?.user?.name ?? "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-none">{firstName}</span>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-[#19191b] border-dashboard-border shadow-xl shadow-black/30"
        align="end"
        forceMount
      >
        {/* User info header */}
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-lg shrink-0">
              <AvatarImage
                src={logoUrl || session?.user?.avatarUrl || ""}
                alt={session?.user?.name ?? "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">{session?.user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-dashboard-border" />

        <DropdownMenuItem
          asChild
          className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer mx-1 rounded-lg"
        >
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 w-full"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-dashboard-border" />

        <DropdownMenuItem
          asChild
          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer mx-1 rounded-lg mb-1"
        >
          <form
            action={Sign_Out}
            className="w-full"
          >
            <button
              className="w-full flex items-center gap-2.5"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
