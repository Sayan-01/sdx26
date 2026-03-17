"use client";

import React from "react";
import { 
  Settings, 
  CreditCard, 
  User, 
  Building, 
  Shield, 
  Bell,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import DashboardHeading from "../_components/dashboard-heading";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      <DashboardHeading title="Settings" description="Manage your agency profile, billing, and notification preferences." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="space-y-1">
            {["Profile", "Agency", "Billing", "Security", "Notifications"].map((item) => (
               <Button key={item} variant="ghost" className={cn(
                  "w-full justify-start font-medium",
                  item === "Profile" ? "bg-zinc-900 text-white" : "text-zinc-500"
               )}>
                  {item}
               </Button>
            ))}
         </div>

         <div className="md:col-span-3 space-y-8">
            <Card className="bg-zinc-900 border-zinc-800 shadow-none">
               <CardHeader className="border-b border-zinc-800/50">
                  <CardTitle className="text-lg">Agency Profile</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xl">PP</div>
                     <div className="space-y-2">
                        <Button variant="outline" size="sm" className="border-zinc-800">Change Logo</Button>
                        <p className="text-xs text-zinc-500">Recommended size: 400x400px. JPG, PNG or SVG.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agency Name</label>
                        <Input defaultValue="Pixel Perfect" className="bg-zinc-950 border-zinc-800" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Website URL</label>
                        <Input defaultValue="pixelperfect.com" className="bg-zinc-950 border-zinc-800" />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 shadow-none border-dashed">
               <CardHeader className="border-b border-zinc-800/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <CreditCard className="h-5 w-5 text-zinc-500" />
                     Subscription Plan
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold">Pro Monthly</h3>
                           <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">ACTIVE</span>
                        </div>
                        <p className="text-sm text-zinc-500">$49/month • Next billing on April 10, 2026</p>
                     </div>
                     <Button className="bg-white text-zinc-950 hover:bg-zinc-200">Manage Plan</Button>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[
                        { label: "Active Projects", used: 3, total: 10 },
                        { label: "Team Members", used: 4, total: "Unlimited" },
                        { label: "Storage", used: "2.4GB", total: "50GB" },
                     ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                           <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                           <p className="text-lg font-bold">{stat.used} <span className="text-zinc-700 text-sm font-normal">/ {stat.total}</span></p>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="ghost" className="text-zinc-500">Discard Changes</Button>
               <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-8">Save Settings</Button>
            </div>
         </div>
      </div>
    </div>
  );
}

// Fixed cn import
import { cn } from "@/lib/utils";
