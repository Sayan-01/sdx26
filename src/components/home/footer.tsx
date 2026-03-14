import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-zinc-800/50">
      <Wrapper>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-zinc-950">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight">Milestack</span>
          </div>
          
          <div className="flex gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white">Twitter</Link>
            <Link href="#" className="hover:text-white">LinkedIn</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
          
          <p className="text-sm text-zinc-600">
            © 2026 Milestack. All rights reserved.
          </p>
        </div>
      </Wrapper>
    </footer>
  );
}
