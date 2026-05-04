import React from "react";
import { Info, AlertTriangle, CheckCircle, Lightbulb, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function Callout({ 
  children, 
  type = "note", 
  title 
}: { 
  children: React.ReactNode; 
  type?: "note" | "warning" | "tip" | "important"; 
  title?: string 
}) {
  const styles = {
    note: { icon: <Info className="h-5 w-5" />, bg: "bg-blue-500/10", border: "border-blue-500/20", color: "text-blue-400" },
    warning: { icon: <AlertTriangle className="h-5 w-5" />, bg: "bg-amber-500/10", border: "border-amber-500/20", color: "text-amber-400" },
    tip: { icon: <Lightbulb className="h-5 w-5" />, bg: "bg-emerald-500/10", border: "border-emerald-500/20", color: "text-emerald-400" },
    important: { icon: <CheckCircle className="h-5 w-5" />, bg: "bg-indigo-500/10", border: "border-indigo-500/20", color: "text-indigo-400" },
  };

  const style = styles[type];

  return (
    <div className={cn("p-5 rounded-xl border flex gap-4 my-8", style.bg, style.border)}>
      <div className={cn("shrink-0", style.color)}>{style.icon}</div>
      <div className="space-y-1">
        {title && <p className={cn("text-sm font-bold uppercase tracking-wider", style.color)}>{title}</p>}
        <div className="text-sm text-zinc-300 leading-relaxed prose-invert prose-p:my-0">{children}</div>
      </div>
    </div>
  );
}

export function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 my-10 relative">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white z-10">
          {number}
        </div>
        <div className="flex-1 w-[1px] bg-zinc-800 absolute top-8 left-4 -z-0" />
      </div>
      <div className="space-y-3 pb-4">
        <h3 className="text-lg font-bold text-white m-0" id={title.toLowerCase().replace(/\s+/g, '-')}>{title}</h3>
        <div className="text-zinc-400 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" }) {
  const styles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border", styles[variant])}>
      {children}
    </span>
  );
}

export function CodeBlock({ code, language = "json", title }: { code: string; language?: string; title?: string }) {
  return (
    <div className="my-8 rounded-xl border border-zinc-800 bg-[#0d0d0e] overflow-hidden group">
      {title && (
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <span className="text-xs font-medium text-zinc-400">{title}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{language}</span>
        </div>
      )}
      <pre className="p-5 text-sm font-mono text-zinc-300 overflow-x-auto scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}
