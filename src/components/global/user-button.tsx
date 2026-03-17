"use client";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sign_Out } from "../../../server/auth";

const UserButton = () => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative md:h-[33.4px] md:w-[33.4px] h-[36px] w-[36px] rounded-full"
        >
          <Avatar className="md:h-[33.4px] md:w-[33.4px] h-[36px] w-[36px]">
            <AvatarImage
              // @ts-ignore
              src={session?.user?.avatarUrl || ""}
              alt="User"
            />
            <AvatarFallback className="bg-zinc-700">{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 dark:bg-zinc-800 dark:border-zinc-700"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal dark:bg-zinc-800">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none dark:text-zinc-200"> {session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground dark:text-zinc-400">{session?.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-zinc-700" />
        <DropdownMenuItem className="dark:hover:bg-zinc-700 dark:text-zinc-200">
          <Link href="/dashboard/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="dark:hover:bg-zinc-700 dark:text-zinc-200">
          <form
            action={Sign_Out}
            className="w-full"
          >
            <button
              className="w-full flex items-center"
              type="submit"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
