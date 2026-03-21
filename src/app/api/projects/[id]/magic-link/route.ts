import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/../auth";
import crypto from "crypto";
import { sendPortalUrl } from "@/lib/sendPortalUrl";
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = params.id;
  try {
    const project = (await prisma.project.findFirst({
      where: {
        id: projectId,
        agencyId: session.user.agencyId as string,
      },
      include: {
        client: true,
      },
    })) as any;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    // Create new magic link
    await prisma.magicLink.create({
      data: {
        agencyId: project.agencyId,
        projectId: project.id,
        clientId: project.clientId,
        clientEmail: project.client.email,
        token: token,
        expiresAt: expiresAt,
      },
    });
    const portalUrl = `${process.env.NEXT_PUBLIC_URL}/portal/${token}`;

    // Send email
    await sendPortalUrl(project.client.email, project.client.name, portalUrl);
    // Activity log
    await prisma.activityLog.create({
      data: {
        agencyId: project.agencyId,
        projectId: project.id,
        actorUserId: session.user.id,
        action: "portal.link_generated",
        entityType: "PROJECT",
        entityId: project.id,
        metadata: {
          clientEmail: project.client.email,
        },
      },
    });
    return NextResponse.json({ success: true, token, portalUrl });
  } catch (error) {
    console.error("Magic link generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
