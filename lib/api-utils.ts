// lib/api-utils.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasPermission } from "./permissions";

/**
 * Checks if the user is authenticated
 */
export async function requireAuth(req: NextRequest, permissionCode?: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (
    permissionCode &&
    !hasPermission(session.user.permissions, permissionCode)
  ) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    session,
  };
}

/**
 * Handles API errors with appropriate status codes and messages
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "An error occurred"
) {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || defaultMessage },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: defaultMessage }, { status: 500 });
}
