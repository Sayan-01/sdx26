import CreateAgencyForm from "@/components/forms/createAgencyForm";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function CreateAgencyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // If user already has an agency, redirect to dashboard
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { agencyId: true },
  });

  if (user?.agencyId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CreateAgencyForm />
    </div>
  );
}
