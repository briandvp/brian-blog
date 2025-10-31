import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { ADMIN_PERMISSIONS } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request, ADMIN_PERMISSIONS.MANAGE_USERS)
    if ('error' in auth) return auth

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}