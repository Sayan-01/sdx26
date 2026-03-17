"use client";

import React, { useState } from "react";
import { Settings, CreditCard, User, Building, Shield, Bell, Check, Download, Smartphone, Laptop, Globe, LogOut, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import DashboardHeading from "../_components/dashboard-heading";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { id: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "Agency", icon: <Building className="h-4 w-4" /> },
    { id: "Billing", icon: <CreditCard className="h-4 w-4" /> },
    { id: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-5">
      <DashboardHeading
        title="Settings"
        description="Manage your agency profile, billing, and notification preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={cn("w-full justify-start font-medium gap-3", activeTab === tab.id ? "bg-[#19191b] text-white" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white")}
            >
              {tab.icon}
              {tab.id}
            </Button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "Profile" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription className="text-zinc-500">Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#19191b] border border-dashboard-border flex items-center justify-center font-bold text-xl text-zinc-400 overflow-hidden">
                      <User className="h-8 w-8 text-zinc-600" />
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        // size="sm"
                        className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800"
                      >
                        Upload Avatar
                      </Button>
                      <p className="text-xs text-zinc-500">Recommended size: 256x256px. JPG, PNG or GIF.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">First Name</label>
                      <Input
                        defaultValue="John"
                        className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                      <Input
                        defaultValue="Doe"
                        className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                      <Input
                        defaultValue="john.doe@example.com"
                        type="email"
                        className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Agency Settings */}
          {activeTab === "Agency" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg">Agency Profile</CardTitle>
                  <CardDescription className="text-zinc-500">Your agency details, visible to clients and team members.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-[#19191b] border border-dashboard-border flex items-center justify-center font-bold text-xl text-zinc-400">PP</div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800"
                      >
                        Change Logo
                      </Button>
                      <p className="text-xs text-zinc-500">Recommended size: 400x400px. JPG, PNG or SVG.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Agency Name</label>
                      <Input
                        defaultValue="Pixel Perfect"
                        className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Website URL</label>
                      <Input
                        defaultValue="pixelperfect.com"
                        className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Timezone</label>
                      <select className="w-full h-10 px-3 py-2 rounded-md bg-[#19191b] border border-dashboard-border focus-visible:ring-zinc-700 text-sm focus-visible:outline-none">
                        <option>Pacific Time (PT) - US & Canada</option>
                        <option>Eastern Time (ET) - US & Canada</option>
                        <option>Greenwich Mean Time (GMT) - Europe</option>
                        <option>Central European Time (CET) - Europe</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === "Billing" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Card className="bg-[#19191b] border-dashboard-border shadow-none border-dashed hover:border-solid transition-all">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-zinc-500" />
                    Subscription Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">Pro Monthly</h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">ACTIVE</span>
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
                      <div
                        key={stat.label}
                        className="p-4 rounded-xl bg-[#19191b] border border-dashboard-border/50"
                      >
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-zinc-200">
                          {stat.used} <span className="text-zinc-600 text-sm font-normal">/ {stat.total}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-zinc-500" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60 overflow-hidden">
                  <div className="divide-y divide-zinc-800/60 box">
                    {[
                      { date: "Mar 10, 2026", amount: "$49.00", status: "Paid", invoice: "INV-2045" },
                      { date: "Feb 10, 2026", amount: "$49.00", status: "Paid", invoice: "INV-1920" },
                      { date: "Jan 10, 2026", amount: "$49.00", status: "Paid", invoice: "INV-1804" },
                    ].map((bill, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4 hover:bg-zinc-900/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{bill.amount} - Pro Plan</p>
                          <p className="text-xs text-zinc-500">{bill.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">{bill.status}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2 text-zinc-400 hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "Security" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg">Change Password</CardTitle>
                  <CardDescription className="text-zinc-500">Ensure your account is using a long, random password.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60">
                  <div className="space-y-2 max-w-md">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Current Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-[#19191b] border-dashboard-border focus-visible:ring-zinc-700"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800"
                    >
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Active Sessions</CardTitle>
                    <CardDescription className="text-zinc-500 mt-1">Manage and log out your active sessions on other devices.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60 overflow-hidden">
                  <div className="divide-y divide-zinc-800/60 box">
                    {[
                      { device: "MacBook Pro", browser: "Chrome on macOS", location: "New York, USA", time: "Active now", icon: <Laptop className="h-5 w-5 text-zinc-400" />, current: true },
                      { device: "iPhone 13", browser: "Safari on iOS", location: "New York, USA", time: "2 hours ago", icon: <Smartphone className="h-5 w-5 text-zinc-400" />, current: false },
                    ].map((session, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-full bg-[#19191b] border border-dashboard-border flex items-center justify-center shrink-0">{session.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{session.device}</p>
                              {session.current && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">This Device</span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {session.browser} • {session.location} • {session.time}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 group gap-2"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "Notifications" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription className="text-zinc-500">Choose what updates you want to receive via email.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60 overflow-hidden">
                  <div className="divide-y divide-zinc-800/60 box">
                    {[
                      { title: "New Project Invitations", desc: "When you are added to a new project", checked: true },
                      { title: "Comments & Mentions", desc: "When someone tags you in a comment", checked: true },
                      { title: "Task Assignments", desc: "When you are assigned a new task", checked: true },
                      { title: "Billing Updates", desc: "Invoices, renewals, and payment failures", checked: true },
                      { title: "Marketing & Newsletter", desc: "Product updates and announcements", checked: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-row items-center justify-between px-6 py-4"
                      >
                        <div className="space-y-0.5">
                          <label className="text-sm font-medium text-white">{item.title}</label>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.checked} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#19191b] border-dashboard-border shadow-none">
                <CardHeader className="border-b border-dashboard-border/50">
                  <CardTitle className="text-lg">In-App Notifications</CardTitle>
                  <CardDescription className="text-zinc-500">Configure your realtime alerts inside the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 bg-[#151518] rounded-b-xl border-t border-dashboard-border/60 overflow-hidden">
                  <div className="divide-y divide-zinc-800/60 box">
                    <div className="flex flex-row items-center justify-between px-6 py-4">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-white">Pause all notifications</label>
                        <p className="text-xs text-zinc-500">Temporarily suspend all non-critical alerts.</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    <div className="flex flex-row items-center justify-between px-6 py-4">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium text-white">Browser Push Notifications</label>
                        <p className="text-xs text-zinc-500">Receive alerts even when the dashboard is closed.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-dashboard-border bg-[#19191b] hover:bg-zinc-800 text-xs"
                      >
                        Enable Push
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 mt-6">
            <Button
              variant="ghost"
              className="text-zinc-500 hover:text-white hover:bg-zinc-800/50"
            >
              Discard Changes
            </Button>
            <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-8">Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
