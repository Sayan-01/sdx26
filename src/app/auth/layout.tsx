import React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-screen ">
      <div className="relative flex items-center justify-center h-screen p-2">
        {/* Right side - Login Form */}
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
