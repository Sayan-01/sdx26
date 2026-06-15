import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "../../../auth";
import ThemeToggle from "./theme-toggle";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-[1.02]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L10 10 L14 14 L20 6" />
        </svg>
      </div>
      <span className="font-display text-[15px] font-semibold tracking-tight text-foreground group-hover:text-foreground/90 transition-colors">
        Milestack
      </span>
    </Link>
  );
}

export default async function Navbar() {
  const session = await auth();
  const links = [
    { label: "Features", href: "#capabilities" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
          
          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-px"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-px"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
