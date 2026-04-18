import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <div className="w-full max-w-5xl bg-zinc-950/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full pointer-events-auto transition-all duration-300">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">Milestack</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link
              href="#features"
              className="hover:text-white transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-white after:opacity-0 hover:after:opacity-100 after:transition-opacity"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-white transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-white after:opacity-0 hover:after:opacity-100 after:transition-opacity"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-white after:opacity-0 hover:after:opacity-100 after:transition-opacity"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-full px-5 hidden sm:flex"
              >
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-5 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105 group">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
