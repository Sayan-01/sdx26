import React from "react";
import Wrapper from "@/components/design/wrapper";
import { FileQuestion, MessageSquareWarning, Banknote, FolderArchive } from "lucide-react";
import { Playfair } from "next/font/google";

const play = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})
export default function ProblemSection() {
  const problems = [
    { 
      title: "Onboarding Friction", 
      desc: "Chasing logos, brand guidelines, and server credentials takes weeks instead of days.", 
      icon: FileQuestion,
      color: "text-amber-400"
    },
    { 
      title: "Approvals Chaos", 
      desc: "Important feedback is lost in endless email threads with zero audit trail or version history.", 
      icon: MessageSquareWarning,
      color: "text-rose-400"
    },
    { 
      title: "Payment Lag", 
      desc: "The connection between completed work and sent invoices is fundamentally broken.", 
      icon: Banknote,
      color: "text-emerald-400"
    },
    { 
      title: "File Management", 
      desc: "Google Drive links and endless 'Final_v2_new' file suffixes completely ruin the client experience.", 
      icon: FolderArchive,
      color: "text-indigo-400"
    }
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-40"></div>

      <Wrapper>
        <div className="space-y-20 relative z-10">
          <div className="text-center space-y-2 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm font-semibold tracking-wide uppercase">
              The Status Quo is Broken
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight ${play.className} italic!`}>Stop the scattered chaos.</h2>
            <p className="text-lg text-zinc-400 ">Agencies today work across too many disconnected tools. We bring your entire collaboration workflow into one stunning workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
            {problems.map((p, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-[2rem] border border-white/5 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle top glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-5 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900/50 border border-white/5 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <p.icon className={`h-6 w-6 ${p.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-zinc-100 mb-2">{p.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
