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
}

export default function SetupPasswordForm({
  token,
  email,
  name,
  agencyName,
  userExist,
}: SetupPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      router.push("/login");
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
              ? " You already have an account — just confirm to join."
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

          <p className="text-sm text-zinc-400 text-center">
            You already have a MileStack account. Click below to login and join the agency.
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
                Login & Join Agency
                <LogIn className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
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
