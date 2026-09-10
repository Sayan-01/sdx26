import React from "react";
import SetupPasswordForm from "@/components/auth/SetupPasswordForm";
import { Layers } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { verifyInvitationToken } from "../../../../server/teamMember";
import { auth } from "../../../../auth";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  // Verify invitation token
  const data = await verifyInvitationToken(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 selection_color">
        <div className="space-y-8 flex flex-col items-center animate-in fade-in duration-1000 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 border border-zinc-800">
            <Layers className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-red-500">Invalid Link</h1>
            <p className="text-zinc-500 max-w-sm">This invitation link has expired, already been used, or is invalid. Please contact your agency owner for a new invite.</p>
          </div>
        </div>
      </div>
    );
  }

  const { email, name, agencyName, userExist } = data;
  const session = await auth();

  // If the user already has an account and is NOT logged in, redirect to login with callbackUrl
  if (userExist && !session) {
    redirect(`/auth/login?callbackUrl=/invite/${token}&email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 selection_color selection:bg-white selection:text-zinc-950">
      <SetupPasswordForm 
        token={token} 
        email={email} 
        name={name}
        agencyName={agencyName} 
        userExist={userExist}
        currentLoggedInEmail={session?.user?.email ?? undefined}
      />
    </div>
  );
}

