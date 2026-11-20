import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import prisma from "@/lib/db";
import { getClientSession } from "@/lib/client-session";
import { getImageKitAuthParams } from "@/lib/imagekit-server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    let isAuthorized = false;

    // 1. Check Agency user session (NextAuth)
    const userSession = await auth();
    if (userSession?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: userSession.user.id },
        select: { agencyId: true },
      });

      if (user?.agencyId) {
        if (!projectId) {
          // General agency access
          isAuthorized = true;
        } else {
          // Verify project belongs to user's agency
          const project = await prisma.project.findFirst({
            where: { id: projectId, agencyId: user.agencyId },
            select: { id: true },
          });
          if (project) {
            isAuthorized = true;
          }
        }
      }
    }

    // 2. Check Client session (JWT in cookies)
    if (!isAuthorized) {
      const clientSession = await getClientSession();
      if (clientSession?.projectId) {
        if (!projectId || projectId === clientSession.projectId) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. You do not have permission to upload assets to this workspace." },
        { status: 401 }
      );
    }

    const authParams = getImageKitAuthParams();
    return NextResponse.json(authParams);
  } catch (error: any) {
    console.error("[ImageKit Auth Route] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate ImageKit authentication parameters." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
