"use client";

import React from "react";
import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";
import ProblemSection from "@/components/home/problem-section";
import SolutionSection from "@/components/home/solution-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import AboutSection from "@/components/home/about-section";
import PricingSection from "@/components/home/pricing-section";
import CTASection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection_color">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-400 opacity-[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white opacity-[0.02] blur-[100px] rounded-full" />
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
      </div>

      <Navbar />

      <main className="grow">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
