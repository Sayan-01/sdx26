"use client";

import React from "react";
import Wrapper from "@/components/design/wrapper";

export default function AboutSection() {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <Wrapper>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Built by agency owners, <br />
            <span className="text-zinc-500">for agency owners.</span>
          </h2>
          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
            <p>
              We started Milestack because we were tired of the "email chaos." We saw too many talented designers and developers losing sleep over missed feedback, delayed payments, and clients who felt out of the loop.
            </p>
            <p>
              Our mission is to help agencies reclaim their time and provide a world-class experience to their clients. We believe that professional work deserves a professional workspace.
            </p>
            <p className="pt-4 text-white font-semibold">
              Join 500+ agencies building the future of client collaboration.
            </p>
          </div>
        </div>
      </Wrapper>
      
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
}
