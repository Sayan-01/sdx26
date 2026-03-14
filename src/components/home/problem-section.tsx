import React from "react";
import Wrapper from "@/components/design/wrapper";

export default function ProblemSection() {
  const problems = [
    { title: "Onboarding Friction", desc: "Logo, credentials chase করতে সপ্তাহ চলে যায়।" },
    { title: "Approvals Chaos", desc: "Email back-and-forth with no audit trail." },
    { title: "Payment Lag", desc: "Work done এবং invoice এর connection broken।" },
    { title: "File Management", desc: "Google Drive chaos, no version control." }
  ];

  return (
    <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
      <Wrapper>
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Stop the fragmentation.</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Agencies today work across too many disconnected tools. We bring everything into one structured workspace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4 hover:border-zinc-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 font-bold">0{i+1}</span>
                </div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
