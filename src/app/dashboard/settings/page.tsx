import React from "react";
import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DashboardHeading from "../_components/dashboard-heading";
import DashboardCard from "../_components/dashboard-card";
import { auth } from "../../../../auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full pb-10">
      <DashboardHeading
        title="Settings"
        description="Manage your agency profile, personal details, and preferences."
      />

      <form className="w-full">
        <DashboardCard
          title="General Settings"
          icon={<Settings className="h-4 w-4 text-zinc-400" />}
        >
          <div className="flex flex-col flex-1">
            <div className="p-8 flex-1 overflow-y-auto">
              <p className="text-zinc-500 text-sm mb-6">Update your account information, agency details, and security preferences.</p>
              
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-zinc-800/60">
                <div className="w-16 h-16 rounded-full bg-[#19191b] border border-dashboard-border flex items-center justify-center font-bold text-xl text-zinc-400 overflow-hidden shrink-0">
                  <User className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm" className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800">
                    Upload Avatar
                  </Button>
                  <p className="text-xs text-zinc-500 mt-2">Recommended size: 256x256px.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">First Name</label>
                  <Input defaultValue={session?.user?.name?.split(' ')[0] || ""} className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                  <Input defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ""} className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <Input defaultValue={session?.user?.email || ""} type="email" className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agency Name</label>
                  <Input defaultValue={session?.user?.agencySlug || "Pixel Perfect"} className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Website URL</label>
                  <Input defaultValue={`${session?.user?.agencySlug || "pixelperfect"}.com`} className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700" />
                </div>

                <div className="space-y-2 md:col-span-2 mt-2">
                  <div className="flex flex-row items-center justify-between p-4 rounded-xl border border-dashboard-border bg-[#19191b]/50">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-white">Email Notifications</label>
                      <p className="text-xs text-zinc-500">Receive important updates via email.</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto border-t border-dashboard-border/60 p-6 flex justify-end gap-3 bg-[#151518]">
              <Button type="button" variant="ghost" className="text-zinc-500 hover:text-white hover:bg-zinc-800/50">
                Discard Changes
              </Button>
              <Button type="submit" className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-8">
                Save Settings
              </Button>
            </div>
          </div>
        </DashboardCard>
      </form>
    </div>
  );
}
