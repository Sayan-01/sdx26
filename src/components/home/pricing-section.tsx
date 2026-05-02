"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingCard = ({ 
  tier, 
  price, 
  description, 
  features, 
  isPopular = false 
}: { 
  tier: string; 
  price: string; 
  description: string; 
  features: string[];
  isPopular?: boolean;
}) => (
  <div className={`flex flex-col p-8 rounded-[2.5rem] bg-zinc-900/40 border ${isPopular ? "border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.1)]" : "border-white/5"} relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px]`}>
    {isPopular && (
      <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-4xl font-bold text-white">{price}</span>
      <span className="text-zinc-500 text-sm">/month</span>
    </div>
    <p className="text-zinc-400 text-sm mb-8">{description}</p>
    
    <div className="space-y-4 mb-10 flex-1">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Check className="w-3 h-3 text-purple-400" />
          </div>
          <span className="text-zinc-300 text-sm">{feature}</span>
        </div>
      ))}
    </div>
    
    <Button className={`w-full h-12 rounded-2xl font-bold ${isPopular ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-white text-zinc-950 hover:bg-zinc-200"}`}>
      Get Started
    </Button>
  </div>
);

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-zinc-950">
      <Wrapper>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4">Simple, transparent pricing.</h2>
          <p className="text-zinc-400">Choose the plan that fits your agency's scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            tier="Starter"
            price="$49"
            description="Perfect for solo freelancers managing few clients."
            features={[
              "Up to 5 active projects",
              "Unlimited clients",
              "1GB storage",
              "Standard branding",
              "Email support"
            ]}
          />
          <PricingCard 
            tier="Pro"
            price="$99"
            isPopular
            description="Ideal for growing agencies with a small team."
            features={[
              "Unlimited active projects",
              "Unlimited clients",
              "20GB storage",
              "Custom domain (White-label)",
              "Priority support",
              "Team collaboration (5 seats)"
            ]}
          />
          <PricingCard 
            tier="Enterprise"
            price="Custom"
            description="For large agencies requiring scale and security."
            features={[
              "Everything in Pro",
              "Unlimited storage",
              "SAML / SSO",
              "Dedicated account manager",
              "Custom contract & billing",
              "On-premise options"
            ]}
          />
        </div>
      </Wrapper>
    </section>
  );
}
