import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-[55vh] flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer subtle ring */}
        <div className="h-10 w-10 rounded-full border-2 border-zinc-800/80" />
        {/* Spinning colored accent ring */}
        <div className="absolute h-10 w-10 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/50 border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-[11px] font-semibold text-zinc-500 tracking-widest uppercase animate-pulse">
        Loading workspace...
      </p>
    </div>
  );
}
