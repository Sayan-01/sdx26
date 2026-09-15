"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardCard from "@/app/dashboard/_components/dashboard-card";
import { useParams, useSearchParams } from "next/navigation";
import { verifyMilestonePayment } from "../actions";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const milestoneId = searchParams.get("milestoneId");
  
  const [status, setStatus] = useState<"verifying" | "success" | "pending" | "error">("verifying");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!milestoneId) {
      setStatus("success");
      return;
    }

    const checkStatus = async () => {
      try {
        const result = await verifyMilestonePayment(milestoneId);
        if (result.paid) {
          setStatus("success");
        } else if (retryCount < 5) {
          // Retry every 2 seconds for 5 times if not paid yet (waiting for webhook)
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        } else {
          setStatus("pending");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    checkStatus();
  }, [milestoneId, retryCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <DashboardCard className="max-w-md w-full p-8 text-center border-dashboard-border shadow-xl bg-[#19191b]">
        <div className="flex flex-col items-center gap-5">
          {status === "verifying" && (
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          )}

          {(status === "pending" || status === "error") && (
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <CheckCircle2 className="h-10 w-10 text-amber-500 opacity-50" />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {status === "verifying" ? "Verifying Payment..." : 
               status === "success" ? "Payment Successful!" : 
               "Payment Processing"}
            </h1>
            <p className="text-zinc-400 text-sm">
              {status === "verifying" ? "We are confirming your transaction with the payment provider." :
               status === "success" ? "Thank you for your payment. Your transaction has been processed successfully and the milestone has been updated." :
               "Your payment is being processed. It may take a few minutes to reflect in your dashboard."}
            </p>
          </div>

          <div className="w-full pt-4 flex flex-col gap-3">
            <Button asChild className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-bold group">
              <Link href={`/portal/${token}/payments`} className="flex items-center justify-center gap-2">
                {status === "success" ? "View Invoices" : "Return to Payments"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            {status === "success" && (
              <Button asChild variant="outline" className="w-full border-dashboard-border hover:bg-zinc-800 font-bold">
                <Link href={`/portal/${token}/dashboard`}>
                  Go to Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
