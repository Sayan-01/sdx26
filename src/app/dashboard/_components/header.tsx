"use client";
import NotificationBellButton from "@/components/global/notification-bell-button";
import UserButton from "@/components/global/user-button";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, PlusSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] || "Home";
  

  // Optional: format to Capitalize first letter
  const formattedCurrent = current.charAt(0).toUpperCase() + current.slice(1).replace(/-/g, " ");

  return (
    <header className="border-b-2 border-dashed border-dashboard-border max-md:fixed top-0 z-40">
      <div className="flex items-center h-16 md:px-6 px-5 ">
        {/* Breadcrumb */}
        <Breadcrumb className="lg:flex hidden">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">{segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace(/-/g, " ")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 1 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbPage>{segments[1] ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1).replace(/-/g, " ") : ""}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="h-9 w-9 mr-2"></div>

        {/* Search */}
        <div className="ml-auto flex items-center gap-3">
          {/* <ModeToggle className="sm:flex hidden" /> */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm dark:bg-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <NotificationBellButton/>

          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
