import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className={`flex flex-col min-h-0 border border-dashboard-border rounded-xl bg-[#19191b] group relative card_shadow transition-all duration-300 ${wrapperClassName ?? ""}`}>
      <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex gap-4 items-center">
          {icon}
          <h2 className="text-md flex items-center gap-2">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {extra}
          {link && (
            <Link href={link}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-white h-6"
              >
                View all <ArrowUpRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className={` bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden min-h-0 p-0 py-0 rounded-t-none ${className}`}>{children}</Card>
    </div>
  );
};

export default DashboardCard;
