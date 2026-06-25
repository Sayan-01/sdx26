
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.agencyId) {
    return NextResponse.json({ activePlan: "basic" });
  }

  const agency = await prisma.agency.findUnique({
    where: { id: session.user.agencyId },
    select: { activePlan: true },
  });

  return NextResponse.json({ activePlan: agency?.activePlan || "basic" });
}
