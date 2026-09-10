"use server";

import { signIn, signOut, auth } from "../../auth";
import prisma from "@/lib/db";

export const Goo_login = async (callbackUrl?: string) => {
  await signIn("google", { redirectTo: callbackUrl || "/dashboard" });
};

export const Git_login = async (callbackUrl?: string) => {
  await signIn("github", { redirectTo: callbackUrl || "/dashboard" });
};

export const Sign_Out = async () => {
  await signOut();
};

export const getUserAgency = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  const agency = await prisma.agency.findFirst({
    where: { ownerId: session.user.id }
  });
  return agency;
};
