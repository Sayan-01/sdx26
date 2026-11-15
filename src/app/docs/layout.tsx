import React from "react";
import DocsSidebar from "@/components/docs/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-zinc-300 selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        <div className="max-w-[1448px] mx-auto w-full flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">S</div>
              <span className="font-bold text-white tracking-tight text-lg">SDX26 Docs</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/docs/introduction" className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b-2 border-indigo-500 py-5">
                Guides
              </Link>
              <Link href="/docs/api-auth" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 py-5 transition-colors">
                API Reference
              </Link>
              <Link href="/docs/contact" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 py-5 transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors">
              Agency Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1448px] mx-auto flex">
        <DocsSidebar />
        <main className="flex-1 min-w-2xl">
          <div className="max-w-3xl mx-auto px-6 py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
