"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12 selection_color relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950">
            <Layers className="h-7 w-7" />
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-zinc-400">Log in to your agency dashboard.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
            <Input 
              type="email" 
              placeholder="john@agency.com" 
              className="h-12 bg-zinc-900 border-zinc-800 focus:ring-zinc-700"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300">Forgot password?</Link>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="h-12 bg-zinc-900 border-zinc-800 focus:ring-zinc-700"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 mt-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Don't have an account? </span>
          <Link href="/signup" className="text-zinc-300 hover:text-white font-medium underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
