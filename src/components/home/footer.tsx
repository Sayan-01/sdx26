"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 bg-zinc-950 border-t border-white/5">
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter mb-6 block">
              MILESTACK<span className="text-purple-600">.</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              The professional workspace for modern agencies and their clients. Built to scale your collaboration.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-zinc-500 hover:text-white transition-colors text-sm">Features</Link></li>
              <li><Link href="#how-it-works" className="text-zinc-500 hover:text-white transition-colors text-sm">Workflow</Link></li>
              <li><Link href="/portal-demo" className="text-zinc-500 hover:text-white transition-colors text-sm">Client Portal</Link></li>
              <li><Link href="/security" className="text-zinc-500 hover:text-white transition-colors text-sm">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-zinc-500 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link href="/blog" className="text-zinc-500 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="/careers" className="text-zinc-500 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Social</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© 2026 Milestack Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}
