"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOCS_DATA } from "@/lib/docs-data";

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-zinc-800/50 py-8 px-6 scrollbar-hide">
      <div className="space-y-8">
        {DOCS_DATA.map((category) => (
          <div key={category.title} className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {category.title}
            </h4>
            <div className="space-y-1 ml-2">
              {category.items.map((item) => {
                const href = `/docs/${item.slug}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={item.slug}
                    href={href}
                    className={cn(
                      "block px-3 py-1.5 text-sm rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
