"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"))
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: Number(el.tagName.replace("H", "")),
      }))
      .filter((h) => h.id);
    
    setHeadings(elements);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    document.querySelectorAll("h2, h3").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="w-64 shrink-0 hidden xl:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 px-4">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          On this page
        </h4>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-xs transition-all duration-200 border-l-2 pl-4",
                heading.level === 3 ? "ml-4" : "",
                activeId === heading.id
                  ? "border-indigo-500 text-indigo-400 font-medium"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
