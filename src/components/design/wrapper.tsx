import { cn } from "@/lib/utils";
import React from "react";

const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn(`w-full py-1 max-w-7xl sm:px-8 px-5 mx-auto`, className)}>{children}</div>;
};

export default Wrapper;
