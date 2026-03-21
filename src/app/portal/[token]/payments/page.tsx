"use client";

import React from "react";
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Download,
  CreditCard,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  ShieldCheck,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";

export default function ClientPaymentsPage() {
  const invoices = [
    { 
      id: "INV-2026-001", 
      title: "Discovery & Strategy", 
      status: "paid", 
      amount: 500, 
      date: "Mar 05, 2026",
      method: "Visa •••• 4242"
    },
    { 
      id: "INV-2026-002", 
      title: "UI/UX Design Phase", 
      status: "pending", 
      amount: 1500, 
      date: "Mar 25, 2026",
      due: "In 6 days"
    },
  ];

  const stats = [
    { label: "Total Value", value: "$4,000", icon: <TrendingUp className="h-4 w-4" />, color: "text-zinc-400", bg: "bg-zinc-400/10" },
    { label: "Amount Settled", value: "$500", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Balance", value: "$3,500", icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Next Invoice", value: "Mar 25", icon: <Clock className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeading 
          title="Finance & Billing" 
          description="Manage your project investments, review invoices, and track payment history." 
        />
        <Button className="bg-white text-zinc-950 hover:bg-zinc-200 shadow-md gap-2 font-medium">
          <CreditCard className="h-4 w-4" />
          Pay Balance
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-none bg-[#151518] hover:bg-zinc-900/70 transition-colors border-dashboard-border group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors uppercase tracking-widest">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg transition-colors duration-300", stat.bg, stat.color)}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 border-dashboard-border border rounded-xl bg-[#19191b] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-3 mb-1">
            <h2 className="text-md font-semibold flex items-center gap-2">Invoice History</h2>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest h-6">
              Download All
            </Button>
          </div>

          <Card className="bg-[#151518] shadow-none flex-1 flex flex-col overflow-hidden p-0 border-0 border-t border-dashboard-border rounded-none">
            <div className="divide-y divide-zinc-800/60 overflow-y-auto box">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex w-full hover:bg-zinc-900/50 transition-colors group px-6 min-h-[95px] items-center border-b border-dashboard-border last:border-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-11 h-11 rounded-xl border border-dashboard-border/50 flex items-center justify-center transition-all duration-300 shrink-0 shadow-inner",
                        inv.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-400"
                      )}>
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base tracking-tight leading-tight">
                          {inv.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                          <span>{inv.id}</span>
                          <span>•</span>
                          <span>{inv.date}</span>
                          {inv.method && <span>• {inv.method}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-10 sm:w-auto w-full pl-16 sm:pl-0">
                      <div className="text-right flex flex-col items-end gap-0.5">
                         <span className="text-lg font-bold text-white tracking-tight">${inv.amount}</span>
                         {inv.due && <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{inv.due}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-22 h-6 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                          inv.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {inv.status}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-zinc-300">
                           <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-3 min-h-0 border-dashboard-border border rounded-xl bg-[#19191b] p-5">
             <h2 className="text-md font-semibold flex items-center gap-2 mb-2">Saved Wallet</h2>
             <Card className="bg-[#151518] shadow-none border-dashboard-border/60 p-6 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="w-10 h-7 bg-zinc-800 rounded-md border border-dashboard-border/30 flex items-center justify-center">
                      <div className="w-5 h-2 bg-zinc-700 rounded-sm" />
                   </div>
                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                   <p className="font-mono text-zinc-300 tracking-wider text-sm">•••• •••• •••• 4242</p>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">VISA Default • Exp 12/28</p>
                </div>
                <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest border-dashboard-border hover:bg-zinc-800 h-9">
                   Manage Method
                </Button>
             </Card>

             <div className="mt-2 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/20 border border-dashboard-border/30">
                   <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                   <div>
                      <p className="text-xs font-bold text-zinc-300">Secure Payments</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">All transactions are encrypted with AES-256 standard and PCI certified.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/20 border border-dashboard-border/30 group cursor-pointer hover:bg-zinc-800/40 transition-colors">
                   <Building className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                   <div className="flex-1">
                      <p className="text-xs font-bold text-zinc-300">Bank Transfer</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Pay via SEPA, SWIFT or domestic ACH. View instructions.</p>
                   </div>
                   <ArrowUpRight className="h-3 w-3 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
