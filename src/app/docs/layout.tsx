import React from "react";
import DocsSidebar from "@/components/docs/sidebar";
import Link from "next/link";
import Logo from "@/components/global/logo";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-zinc-300 selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-zinc-800/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between bg-zinc-950/80">
        <div className="max-w-[1448px] mx-auto w-full flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <Logo fullName={true} />
              <span className="text-sm font-semibold text-zinc-400 ml-1">Docs</span>
            </div>

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

      {/* Early Access Feedback Banner */}
      <section className="relative overflow-hidden border-b border-indigo-500/20 bg-linear-to-r from-indigo-950/50 via-zinc-900/90 to-indigo-950/50 py-2.5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1448px] px-6 mx-auto relative flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Early Access
            </span>
            <span className="text-zinc-300 font-medium text-center sm:text-left">
              Help us shape SDX26! We’d love your thoughts, feature requests, or bug reports.
            </span>
          </div>

          <a
            href="https://forms.gle/ttHKzCp3gVMwNt7J7"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-950/50 hover:shadow-indigo-500/20 shrink-0"
          >
            <span>Give Feedback</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>

      <div className="max-w-[1448px] mx-auto flex">
        <DocsSidebar />
        <main className="flex-1 min-w-2xl">
          <div className="max-w-3xl mx-auto px-6 py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
