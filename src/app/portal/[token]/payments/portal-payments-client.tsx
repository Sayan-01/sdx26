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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import DashboardHeading from "@/app/dashboard/_components/dashboard-heading";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { format } from "date-fns";

export default function PortalPaymentsClient({ token, invoices }: { token: string; invoices: any[] }) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Calculate Stats
  const totalValue = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const amountSettled = invoices.filter(inv => inv.status === "PAID").reduce((acc, inv) => acc + Number(inv.amount), 0);
  const pendingBalance = invoices.filter(inv => inv.status === "PENDING").reduce((acc, inv) => acc + Number(inv.amount), 0);
  
  const pendingInvoices = invoices.filter(inv => inv.status === "PENDING").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextInvoiceDate = pendingInvoices.length > 0 && pendingInvoices[0].date ? format(new Date(pendingInvoices[0].date), "MMM dd") : "None";

  const stats = [
    { label: "Total Value", value: `$${totalValue.toLocaleString()}`, icon: <TrendingUp className="h-4 w-4" />, color: "text-zinc-400", bg: "bg-zinc-400/10" },
    { label: "Amount Settled", value: `$${amountSettled.toLocaleString()}`, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Balance", value: `$${pendingBalance.toLocaleString()}`, icon: <DollarSign className="h-4 w-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Next Invoice", value: nextInvoiceDate, icon: <Clock className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10 h-full">
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
          <div key={i} className="relative flex items-center gap-4 p-5 rounded-xl bg-[#19191b] border border-dashboard-border group card_shadow transition-all duration-300 hover:border-zinc-700 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 border border-dashboard-border/50", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate">{stat.label}</p>
              {isLoading ? (
                <div className="h-6 w-12 bg-zinc-800/50 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-xl font-bold text-white truncate mt-0.5">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <DashboardCard
          title="Invoice History"
          icon={<Receipt className="h-4 w-4 text-indigo-400" />}
          className="lg:col-span-2 h-full w-full"
          extra={
            <Button variant="ghost" size="sm" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest h-6">
              Download All
            </Button>
          }
        >
          <div className="divide-y divide-zinc-800/60 overflow-y-auto box min-h-[300px]">
            {invoices.length === 0 ? (
               <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center justify-center h-full min-h-[300px]">
                 <Receipt className="h-10 w-10 text-zinc-700 mb-4 opacity-50" />
                 <p>No invoices generated yet.</p>
               </div>
            ) : (
               invoices.map((inv) => (
                 <div
                   key={inv.id}
                   className="flex w-full hover:bg-zinc-900/50 transition-colors group px-6 py-5 items-center"
                 >
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
                     <div className="flex items-center gap-5">
                       <div className={cn(
                         "w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 shadow-inner group-hover:scale-105",
                         inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                       )}>
                         <Receipt className="h-6 w-6" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm sm:text-base tracking-tight leading-tight">
                           {inv.title}
                         </h3>
                         <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                           <span>{inv.invoiceId}</span>
                           <span>•</span>
                           <span>{inv.date ? format(new Date(inv.date), "MMM dd, yyyy") : "N/A"}</span>
                           {inv.method && <span>• {inv.method}</span>}
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center justify-between sm:justify-end gap-10 sm:w-auto w-full pl-16 sm:pl-0">
                       <div className="text-right flex flex-col items-end gap-0.5">
                          <span className="text-lg font-bold text-white tracking-tight">${Number(inv.amount).toLocaleString()}</span>
                          {inv.due && <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{inv.due}</span>}
                       </div>
                       <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-22 h-6 px-3 flex items-center justify-center rounded-md text-[10px] font-bold uppercase tracking-wider border",
                           inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                         )}>
                           {inv.status}
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-zinc-300" disabled={!inv.invoiceUrl}>
                            <Download className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))
            )}
          </div>
        </DashboardCard>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <DashboardCard title="Saved Wallet" icon={<CreditCard className="h-4 w-4 text-indigo-400" />}>
             <div className="p-5 flex flex-col gap-4">
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
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
