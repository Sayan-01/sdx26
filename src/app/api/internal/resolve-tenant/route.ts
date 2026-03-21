import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Internal secret check — middleware-only route
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const agency = await prisma.agency.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  if (!agency) {
    return NextResponse.json({ error: "Agency not found" }, { status: 404 });
  }

  return NextResponse.json({ agencyId: agency.id });
}
