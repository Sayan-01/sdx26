"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { UserPlus, Download, CheckCircle, CreditCard } from "lucide-react";

const Step = ({ 
  number, 
  title, 
  description, 
  icon: Icon,
  isLast = false
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: any;
  isLast?: boolean;
}) => (
  <div className="relative flex flex-col items-center text-center group">
    {!isLast && (
      <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-linear-to-r from-purple-500/50 to-transparent -z-10" />
    )}
    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 relative z-10 group-hover:border-purple-500/40 group-hover:bg-zinc-800 transition-all duration-500 group-hover:scale-110">
      <Icon className="w-10 h-10 text-purple-400" />
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
        {number}
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <p className="text-zinc-500 leading-relaxed max-w-[250px]">{description}</p>
  </div>
);

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Invite Client",
      description: "Send a secure magic link to your client. No passwords for them to remember, just instant access to their portal.",
      icon: UserPlus,
    },
    {
      number: "2",
      title: "Collect Assets",
      description: "Automate your onboarding. Milestack chases for logos, copy, and credentials so you can start working faster.",
      icon: Download,
    },
    {
      number: "3",
      title: "Deliver & Approve",
      description: "Share your work in structured milestones. Get clear feedback and one-click approvals that build an audit trail.",
      icon: CheckCircle,
    },
    {
      number: "4",
      title: "Get Paid",
      description: "Link invoices to milestones. Clients pay directly through the portal as soon as work is approved.",
      icon: CreditCard,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 border-t border-white/5">
      <Wrapper>
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-6">Simple, structured, <span className="text-purple-400">effective.</span></h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Stop guessing where things stand. Milestack provides a clear path from kickoff to final payment for every project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              {...step} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
