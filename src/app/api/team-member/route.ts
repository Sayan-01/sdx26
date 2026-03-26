import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import crypto from "crypto";
import { sendInviteEmaill } from "@/lib/sendPortalUrl";

export const POST = async (req: NextRequest) => {
  try {
    console.log("POST request received at /api/team-member");
    const { name, email, designation: rawDesignation } = await req.json();
    console.log("Input data:", { name, email, rawDesignation });

    const session = await auth();
    console.log("Session:", !!session);

    if (!name || !email || !rawDesignation) {
      return NextResponse.json({ error: "Please fill all the details" }, { status: 400 });
    }

    const designation = rawDesignation.toUpperCase();

    const agencyId = session?.user.agencyId;
    if (!agencyId) {
      console.log("Agency ID missing in session");
      return NextResponse.json({ error: "No agency found for this session" }, { status: 403 });
    }

    // Check if user exists globally by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("User exists globally:", email);
      // If user exists, check if they are already a member of this agency
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          userId: user.id,
          agencyId,
        },
      });

      if (existingMember) {
        console.log("User is already a member of this agency");
        return NextResponse.json({ error: "This user is already a member of your agency" }, { status: 400 });
      }
    } else {
      console.log("Creating new user for invitation:", email);
      // Create new user if they don't exist
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: null,
          role: "TEAM",
          agencyId,
        },
      });
    }

    console.log("Processing team member for user:", user.id);

    // Create team member record
    await prisma.teamMember.create({
      data: {
        userId: user.id,
        agencyId,
        role: "TEAM",
        designation: designation,
      },
    });

    console.log("Team member created");

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Clear any previous invitations for this email in this agency to avoid unique constraint errors
    await prisma.invitation.deleteMany({
      where: {
        email,
        agencyId,
      },
    });

    await prisma.invitation.create({
      data: {
        agencyId,
        email,
        designation: designation as any,
        token: token,
        invitedById: session?.user.id as string,
        expiresAt: expiresAt,
      },
    });

    console.log("Invitation created");

    await prisma.activityLog.create({
      data: {
        agencyId,
        actorUserId: session?.user.id as string,
        action: "team_member.created",
        entityType: "TEAM_MEMBER",
        entityId: user.id,
        metadata: {
          email: user.email,
          name: user.name,
          role: "TEAM",
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
