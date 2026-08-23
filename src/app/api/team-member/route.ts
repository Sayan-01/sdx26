   import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import crypto from "crypto";
import { sendInviteEmaill } from "@/lib/sendPortalUrl";
import { getAgencyLimits } from "@/lib/planLimits";
import { InviteStatus } from "@/generated/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, designation: rawDesignation, role: rawRole } = await req.json();

    const session = await auth();

    if (!name || !email || !rawDesignation || !rawRole) {
      return NextResponse.json({ error: "Please fill all the details" }, { status: 400 });
    }

    const designation = rawDesignation.toUpperCase();
    const role = rawRole.toUpperCase();

    const agencyId = session?.user.agencyId;
    if (!agencyId) {
      console.log("Agency ID missing in session");
      return NextResponse.json({ error: "No agency found for this session" }, { status: 403 });
    }

    // Check team member limits
    const currentMemberCount = await prisma.teamMember.count({
      where: { agencyId },
    });
    const limits = await getAgencyLimits(agencyId);
    if (currentMemberCount >= limits.maxTeamMembers) {
      const maxSeatsStr = limits.maxTeamMembers >= 999999 ? "unlimited" : `${limits.maxTeamMembers} seats`;
      return NextResponse.json({ error: `Team member limit reached. Your current plan allows up to ${maxSeatsStr}.` }, { status: 400 });
    }

    // Check if user exists globally by email
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      const alreadyMember = await prisma.teamMember.findUnique({
        where: {
          agencyId_userId: {
            agencyId: agencyId,
            userId: existingUser.id,
          },
        },
      });

      if (alreadyMember) {
        return NextResponse.json({ error: "User is already a team member" }, { status: 400 });
      }
    }

    ///////////////////////////////////////////////////

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Clear any previous invitations for this email in this agency to avoid unique constraint errors
    await prisma.invitation.deleteMany({
      where: {
        email: normalizedEmail,
        agencyId,
      },
    });

    await prisma.invitation.create({
      data: {
        agencyId,
        name: name,
        email: normalizedEmail,
        designation: designation as any,
        token: token,
        invitedById: session?.user.id as string,
        expiresAt: expiresAt,
        status: InviteStatus.PENDING,
      },
    });

    console.log("Invitation created");

    await prisma.activityLog.create({
      data: {
        agencyId,
        actorUserId: session?.user.id as string,
        action: "sent invitation",
        entityType: "INVITATION",
        metadata: {
          email: normalizedEmail,
          name: name,
          designation: designation,
        },
      },
    });

    console.log("Activity log created");

    const inviteLink = `${process.env.NEXT_PUBLIC_URL}invite/${token}`;
    await sendInviteEmaill(email, name, inviteLink);
    console.log("Invitation email sent");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in team-member invitation:", error);
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 });
  }
};
