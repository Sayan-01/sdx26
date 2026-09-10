import LoginForm from "@/components/auth/LoginFormZod";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl || "/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
};

export default page;
