import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.AUTH_SECRET
);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // 1. Find token
    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
      include: {
        client: true,
        project: true,
      },
    });

    // 2. Checks
    if (!magicLink) {
      return NextResponse.json({ error: "Invalid link" }, { status: 404 });
    }

    if (magicLink.usedAt) {
      return NextResponse.json({ error: "This link has already been used" }, { status: 410 });
    }

    if (magicLink.expiresAt < new Date()) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    // 3. Update usedAt (prevent race condition)
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { usedAt: new Date() },
    });

    // 4. Generate JWT
    const jwt = await new SignJWT({
      clientId: magicLink.clientId,
      projectId: magicLink.projectId,
      agencyId: magicLink.agencyId,
      clientEmail: magicLink.clientEmail,
      token: token,
      type: "client_session",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(SESSION_SECRET);

    // 5. Set cookie
    const cookieStore = await cookies();
    cookieStore.set("client_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // 6. Activity log
    await prisma.activityLog.create({
      data: {
        agencyId: magicLink.agencyId,
        projectId: magicLink.projectId,
        actorClientId: magicLink.clientId,
        action: "client.portal_accessed",
        entityType: "PROJECT",
        entityId: magicLink.projectId,
        metadata: {
            token: token
        }
      },
    });

    return NextResponse.json({
      success: true,
      projectId: magicLink.projectId,
      clientId: magicLink.clientId,
    });
  } catch (error) {
    console.error("Magic link verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
