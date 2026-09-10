import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle ring */}
        <div className="h-6 w-6 rounded-full border-2 border-zinc-800/80" />
        {/* Spinning colored accent ring */}
        <div className="absolute h-6 w-6 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/50 border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-[13px] font-semibold text-zinc-500 tracking-widest uppercase animate-pulse">
        Loading workspace...
      </p>  
    </div>
  );
}
