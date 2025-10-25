import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    console.log("Session data:", session);
    console.log("User ID:", session?.user?.id);

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const { name, email, phone, profileImage } = data;

    // Update user profile using user ID or email
    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const updatedUser = await prisma.user.update({
      where: whereClause,
      data: {
        name,
        email,
        phone,
        image: profileImage || undefined,
      },
    });

    console.log("Updated user from database:", updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
