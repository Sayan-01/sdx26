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
import {  Inter } from "next/font/google";

import "./landing.css";

const inter = Inter({
  subsets: ["latin"],
});
export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-background text-foreground selection_color ${inter.className}`}>
      <Navbar />
      <main>
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
