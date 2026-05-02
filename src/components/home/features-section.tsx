"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileCheck, 
  Trophy, 
  MessageSquareText, 
  Activity, 
  Users2, 
  ShieldAlert 
} from "lucide-react";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: any;
}) => (
  <div className="flex flex-col p-8 rounded-3xl bg-zinc-900/10 border border-white/5 hover:border-white/10 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-purple-400 transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default function FeaturesSection() {
  const features = [
    {
      title: "Client Dashboard",
      description: "A centralized command center for every project. Give your clients a bird's eye view of progress without sharing your internal task boards.",
      icon: LayoutDashboard,
    },
    {
      title: "Onboarding Checklist",
      description: "Collect logos, brand guidelines, and copy without the endless back-and-forth. Clients know exactly what you need and when.",
      icon: ClipboardList,
    },
    {
      title: "File Approval System",
      description: "Upload designs or documents and get clear 'Approved' or 'Changes Needed' status. Track versions and audit trails effortlessly.",
      icon: FileCheck,
    },
    {
      title: "Milestone Tracking",
      description: "Break projects into clear delivery phases. Link payments to specific milestones to ensure healthy cashflow throughout the project.",
      icon: Trophy,
    },
    {
      title: "Contextual Messaging",
      description: "Stop hunting for feedback. Conversations are attached directly to files or milestones, providing instant context for every message.",
      icon: MessageSquareText,
    },
    {
      title: "Activity Feed",
      description: "A chronological history of every action taken. See when a client viewed a file, commented, or made a payment in one place.",
      icon: Activity,
    },
    {
      title: "Team Collaboration",
      description: "Assign designers, developers, and project managers. Control who sees what with granular permission settings.",
      icon: Users2,
    },
    {
      title: "Scope Creep Protection",
      description: "Clearly defined deliverables make it easy to identify extra requests. Convert out-of-scope work into new paid milestones instantly.",
      icon: ShieldAlert,
    },
  ];

  return (
    <section className="py-24 bg-zinc-950">
      <Wrapper>
        <div className="mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 max-w-4xl text-center">
            Built for the way <span className="text-purple-400">modern agencies</span> work.
          </h2>
          <p className="text-zinc-400 max-w-2xl text-center">Everything you need to manage the client-facing side of your business, without the complexity of traditional project management tools.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
            />
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
