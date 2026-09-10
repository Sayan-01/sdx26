import React from "react";
 
const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-dvh">
      <div className="relative flex items-center justify-center min-h-dvh p-2">
        {/* Right side - Login Form */}
        <div className="w-full h-full flex items-center justify-center p-4 max-sm:py-10 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="max-w-[360px]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
