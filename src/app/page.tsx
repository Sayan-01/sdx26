
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
import { DM_Sans } from "next/font/google";

const dm_sans =  DM_Sans({
  subsets: ["latin"],
})

export default function LandingPage() {
  return (
    <div className={`flex flex-col min-h-screen bg-black text-white selection_color ${dm_sans.className}`}>
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-zinc-950">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-50" />
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
