"use client";

import React, { useState } from "react";
import { ArrowLeft, UserPlus, Mail, Shield, Briefcase, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DashboardHeading from "../../_components/dashboard-heading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteFormSchema } from "../../../../../validators/invite-form-validator";
import { FieldError } from "@/components/ui/field";

export default function InviteTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      designation: "",
      role: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/team-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSuccess("Invitation sent successfully");
        form.reset();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <DashboardHeading
          title="Invite Team Member"
          description="Send an invitation to a new member to join your agency workspace."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#19191b] border-dashboard-border shadow-none overflow-hidden">
            <CardHeader className="border-b border-dashboard-border/50 bg-[#1e1e21]/30 p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-400" />
                Invitation Details
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Enter the information for the person you want to invite.</CardDescription>
            </CardHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <UserPlus className="h-3 w-3" /> Full Name
                  </label>
                  <Input
                    placeholder="e.g. Rachel Zane"
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700 h-11"
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="rachel@agency.com"
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700 h-11"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="h-3 w-3" /> Designation
                  </label>
                  <select
                    {...form.register("designation")}
                    className="w-full h-11 px-3! py-2 rounded-md bg-[#19191b] border border-dashboard-border focus-visible:ring-zinc-700 text-sm focus-visible:outline-none text-zinc-200"
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="DESIGNER">Designer</option>
                    <option value="HR">HR</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                  </select>
                  <FieldError errors={[form.formState.errors.role]} />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="h-3 w-3" /> Role & Permissions
                  </label>
                  <select
                    {...form.register("role")}
                    className="w-full h-11 px-3 py-2 rounded-md bg-[#19191b] border border-dashboard-border focus-visible:ring-zinc-700 text-sm focus-visible:outline-none text-zinc-200"
                  >
                    <option value="TEAM">Regular team Member</option>
                    <option value="admin">Administrator</option>
                    <option value="guest">Guest / Contractor</option>
                  </select>
                  <FieldError errors={[form.formState.errors.role]} />
                </div>
              </div>

              <div className="pt-4 border-t border-dashboard-border/30 flex items-center justify-between gap-4">
                <p className="text-xs text-zinc-500 italic max-w-sm">An invitation link will be sent to the email provided above. They will need to accept it to join.</p>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="text-zinc-500 hover:text-white hover:bg-zinc-800"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="bg-white text-zinc-950 hover:bg-zinc-200 px-4 transition-all hover:scale-105 active:scale-95"
                  >
                    {loading ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#19191b] border-dashboard-border shadow-none border-dashed border-2 p-1">
            <CardContent className="bg-[#151518]/50 rounded-xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-zinc-200">Invite Tip</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Admins can manage projects, invite other members, and view agency-wide analytics. Members are restricted to their assigned projects.
              </p>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            <h4 className="font-bold text-sm mb-2">Need more seats?</h4>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Your current plan includes 10 team seats. Contact support to increase your limit.</p>
            <Button
              variant="outline"
              className="w-full border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-widest font-bold font-mono"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
