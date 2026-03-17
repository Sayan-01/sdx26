import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, CheckCircle2, Star, Sparkles, Wand2 } from "lucide-react";
import Wrapper from "@/components/design/wrapper";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-zinc-950">
        <div
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[0%] left-[40%] w-[600px] h-[400px] bg-violet-600/15 blur-[130px] rounded-full mix-blend-screen opacity-40 animate-pulse"
          style={{ animationDuration: "5s" }}
        />
      </div>

      <Wrapper>
        <div className="flex flex-col items-center text-center mx-auto space-y-10 relative z-10 hidden-scrollbar">
          {/* Badge */}
          <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all hover:bg-white/10 hover:border-white/20 select-none">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span>Milestack is now in Early Access</span>
            <span className="w-px h-3 bg-white/20 mx-1" />
            <span className="text-white flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer">
              Explore Features <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] max-w-5xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-sm">
            The Professional Workspace Where Agencies and Clients Stay Aligned.
          </h1>

          <p className="text-lg md:text-xl md:px-0 text-zinc-400 max-w-2xl font-medium leading-relaxed">
            Stop losing projects to email threads and &quot;final_v2&quot; chaos. Milestack centralizes your onboarding, approvals, and milestone payments into one premium branded portal.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-2xl group"
              >
                Start for free
                <Wand2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform text-indigo-500" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl"
              >
                See how it works
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6 pb-2 text-sm text-zinc-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 z-${5 - i}`}
                  >
                    {i === 4 ? "+9" : <Star className="h-3 w-3 text-zinc-500" />}
                  </div>
                ))}
              </div>
              <span>Trusted by 500+ agencies</span>
            </div>
          </div>

          <div className="mt-20 w-full relative perspective-[2000px] z-20">
            {/* Ambient glow behind mock */}
            <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-b from-indigo-500/20 to-transparent opacity-60 blur-2xl" />

            <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-video group transform transition-transform duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(79,70,229,0.2)] ring-1 ring-white/5">
              {/* Premium Mac-like top bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                <div className="flex gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="flex-1 max-w-sm mx-auto px-4 py-1.5 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                  <span className="text-xs text-zinc-500 font-mono">milestack.com/agency/dashboard</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Mock Dashboard UI */}
              <div className="w-full h-full p-8 flex gap-6 bg-zinc-950/50">
                {/* Sidebar mock */}
                <div className="w-48 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                  <div className="w-full h-8 rounded-lg bg-white/10 mb-4" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-full h-6 rounded-md ${i === 1 ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5"} flex items-center px-3`}
                    />
                  ))}
                </div>

                {/* Main content mock */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-end pb-4 border-b border-white/5">
                    <div className="space-y-3">
                      <div className="w-48 h-6 bg-white/90 rounded-md" />
                      <div className="w-32 h-4 bg-white/40 rounded-md" />
                    </div>
                    <div className="w-24 h-8 rounded-full bg-indigo-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grow">
                    <div className="col-span-2 space-y-4">
                      {/* Big chart or stats area */}
                      <div className="w-full h-48 rounded-xl bg-linear-to-br from-white/5 to-white/0 border border-white/5 group-hover:border-white/10 transition-colors flex flex-col justify-end p-6">
                        <div className="w-full h-1/2 flex items-end justify-between gap-2 opacity-50">
                          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div
                              key={i}
                              className="w-full bg-indigo-500/80 rounded-t-sm"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5" />
                        <div className="flex-1 h-24 rounded-xl bg-white/5 border border-white/5" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {/* Activity feed mock */}
                      <div className="w-full h-full rounded-xl bg-white/5 border border-white/5 p-5 flex flex-col gap-4">
                        <div className="w-24 h-4 bg-white/40 rounded-md mb-2" />
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 rounded-full bg-indigo-400/20" />
                            <div className="space-y-2 flex-1">
                              <div className="w-full h-2 bg-white/20 rounded-full" />
                              <div className="w-2/3 h-2 bg-white/10 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Button className="gap-2 bg-white text-black hover:bg-zinc-200 rounded-full h-12 px-6 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  Explore Interactive Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
