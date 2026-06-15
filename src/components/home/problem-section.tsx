import { AlertTriangle, ArrowRight, Clock, CreditCard, Mail, MessageSquare } from "lucide-react";
import Italic from "../global/italic";

const problems = [
  {
    icon: Mail,
    title: "Lost feedback in email threads",
    body: "Searching through 'Re: Re: Feedback' chains is where productivity goes to die. Milestack keeps every conversation tied to the actual deliverable.",
  },
  {
    icon: AlertTriangle,
    title: "Final_v2_final_FINAL chaos",
    body: "Version control shouldn't be a naming convention. Stop the file-hunting nightmare and keep a clean audit trail.",
  },
  {
    icon: MessageSquare,
    title: "Clients messaging everywhere",
    body: "WhatsApp, Slack, Email, LinkedIn. Centralize communication before you lose your mind and your focus.",
  },
  {
    icon: Clock,
    title: "Delayed approvals",
    body: "Waiting days for a 'looks good' text? Automate the follow-ups and get clear, documented sign-offs.",
  },
  {
    icon: CreditCard,
    title: "Manual payment tracking",
    body: "Stop asking 'did they pay the deposit yet?'. Link client payments to milestones and get paid automatically on completion.",
  },
];

export default function ProblemSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-page py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-medium text-zinc-300 tracking-wider uppercase mb-6">
            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-indigo-500/50 bg-indigo-500/10">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            </div>The chaos
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            Stop losing projects to the <Italic>status quo</Italic> chaos.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Managing client projects shouldn't feel like a full-time search
            operation. Here's what your agency is up against.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <article key={p.title} className="bg-card p-7 transition-colors hover:bg-card/70">
              <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface-2 text-foreground">
                <p.icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          ))}
          <div className="hidden bg-card p-7 lg:block">
            <div className="flex h-full flex-col justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  There's a better way.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  One workspace. Every project. Zero chaos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

