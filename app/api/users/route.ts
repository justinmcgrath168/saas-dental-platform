// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import { requireAuth } from "@/lib/api-utils";

// Validation schema for creating a user
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole),
  organizationId: z.string().min(1, "Organization ID is required"),
  locationIds: z.array(z.string()).optional(),
  primaryLocationId: z.string().optional(),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional(),
});

// Helper to build the query filter based on parameters
const buildUserFilter = (query: URLSearchParams, session: any) => {
  let whereClause: any = {};

  // By default, users can only see users in their own organization
  // unless they are a SUPER_ADMIN or TENANT_ADMIN with proper permissions
  const canSeeAllOrganizations =
    (session.user.role === "SUPER_ADMIN" ||
      session.user.role === "TENANT_ADMIN") &&
    hasPermission(session.user.permissions, "users:list-all");

  if (!canSeeAllOrganizations) {
    whereClause.organizationId = session.user.organizationId;
  } else if (query.get("organizationId")) {
    // If they can see all orgs but an org filter is provided
    whereClause.organizationId = query.get("organizationId");
  }

  // Add search filter
  const search = query.get("search");
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add role filter
  const role = query.get("role");
  if (role) {
    whereClause.role = role;
  }

  // Add active filter
  if (query.has("isActive")) {
    whereClause.isActive = query.get("isActive") === "true";
  }

  return whereClause;
};

// GET endpoint to fetch users with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    // Check authentication and permissions
    const auth = await requireAuth(req, "users:list");
    if (!auth.success) return auth.response;

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Build filter
    const whereClause = buildUserFilter(url.searchParams, session);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch users with count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
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
                },
              },
              isPrimary: true,
            },
          },
          // Don't include password
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permission to create users
    if (!hasPermission(session.user.permissions, "users:create")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validatedData = createUserSchema.parse(body);

    // Ensure the user can only create users in their organization
    // unless they're a SUPER_ADMIN or TENANT_ADMIN
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "TENANT_ADMIN" &&
      validatedData.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json(
        { error: "Cannot create user for another organization" },
        { status: 403 }
      );
    }

    // Validate the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user in a transaction to handle locations and permissions
    const newUser = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: validatedData.role,
          organizationId: validatedData.organizationId,
          isActive: validatedData.isActive,
        },
      });

      // Handle location associations if provided
      if (validatedData.locationIds && validatedData.locationIds.length > 0) {
        // Validate all locations belong to the organization
        const locations = await tx.location.findMany({
          where: {
            id: { in: validatedData.locationIds },
            organizationId: validatedData.organizationId,
          },
        });

        if (locations.length !== validatedData.locationIds.length) {
          throw new Error(
            "One or more locations don't belong to the organization"
          );
        }

        // Create location associations
        for (const locationId of validatedData.locationIds) {
          await tx.userLocation.create({
            data: {
              userId: user.id,
              locationId,
              isPrimary: validatedData.primaryLocationId === locationId,
            },
          });
        }
      }

      // Handle permissions if provided
      if (validatedData.permissions && validatedData.permissions.length > 0) {
        // Validate permissions exist
        const permissions = await tx.permission.findMany({
          where: {
            code: { in: validatedData.permissions },
          },
        });

        if (permissions.length !== validatedData.permissions.length) {
          throw new Error("One or more permissions don't exist");
        }

        // Create permission associations
        for (const permissionCode of validatedData.permissions) {
          const permission = permissions.find((p) => p.code === permissionCode);
          if (permission) {
            await tx.userPermission.create({
              data: {
                userId: user.id,
                permissionId: permission.id,
                granted: true,
              },
            });
          }
        }
      }

      return user;
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organizationId: newUser.organizationId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}
