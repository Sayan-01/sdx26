"use client";
import { useEffect, useState } from "react";
import Italic from "../global/italic";
import { Database, Workflow, Sparkles, ShieldCheck, Layers, WorkflowIcon, GitBranch, AppWindow, Palette, LucideIcon, LockIcon } from "lucide-react";
import Eyebrow from "../global/Eyebrow";

function IconPair({ Left, Right }: { Left: LucideIcon; Right: LucideIcon }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-10 md:gap-14">
      {/* soft floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[62%] h-10 w-[68%] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.18), transparent 70%)" }}
      />
      <Squircle
        Icon={Left}
        delay={0}
      />
      <div
        aria-hidden
        className="relative h-16 w-[4px]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(1,1,1), transparent)",
        }}
      />
      <Squircle
        Icon={Right}
        delay={120}
      />
    </div>
  );
}

function Squircle({ Icon, delay = 0 }: { Icon: LucideIcon; delay?: number }) {
  return (
    <div
      className="group relative"
      style={{ animation: `tileIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
    >
      {/* drop shadow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-3 rounded-[28%] blur-2xl"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />
      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-[28%] md:h-28 md:w-28"
        style={{
          background: "linear-gradient(155deg, #2a2a2e 0%, #131316 55%, #050507 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6), 0 18px 36px -14px rgba(0,0,0,0.55), 0 6px 14px -6px rgba(0,0,0,0.4)",
        }}
      >
        {/* top gloss */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1 h-1/2 rounded-[28%] opacity-60"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0) 70%)",
          }}
        />
        {/* edge highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28%]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
        />
        <Icon
          className="relative h-9 w-9 md:h-10 md:w-10 transition-transform duration-500 group-hover:scale-110"
          style={{ color: "#f5f5f7", strokeWidth: 1.6, filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }}
        />
      </div>
    </div>
  );
}

function VizSource() {
  return (
    <IconPair
      Left={Database}
      Right={Layers}
    />
  );
}
function VizWorkflow() {
  return (
    <IconPair
      Left={WorkflowIcon}
      Right={GitBranch}
    />
  );
}
function VizWorkspace() {
  return (
    <IconPair
      Left={AppWindow}
      Right={Palette}
    />
  );
}
function VizShield() {
  return (
    <IconPair
      Left={ShieldCheck}
      Right={LockIcon}
    />
  );
}

const pillars = [
  {
    eyebrow: "01 — Unified",
    title: "Single source of truth",
    body: "No more digging through emails or Slack. Every file, approval, and message is attached directly to the project milestone. Your clients know exactly where to go — and so do you.",
    bullets: ["Files, approvals & messages in one place", "Threaded conversation on every asset", "Replace 6+ scattered tools"],
    viz: VizSource,
    icon: Database,
    glowGradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    badgeGlow: "shadow-[0_0_12px_rgba(99,102,241,0.2)] bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400",
  },
  {
    eyebrow: "02 — Repeatable",
    title: "Structured workflows",
    body: "Standardize delivery from kickoff to closeout. Follow a repeatable, clear path that ensures nothing falls through the cracks.",
    bullets: ["Templated milestones for every project", "Auto-advance with approvals & payments", "Clear status at every step"],
    viz: VizWorkflow,
    icon: Workflow,
    glowGradient: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    badgeGlow: "shadow-[0_0_12px_rgba(168,85,247,0.2)] bg-purple-500/10 border-purple-500/30 text-purple-500 dark:text-purple-400",
  },
  {
    eyebrow: "03 — Branded",
    title: "Client-facing workspace",
    body: "Give clients a premium, branded portal that makes you look like a top-tier agency. A centralized home for progress, deliverables, and billing.",
    bullets: ["White-label portal with your brand", "Progress, deliverables & billing", "Clients log in to one beautiful surface"],
    viz: VizWorkspace,
    icon: Sparkles,
    glowGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badgeGlow: "shadow-[0_0_12px_rgba(16,185,129,0.2)] bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400",
  },
  {
    eyebrow: "04 — Protected",
    title: "Scope-creep protection",
    body: "Clearly defined deliverables and structured feedback loops mean you only work on what's agreed. Convert out-of-scope requests into new paid milestones instantly.",
    bullets: ["Locked scope per milestone", "One-click 'convert to new milestone'", "Audit trail of every change request"],
    viz: VizShield,
    icon: ShieldCheck,
    glowGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    badgeGlow: "shadow-[0_0_12px_rgba(244,63,94,0.2)] bg-rose-500/10 border-rose-500/30 text-rose-500 dark:text-rose-400",
  },
];

export default function Solution() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-pillar-index]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.pillarIndex);
            if (!Number.isNaN(idx)) {
              setActive(idx);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="border-b border-border bg-background">
      <style>{`
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { 0% { opacity: 0; transform: translateX(-4px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes drawX { 0% { transform: scaleX(0); transform-origin: left; } 100% { transform: scaleX(1); transform-origin: left; } }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.5; transform-origin: 295px 160px; } 100% { transform: scale(1.4); opacity: 0; transform-origin: 295px 160px; } }
        @keyframes rejectOut { 0% { opacity: 1; transform: translate(0,0) rotate(0); } 60% { opacity: 1; } 100% { opacity: 0; transform: translate(120px,30px) rotate(6deg); } }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.96) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .viz-transition {
          transition: opacity 650ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Solution</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            One structured system to <Italic>rule them all.</Italic>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Milestack replaces your scattered mess of tools with a single, professional source of truth for you and your clients.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — scrolling content */}
          <div className="flex flex-col">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                data-pillar-index={i}
                className="flex min-h-[70vh] flex-col justify-center py-12 max-sm:px-2"
              >
                <div className={`transition-all duration-500 ${active === i ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"}`}>
                  <div className="flex items-center gap-3.5">
                    <span className="font-display text-[11px] font-semibold tracking-widest text-muted-foreground">{p.eyebrow}</span>
                    <div className="h-px w-12 bg-border/80" />
                  </div>
                  <div className="flex gap-4 items-center mt-7">
                    <div
                      className={`flex items-center justify-center min-w-12 h-12 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active === i
                          ? "bg-gradient-to-br from-white to-zinc-200 border-transparent text-zinc-900 shadow-[0_0.597px_0.597px_-0.875px_rgba(0,0,0,0.12),0_1.81px_1.81px_-1.75px_rgba(0,0,0,0.1),0_4.78px_4.78px_-2.625px_rgba(0,0,0,0.08),0_15px_15px_-3.5px_rgba(0,0,0,0.05),inset_-0.73px_0.73px_2px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(0,0,0,0.03)] -translate-y-0.5"
                          : "bg-surface-2/40 border border-border/80 text-muted-foreground/60"
                      }`}
                    >
                      <p.icon
                        className="h-6 w-6"
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className=" font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-4xl">{p.title}</h3>
                  </div>
                  <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm text-foreground/80"
                      >
                        <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — sticky visual */}
          <div className="hidden lg:block">
            <div className="sticky top-[15%] flex flex-col justify-center h-[70vh] duration-1000">
              <div
                className="relative aspect-[5/4] overflow-hidden rounded-3xl"
                style={{
                  background: `
radial-gradient(
  circle at top left,
  #edf0c4 0%,
  #d9d9d9 45%,
  #bfc0c8 100%
)
`,
                  boxShadow: `
inset 0 1px 0 rgba(255,255,255,0.15),
inset 0 -1px 0 rgba(0,0,0,0.08),
0 40px 80px -30px rgba(0,0,0,0.45)
`,
                }}
              >
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.08]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,1) 1px, transparent 1px)
                    `,
                    backgroundSize: "10% 10%",
                  }}
                />
                {/* subtle inner vignette */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.03), transparent 70%)",
                  }}
                />
                {/* Top bar */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-1.5 mr-5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    />
                  </div>
                  <span
                    className="font-display text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: "rgba(0, 0, 0,0.4)" }}
                  >
                    {pillars[active].eyebrow}
                  </span>
                  <div className="flex items-center gap-1">
                    {pillars.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 rounded-full transition-all duration-1000 ${active === i ? "w-6" : "w-1.5"}`}
                        style={{ background: active === i ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.15)" }}
                      />
                    ))}
                  </div>
                </div>
                {/* Viz */}
                {pillars.map((p, i) => {
                  const Vis = p.viz;
                  return (
                    <div
                      key={i}
                      className={`absolute inset-0 flex items-center justify-center pt-6 viz-transition ${
                        active === i ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-8 scale-[0.93] pointer-events-none "
                      }`}
                    >
                      <Vis />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="font-display text-sm font-semibold text-foreground">{pillars[active].title}</span>
                <span className="text-xs text-muted-foreground">
                  {String(active + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
