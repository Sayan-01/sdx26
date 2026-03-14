import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <Wrapper>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Milestack</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </header>
  );
}
