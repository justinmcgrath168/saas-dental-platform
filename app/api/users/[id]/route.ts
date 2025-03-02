// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";

// Validation schema for updating a user
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  locationIds: z.array(z.string()).optional(),
  primaryLocationId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// GET endpoint to fetch a single user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Check permissions
    const canViewAnyUser = hasPermission(
      session.user.permissions,
      "users:view"
    );
    const canViewSelf =
      hasPermission(session.user.permissions, "users:view-self") &&
      session.user.id === userId;

    if (!canViewAnyUser && !canViewSelf) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Fetch user with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        locations: {
          select: {
            location: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
              },
            },
            isPrimary: true,
          },
        },
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                code: true,
                name: true,
                module: true,
              },
            },
            granted: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check organization access if not admin or self
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "TENANT_ADMIN" &&
      session.user.id !== userId &&
      user.organization.id !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    const body = await req.json();

    // Validate request body
    const validatedData = updateUserSchema.parse(body);

    // Check permissions
    const canUpdateAnyUser = hasPermission(
      session.user.permissions,
      "users:update"
    );
    const canUpdateSelf =
      hasPermission(session.user.permissions, "users:update-self") &&
      session.user.id === userId;

    if (!canUpdateAnyUser && !canUpdateSelf) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Fetch current user to check organization
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check organization access if not admin or self
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "TENANT_ADMIN" &&
      session.user.id !== userId &&
      currentUser.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Check if email is being changed and already exists
    if (validatedData.email && validatedData.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Restrict role changes based on session user's role
    if (validatedData.role && session.user.role !== "SUPER_ADMIN") {
      // Check if trying to escalate privileges
      if (
        validatedData.role === "SUPER_ADMIN" ||
        (session.user.role !== "TENANT_ADMIN" &&
          validatedData.role === "TENANT_ADMIN")
      ) {
        return NextResponse.json(
          {
            error: "Cannot assign a role with higher privileges than your own",
          },
          { status: 403 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      isActive: validatedData.isActive,
    };

    // Hash password if provided
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 10);
    }

    // Update user in a transaction to handle locations and permissions
    await prisma.$transaction(async (tx) => {
      // Update user basic info
      await tx.user.update({
        where: { id: userId },
        data: updateData,
      });

      // Handle location updates if provided
      if (validatedData.locationIds) {
        // Delete existing location associations
        await tx.userLocation.deleteMany({
          where: { userId },
        });

        // Validate all locations belong to the organization
        const locations = await tx.location.findMany({
          where: {
            id: { in: validatedData.locationIds },
            organizationId: currentUser.organizationId,
          },
        });

        if (locations.length !== validatedData.locationIds.length) {
          throw new Error(
            "One or more locations don't belong to the organization"
          );
        }

        // Create new location associations
        for (const locationId of validatedData.locationIds) {
          await tx.userLocation.create({
            data: {
              userId,
              locationId,
              isPrimary: validatedData.primaryLocationId === locationId,
            },
          });
        }
      } else if (validatedData.primaryLocationId) {
        // Just update primary location
        await tx.userLocation.updateMany({
          where: {
            userId,
            locationId: validatedData.primaryLocationId,
          },
          data: { isPrimary: true },
        });

        await tx.userLocation.updateMany({
          where: {
            userId,
            locationId: { not: validatedData.primaryLocationId },
          },
          data: { isPrimary: false },
        });
      }

      // Handle permissions if provided
      if (validatedData.permissions) {
        // Check if user has permission to modify permissions
        if (
          !hasPermission(session.user.permissions, "users:manage-permissions")
        ) {
          throw new Error("No permission to modify user permissions");
        }

        // Delete existing permissions
        await tx.userPermission.deleteMany({
          where: { userId },
        });

        // Validate permissions exist
        const permissions = await tx.permission.findMany({
          where: {
            code: { in: validatedData.permissions },
          },
        });

        if (permissions.length !== validatedData.permissions.length) {
          throw new Error("One or more permissions don't exist");
        }

        // Create new permission associations
        for (const permissionCode of validatedData.permissions) {
          const permission = permissions.find((p) => p.code === permissionCode);
          if (permission) {
            await tx.userPermission.create({
              data: {
                userId,
                permissionId: permission.id,
                granted: true,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;

    // Check permissions - only admins can delete users
    if (!hasPermission(session.user.permissions, "users:delete")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Fetch current user to check organization
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check organization access if not super admin or tenant admin
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "TENANT_ADMIN" &&
      currentUser.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Delete user (cascades to related records due to schema design)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}
