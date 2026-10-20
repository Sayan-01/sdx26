"use client";

import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobilePrevent({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-center p-6">
        <div>
          <h1 className="text-2xl font-bold">Mobile Not Supported</h1>
          <p className="mt-2 text-muted-foreground">The dashboard is only available on larger screens. Please use a desktop or tablet.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
