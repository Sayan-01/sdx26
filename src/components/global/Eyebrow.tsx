import { cn } from "@/lib/utils";

export default function Eyebrow({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-medium text-zinc-300 tracking-wider uppercase mb-6`, className)}>
      <div className="flex items-center justify-center w-3 h-3 rounded-full border border-indigo-500/50 bg-indigo-500/10">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      {children}
    </div>
  );
}
