"use client";

import React, { useEffect, useState } from "react";
import { User, Settings, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DashboardHeading from "../_components/dashboard-heading";
import DashboardCard from "../_components/dashboard-card";
import { getSettingsData, updateSettings, updateAvatar } from "../../../../server/settings";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { update: updateSession } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Original values for discard
  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    agencyName: "",
    websiteUrl: "",
    avatarUrl: null as string | null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getSettingsData();
        if (res.success && res.user) {
          const nameParts = (res.user.name || "").split(" ");
          const fName = nameParts[0] || "";
          const lName = nameParts.slice(1).join(" ") || "";

          setFirstName(fName);
          setLastName(lName);
          setEmail(res.user.email || "");
          setAgencyName(res.user.agencyName || "");
          setWebsiteUrl(res.user.agencySlug ? `${res.user.agencySlug}.com` : "");
          setAvatarUrl(res.user.avatarUrl || null);

          setOriginalValues({
            firstName: fName,
            lastName: lName,
            email: res.user.email || "",
            agencyName: res.user.agencyName || "",
            websiteUrl: res.user.agencySlug ? `${res.user.agencySlug}.com` : "",
            avatarUrl: res.user.avatarUrl || null,
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleDiscard = () => {
    setFirstName(originalValues.firstName);
    setLastName(originalValues.lastName);
    setEmail(originalValues.email);
    setAgencyName(originalValues.agencyName);
    setWebsiteUrl(originalValues.websiteUrl);
    setAvatarUrl(originalValues.avatarUrl);
    setNewPassword("");
    toast.info("Changes discarded");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    setIsSaving(true);
    try {
      const res = await updateSettings({
        firstName,
        lastName,
        email,
        agencyName,
        websiteUrl,
        newPassword: newPassword || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      if (res.success) {
        toast.success("Settings saved successfully");
        setNewPassword("");
        // Update session so the header/sidebar reflect the changes
        await updateSession({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          avatarUrl: avatarUrl,
        });
        setOriginalValues({
          firstName,
          lastName,
          email,
          agencyName,
          websiteUrl,
          avatarUrl,
        });
      } else {
        toast.error(res.error || "Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSave = async () => {
    if (!avatarUrlInput.trim()) {
      toast.error("Please enter an avatar URL");
      return;
    }
    setIsSavingAvatar(true);
    try {
      const res = await updateAvatar(avatarUrlInput.trim());
      if (res.success) {
        setAvatarUrl(avatarUrlInput.trim());
        toast.success("Avatar updated successfully");
        setAvatarDialogOpen(false);
        setAvatarUrlInput("");
        await updateSession({ avatarUrl: avatarUrlInput.trim() });
      } else {
        toast.error(res.error || "Failed to update avatar");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full pb-10 h-full">
        <DashboardHeading
          title="Settings"
          description="Manage your agency profile, personal details, and preferences."
        />
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full pb-10">
      <DashboardHeading
        title="Settings"
        description="Manage your agency profile, personal details, and preferences."
      />
      <form className="w-full" onSubmit={handleSave}>
        <DashboardCard
          title="General Settings"
          icon={<Settings className="h-4 w-4 text-zinc-400" />}
        >
          <div className="flex flex-col flex-1">
            <div className="p-8 flex-1 overflow-y-auto">
              <p className="text-zinc-500 text-sm mb-6">Update your account information, agency details, and security preferences.</p>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800/60">
                <div className="w-16 h-16 rounded-full bg-[#19191b] border border-dashboard-border flex items-center justify-center font-bold text-xl text-zinc-400 overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : (
                    <User className="h-6 w-6 text-zinc-600" />
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAvatarUrlInput(avatarUrl || "");
                      setAvatarDialogOpen(true);
                    }}
                    className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800"
                  >
                    Upload Avatar
                  </Button>
                  <p className="text-xs text-zinc-500 mt-2">Recommended size: 256x256px.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <Input
                    value={email}
                    type="email"
                    disabled
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700 opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agency Name</label>
                  <Input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Website URL</label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                  />
                </div>

                
              </div>
            </div>

            <div className="mt-auto border-t border-dashboard-border/60 p-6 flex justify-end gap-3 bg-[#151518]">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDiscard}
                className="text-zinc-500 hover:text-white hover:bg-zinc-800/50"
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-8 gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </div>
          </div>
        </DashboardCard>
      </form>

      {/* ── Avatar URL Dialog ─────────────────────────────────────────── */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="bg-[#19191b] border-dashboard-border text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Avatar</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Paste your avatar image URL below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {avatarUrlInput && (
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full border border-dashboard-border overflow-hidden bg-[#151518]">
                  <img
                    src={avatarUrlInput}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Image URL</Label>
              <Input
                value={avatarUrlInput}
                onChange={(e) => setAvatarUrlInput(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="bg-[#151518] border-dashboard-border focus-visible:ring-zinc-700"
              />
              <p className="text-xs text-zinc-600">Paste a direct link to your image (PNG, JPG, WebP).</p>
            </div>
          </div>
          <DialogFooter className="bg-transparent border-none p-0 m-0 flex-row gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setAvatarDialogOpen(false)}
              className="bg-transparent border-dashboard-border text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAvatarSave}
              disabled={isSavingAvatar || !avatarUrlInput.trim()}
              className="bg-white text-zinc-950 hover:bg-zinc-200 gap-2"
            >
              {isSavingAvatar && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
