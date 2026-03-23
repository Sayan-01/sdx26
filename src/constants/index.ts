import { Briefcase, Settings, Users, ChartPie, Bell, HelpCircle, LogOut } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
}
export const sidebarNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "ChartPie",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: "Briefcase",
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: "Users",
  },
  {
    title: "Activity",
    href: "/dashboard/activity",
    icon: "Bell",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
];

export const sidebarUtils: NavItem[] = [
  {
    title: "Help & Support",
    href: "/help",
    icon: "HelpCircle",
  },
  {
    title: "Logout",
    href: "/logout",
    icon: "LogOut",
  },
];

export const clientSidebarNav: NavItem[] = [
  {
    title: "Overview",
    href: "/portal",
    icon: "LayoutDashboard",
  },
  {
    title: "Files",
    href: "/portal/files",
    icon: "FileText",
  },
  {
    title: "Projects",
    href: "/portal/projects",
    icon: "Briefcase",
  },
  {
    title: "Payments",
    href: "/portal/payments",
    icon: "CreditCard",
  },
];

export const clientSidebarUtils: NavItem[] = [
  {
    title: "Help",
    href: "/portal/help",
    icon: "HelpCircle",
  },
  {
    title: "Logout",
    href: "/logout",
    icon: "LogOut",
  },
];