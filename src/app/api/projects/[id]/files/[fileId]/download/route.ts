import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import prisma from "@/lib/db";
import { getClientSession } from "@/lib/client-session";
import { getSignedFileUrl } from "@/lib/imagekit-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const { id: projectId, fileId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const versionId = searchParams.get("versionId");
    const versionNumber = searchParams.get("versionNumber");
    const jsonMode = searchParams.get("json") === "true";

    // 1. Authorize: Check Agency user or Client
    let isAuthorized = false;

    const userSession = await auth();
    if (userSession?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: userSession.user.id },
        select: { agencyId: true },
      });

      if (user?.agencyId) {
        const project = await prisma.project.findFirst({
          where: { id: projectId, agencyId: user.agencyId },
          select: { id: true },
        });
        if (project) isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const clientSession = await getClientSession();
      if (clientSession?.projectId === projectId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access to project asset." },
        { status: 401 }
      );
    }

    // 2. Fetch File & Versions
    const file = await prisma.file.findFirst({
      where: { id: fileId, projectId },
      include: {
        fileVersions: {
          orderBy: { versionNumber: "desc" },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    // Determine target URL and filename
    let targetUrl = file.url;
    let targetFileName = file.fileName;

    if (versionId) {
      const version = file.fileVersions.find((v) => v.id === versionId);
      if (version) {
        targetFileName = version.fileName || targetFileName;
        if (version.storageKey) {
          try {
            if (version.storageKey.startsWith("{")) {
              const parsed = JSON.parse(version.storageKey);
              targetUrl = parsed.url || targetUrl;
            } else if (version.storageKey.startsWith("http")) {
              targetUrl = version.storageKey;
            }
          } catch {
            // fallback to version.storageKey if URL
            if (version.storageKey.startsWith("http")) {
              targetUrl = version.storageKey;
            }
          }
        }
      }
    } else if (versionNumber) {
      const vNum = parseInt(versionNumber, 10);
      const version = file.fileVersions.find((v) => v.versionNumber === vNum);
      if (version) {
        targetFileName = version.fileName || targetFileName;
        if (version.storageKey) {
          try {
            if (version.storageKey.startsWith("{")) {
              const parsed = JSON.parse(version.storageKey);
              targetUrl = parsed.url || targetUrl;
            } else if (version.storageKey.startsWith("http")) {
              targetUrl = version.storageKey;
            }
          } catch {
            if (version.storageKey.startsWith("http")) {
              targetUrl = version.storageKey;
            }
          }
        }
      }
    }

    // If external link, redirect directly
    if (file.fileType && file.fileType.toLowerCase().startsWith("link")) {
      if (jsonMode) {
        return NextResponse.json({ url: targetUrl, isExternal: true });
      }
      return NextResponse.redirect(targetUrl);
    }

    // Generate secure signed URL with 5-minute expiry
    const signedUrl = getSignedFileUrl(targetUrl, 300);

    if (jsonMode) {
      return NextResponse.json({
        url: signedUrl,
        fileName: targetFileName,
        expiresIn: 300,
      });
    }

    return NextResponse.redirect(signedUrl);
  } catch (err: any) {
    console.error("[Download Route] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate download URL." },
      { status: 500 }
    );
  }
}
