"use client";

import React, { useState } from "react";
import { ExternalLink, RefreshCw, CheckCircle2, Copy, Send, Mail, Shield, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PortalClient({ projectId, initialPortalUrl }: { projectId: string; initialPortalUrl: string | null }) {
  const [loading, setLoading] = useState(false);
  const [portalUrl, setPortalUrl] = useState(initialPortalUrl || "");

  const generateLink = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/magic-link`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setPortalUrl(data.portalUrl);
        toast.success("New magic link generated and sent to client!");
      } else {
        toast.error(data.error || "Failed to generate link");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Client Portal Access</h1>
        <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed">
          Generate and manage secure, expiring access links for your client. This link allows the client to view project status, approve milestones, and upload resources without needing a password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Status Card */}
        <Card className="lg:col-span-2 bg-[#151518] border-dashboard-border shadow-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Shield className="w-48 h-48 text-indigo-500" />
          </div>
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Zap className="h-4 w-4 text-indigo-400" />
              </div>
              <CardTitle className="text-lg font-bold">Portal Access Token</CardTitle>
            </div>
            <CardDescription className="text-zinc-500 text-xs">Each link is valid for 7 days. Once clicked, it creates a persistent 30-day session on the client's browser.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 relative z-10">
            {portalUrl ? (
              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">Live Access Link</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3.5 bg-black/40 border border-dashboard-border rounded-xl font-mono text-[10px] text-indigo-300 truncate">{portalUrl}</div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-11 w-11 border-dashboard-border bg-black/40 hover:bg-zinc-800 transition-all active:scale-95"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 bg-black/20 p-4 rounded-xl border border-dashboard-border/30">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p>The client has been notified at their registered email with this secure link.</p>
                </div>
              </div>
            ) : (
              <div className="p-16 rounded-2xl border border-dashed border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-4 bg-black/10">
                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shadow-inner">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-200">No active link session</p>
                  <p className="text-xs text-zinc-500 max-w-[240px] leading-relaxed">Generate a new secure token to grant portal access to your client.</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                onClick={generateLink}
                disabled={loading}
                className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl gap-2.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin text-white/50" /> : <Send className="h-4 w-4" />}
                {portalUrl ? "Regenerate & Re-send Link" : "Generate & Send Portal Access"}
              </Button>

              {portalUrl && (
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 px-6 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl font-bold text-xs uppercase tracking-widest"
                  asChild
                >
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Test Link <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info / Safety Column */}
        <div className="space-y-6">
          <Card className="bg-[#151518] border-dashboard-border shadow-none rounded-2xl">
            <CardHeader className="pb-3 border-b border-dashboard-border/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 font-mono">Access Policy</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <InfoRow
                icon={<RefreshCw className="h-4 w-4" />}
                label="Token Validity"
                text="Unused tokens expire automatically after 7 days for security."
              />
              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label="Secure Session"
                text="Once accessed, the client is granted a 30-day cookie-based session."
              />
              <InfoRow
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                label="Auto-Revoke"
                text="Creating a new link instantly invalidates all previously sent portal links."
              />
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-zinc-900 border border-dashboard-border shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-700" />
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-5 font-mono">Helpful Tip</h4>
            <p className="text-[13px] text-zinc-300 leading-relaxed font-medium">
              If your client loses access or their 30-day session expires, simply come back here to <span className="text-indigo-400">regenerate</span> their access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 shrink-0 text-zinc-600 bg-zinc-800/50 h-8 w-8 rounded-lg flex items-center justify-center border border-dashboard-border/50 transition-colors group-hover:border-zinc-700">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  );
}
