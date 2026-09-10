"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Loader2, ArrowRight, Lock, LogIn } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { completeInvitationForNewUser, acceptExistingUserInvitation } from "@server/teamMember";
import { toast } from "sonner";

interface SetupPasswordFormProps {
  token: string;
  email: string;
  name: string;
  agencyName: string;
  userExist?: boolean;
  currentLoggedInEmail?: string;
}

export default function SetupPasswordForm({
  token,
  email,
  name,
  agencyName,
  userExist,
  currentLoggedInEmail,
}: SetupPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isEmailMismatch = Boolean(
    currentLoggedInEmail && currentLoggedInEmail.toLowerCase() !== email.toLowerCase()
  );

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);

      // 🔥 EXISTING USER
      if (userExist) {
        const res = await acceptExistingUserInvitation(token);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success("You have joined the agency!");
        router.push("/dashboard");
        return;
      }

      // 🔥 NEW USER
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const res = await completeInvitationForNewUser(token, name, password);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Account created successfully!");
      router.push(`/auth/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Layers className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {name}!</h1>
          <p className="text-zinc-400">
            You've been invited to join <span className="text-white font-medium">{agencyName}</span>.
            {userExist
              ? " You already have an account — confirm below to join."
              : " Set your password to get started."}
          </p>
        </div>
      </div>

      {/* EXISTING USER */}
      {userExist ? (
        <div className="space-y-6">
          <FieldGroup>
            <Field>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Email Address</label>
              <Input
                className="rounded-lg h-12 border-zinc-800 border bg-zinc-900/50 opacity-60 cursor-not-allowed"
                value={email}
                disabled
              />
            </Field>
          </FieldGroup>

          {isEmailMismatch ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm text-center space-y-3">
              <p>
                You are currently logged in as <strong className="text-white">{currentLoggedInEmail}</strong>, but this invitation was sent to <strong className="text-white">{email}</strong>.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  const { signOut } = await import("next-auth/react");
                  await signOut({ callbackUrl: `/auth/login?callbackUrl=/invite/${token}&email=${encodeURIComponent(email)}` });
                }}
                className="w-full text-xs border-amber-500/40 text-amber-200 hover:bg-amber-500/20"
              >
                Switch Account
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-400 text-center">
                You already have an account. Click below to accept the invitation and join the agency.
              </p>

              <Button
                onClick={handleAcceptInvitation}
                className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Accept & Join Agency
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      ) : (

        /* NEW USER */
        <div className="space-y-6">
          <FieldGroup>
            <Field>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Email Address</label>
              <Input
                className="rounded-lg h-12 border-zinc-800 border bg-zinc-900/50 opacity-60 cursor-not-allowed"
                value={email}
                disabled
              />
            </Field>

            <Field>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">New Password</label>
              <div className="relative">
                <Input
                  type="password"
                  className="rounded-lg h-12 border-zinc-800 border pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </Field>

            <Field>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">Confirm Password</label>
              <div className="relative">
                <Input
                  type="password"
                  className="rounded-lg h-12 border-zinc-800 border pl-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </Field>
          </FieldGroup>

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <Button
            onClick={handleAcceptInvitation}
            className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Account & Join
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
