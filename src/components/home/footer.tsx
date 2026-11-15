import React from "react";
import Link from "next/link";
import Logo from "../global/logo";

export default function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#capabilities" },
        { label: "Workflow", href: "/#workflow" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Client Portal", href: "/docs/client-portal-overview" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/#about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/docs/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "/docs" },
      ],
    },
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
                  {c.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {item.label}
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
        </div>
      </div>
    </footer>
  );
}
