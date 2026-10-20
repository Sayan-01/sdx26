import React from "react";
import Link from "next/link";
import Logo from "../global/logo";
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
            <Logo fullName={true} />
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
          <span>© 2026 SDX26 Inc. All rights reserved.</span>
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
