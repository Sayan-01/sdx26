import React from "react";
import Link from "next/link";

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

export default function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Workflow", "Client Portal", "Security"] },
    { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
    { title: "Resources", links: ["Docs", "Changelog", "Community", "Status"] },
  ];

  return (
    <footer>
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The professional workspace for modern agencies and their clients.
              Built to scale your collaboration.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© 2026 Milestack Inc. All rights reserved.</span>
          <div className="flex flex-wrap gap-5">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
