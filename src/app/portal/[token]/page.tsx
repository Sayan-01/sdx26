// app/(client-portal)/portal/[token]/page.tsx
// Client lands here when they click the magic link
// Verifies token → sets session cookie → redirects to /dashboard

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckIcon, ClockIcon, LockIcon, XIcon } from "lucide-react";

type State = "verifying" | "redirecting" | "already_used" | "expired" | "invalid" | "error";

export default function PortalEntryPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Animate progress bar during verification
  useEffect(() => {
    if (state === "verifying") {
      setProgress(0);
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev; // Stall at 85% until real completion
          return prev + Math.random() * 12;
        });
      }, 300);
    } else {
      // Snap to 100% then clear
      setProgress(100);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [state]);

  // Delay content reveal for smooth transition between states
  useEffect(() => {
    setShowContent(false);
    const t = setTimeout(() => setShowContent(true), 60);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/magic-link/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setState("redirecting");
          setTimeout(() => {
            window.location.href = `/portal/${token}/dashboard`;
          }, 1200);
          return;
        }

        // Map error cases
        if (data.error?.includes("already been used")) {
          setState("already_used");
        } else if (data.error?.includes("expired")) {
          setState("expired");
        } else if (res.status === 404) {
          setState("invalid");
        } else {
          setState("error");
          setErrorMsg(data.error ?? "Something went wrong.");
        }
      } catch {
        setState("error");
        setErrorMsg("Network error. Please check your connection.");
      }
    }

    verify();
  }, [token, router]);

  return (
    <div style={styles.root}>
      {/* Brand mark */}
      <div style={styles.brand}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            width="24"
            height="24"
            rx="6"
            fill="var(--accent)"
          />
          <path
            d="M7 12h10M7 8h6M7 16h8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span style={styles.brandName}>Milestack</span>
      </div>

      <div
        style={styles.card}
        className="fade-up"
      >
        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${Math.min(progress, 100)}%`,
              opacity: state === "verifying" || state === "redirecting" ? 1 : 0,
            }}
          />
        </div>

        <div
          style={{
            ...styles.contentTransition,
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {state === "verifying" && <VerifyingState />}
          {state === "redirecting" && <RedirectingState />}
          {state === "already_used" && <AlreadyUsedState />}
          {state === "expired" && <ExpiredState />}
          {state === "invalid" && <InvalidState />}
          {state === "error" && <ErrorState message={errorMsg} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// State components
// ─────────────────────────────────────────

function VerifyingState() {
  return (
    <div style={styles.stateWrap}>
      <div style={styles.spinnerOuter}>
        <div style={styles.spinnerGlow} />
        <div className="spinner" />
      </div>
      <p style={styles.stateTitle}>Opening your portal</p>
      <p style={styles.stateDesc}>Verifying your access link...</p>
      <div style={styles.dotsWrap}>
        <span style={{ ...styles.dot, animationDelay: "0ms" }} />
        <span style={{ ...styles.dot, animationDelay: "200ms" }} />
        <span style={{ ...styles.dot, animationDelay: "400ms" }} />
      </div>
    </div>
  );
}

function RedirectingState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, animation: "iconPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
        <CheckIcon
          color="var(--green, #22c55e)"
          size={22}
        />
      </div>
      <p style={styles.stateTitle}>You're in!</p>
      <p style={styles.stateDesc}>Taking you to your project...</p>
    </div>
  );
}

function AlreadyUsedState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "rgba(245, 158, 11, 0.1)", animation: "iconPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
        <LockIcon
          color="#f59e0b"
          size={22}
        />
      </div>
      <p style={styles.stateTitle}>Link already used</p>
      <p style={styles.stateDesc}>This link can only be used once. If your session expired or you&apos;re on a new device, contact your agency for a new link.</p>
      <ContactHint />
    </div>
  );
}

function ExpiredState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "rgba(245, 158, 11, 0.1)", animation: "iconPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
        <ClockIcon
          color="#f59e0b"
          size={22}
        />
      </div>
      <p style={styles.stateTitle}>Link expired</p>
      <p style={styles.stateDesc}>Portal links expire after 7 days. Please contact your agency and ask them to send a new link.</p>
      <ContactHint />
    </div>
  );
}

function InvalidState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "rgba(239, 68, 68, 0.1)", animation: "iconPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
        <XIcon
          color="#ef4444"
          size={22}
        />
      </div>
      <p style={styles.stateTitle}>Invalid link</p>
      <p style={styles.stateDesc}>This link doesn&apos;t exist or has been revoked. Please contact your agency.</p>
      <ContactHint />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "rgba(239, 68, 68, 0.1)", animation: "iconPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
        <XIcon
          color="#ef4444"
          size={22}
        />
      </div>
      <p style={styles.stateTitle}>Something went wrong</p>
      <p style={styles.stateDesc}>{message}</p>
      <button
        style={styles.retryBtn}
        onClick={() => window.location.reload()}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Try again
      </button>
    </div>
  );
}

function ContactHint() {
  return <p style={styles.hint}>Need help? Reply to the invitation email you received.</p>;
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    gap: "32px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "absolute",
    top: "28px",
    left: "32px",
  },
  brandName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "var(--text-1)",
    letterSpacing: "-0.01em",
  },
  card: {
    background: "#19191b",
    border: "1px solid #2e2e33",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  progressTrack: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "rgba(255, 255, 255, 0.04)",
    overflow: "hidden" as const,
    borderRadius: "2px",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, rgba(129, 140, 248, 0.6), rgba(99, 102, 241, 0.9))",
    borderRadius: "2px",
    transition: "width 0.4s ease, opacity 0.6s ease",
  },
  contentTransition: {
    transition: "opacity 0.35s ease, transform 0.35s ease",
  },
  stateWrap: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  spinnerOuter: {
    position: "relative" as const,
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  spinnerGlow: {
    position: "absolute" as const,
    inset: "-4px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(129, 140, 248, 0.15), transparent 70%)",
    animation: "pulse 2s ease-in-out infinite",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(34, 197, 94, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  dotsWrap: {
    display: "flex",
    gap: "6px",
    marginTop: "4px",
  },
  dot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(161, 161, 170, 0.4)",
    animation: "dotBounce 1.2s ease-in-out infinite",
  } as React.CSSProperties,
  stateTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#fafafa",
    letterSpacing: "-0.02em",
  },
  stateDesc: {
    fontSize: "14px",
    color: "#a1a1aa",
    lineHeight: "1.6",
    maxWidth: "320px",
  },
  hint: {
    fontSize: "12px",
    color: "#71717a",
    marginTop: "8px",
  },
  retryBtn: {
    marginTop: "12px",
    padding: "10px 24px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
};
