// app/(client-portal)/portal/[token]/page.tsx
// Client lands here when they click the magic link
// Verifies token → sets session cookie → redirects to /dashboard

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckIcon, ClockIcon, LockIcon, XIcon } from "lucide-react";

type State = "verifying" | "redirecting" | "already_used" | "expired" | "invalid" | "error";

export default function PortalEntryPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [state, setState] = useState<State>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

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
          }, 800);
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
        {state === "verifying" && <VerifyingState />}
        {state === "redirecting" && <RedirectingState />}
        {state === "already_used" && <AlreadyUsedState />}
        {state === "expired" && <ExpiredState />}
        {state === "invalid" && <InvalidState />}
        {state === "error" && <ErrorState message={errorMsg} />}
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
      <div className="spinner" />
      <p style={styles.stateTitle}>Opening your portal</p>
      <p style={styles.stateDesc}>Verifying your access link...</p>
    </div>
  );
}

function RedirectingState() {
  return (
    <div style={styles.stateWrap}>
      <div style={styles.iconWrap}>
        <CheckIcon />
      </div>
      <p style={styles.stateTitle}>You're in!</p>
      <p style={styles.stateDesc}>Taking you to your project...</p>
    </div>
  );
}

function AlreadyUsedState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "var(--amber-bg)" }}>
        <LockIcon color="var(--amber)" />
      </div>
      <p style={styles.stateTitle}>Link already used</p>
      <p style={styles.stateDesc}>This link can only be used once. If your session expired or you're on a new device, contact your agency for a new link.</p>
      <ContactHint />
    </div>
  );
}

function ExpiredState() {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "var(--amber-bg)" }}>
        <ClockIcon color="var(--amber)" />
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
      <div style={{ ...styles.iconWrap, background: "var(--red-bg)" }}>
        <XIcon color="var(--red)" />
      </div>
      <p style={styles.stateTitle}>Invalid link</p>
      <p style={styles.stateDesc}>This link doesn't exist or has been revoked. Please contact your agency.</p>
      <ContactHint />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={styles.stateWrap}>
      <div style={{ ...styles.iconWrap, background: "var(--red-bg)" }}>
        <XIcon color="var(--red)" />
      </div>
      <p style={styles.stateTitle}>Something went wrong</p>
      <p style={styles.stateDesc}>{message}</p>
      <button
        style={styles.retryBtn}
        onClick={() => window.location.reload()}
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
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center" as const,
  },
  stateWrap: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "var(--green-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  stateTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "var(--text-1)",
    letterSpacing: "-0.02em",
  },
  stateDesc: {
    fontSize: "14px",
    color: "var(--text-2)",
    lineHeight: "1.6",
    maxWidth: "320px",
  },
  hint: {
    fontSize: "12px",
    color: "var(--text-3)",
    marginTop: "8px",
  },
  retryBtn: {
    marginTop: "8px",
    padding: "8px 20px",
    background: "var(--accent)",
    color: "var(--accent-fg)",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
