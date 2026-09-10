import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
  link?: string;
  icon?: React.ReactNode;
  title?: string;
  extra?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
};

const DashboardCard = ({ children, link, icon, title, className, wrapperClassName, extra }: Props) => {
  return (
    <div className={`flex flex-col min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] overflow-hidden ${wrapperClassName ?? ""}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-dashboard-border/60">
        <div className="flex gap-3 items-center">
          {icon}
          <h2 className="text-sm text-zinc-400">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {extra}
          {link && (
            <Link href={link}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-white h-6 px-2"
              >
                View all <ArrowUpRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden min-h-0 ${className ?? ""}`}>{children}</div>
    </div>
  );
};

export default DashboardCard;
