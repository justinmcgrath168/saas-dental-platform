// app/api/tenants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for creating a tenant
const createTenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  logoUrl: z.string().url("Logo must be a valid URL").optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code")
    .optional(),
  adminName: z.string().min(1, "Admin name is required"),
  adminEmail: z.string().email("Admin email must be valid"),
  adminPassword: z
    .string()
    .min(8, "Admin password must be at least 8 characters"),
  planType: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE", "CUSTOM"]),
});

// GET endpoint to fetch tenants with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can list all tenants
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";

    // Construct where clause
    let whereClause: any = {};

    // Add search filter
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { subdomain: { contains: search } },
        ],
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch tenants with count
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: whereClause,
        include: {
          organizations: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          subscriptions: {
            select: {
              id: true,
              planType: true,
              startDate: true,
              endDate: true,
              isActive: true,
            },
            orderBy: {
              startDate: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              organizations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.tenant.count({ where: whereClause }),
    ]);

    // Format response
    const formattedTenants = tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      logoUrl: tenant.logoUrl,
      primaryColor: tenant.primaryColor,
      createdAt: tenant.createdAt,
      organizationCount: tenant._count.organizations,
      currentSubscription: tenant.subscriptions[0] || null,
      organizations: tenant.organizations,
    }));

    return NextResponse.json({
      tenants: formattedTenants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants", details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new tenant
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if request is from public signup or admin creation
    const isPublicSignup = req.headers.get("x-public-signup") === "true";

    // If not public signup, require super admin authentication
    if (!isPublicSignup) {
      if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();

    // Validate request body
    const validatedData = createTenantSchema.parse(body);

    // Check if subdomain already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain: validatedData.subdomain },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "Subdomain already in use" },
        { status: 400 }
      );
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Admin email already in use" },
        { status: 400 }
      );
    }

    // Create tenant, organization, and admin user in a transaction
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash(
      validatedData.adminPassword,
      10
    );

    const result = await prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: validatedData.name,
          subdomain: validatedData.subdomain,
          logoUrl: validatedData.logoUrl,
          primaryColor: validatedData.primaryColor,
        },
      });

      // Create subscription
      const subscription = await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          planType: validatedData.planType,
          startDate: new Date(),
          // For free tier, set an end date 30 days from now
          endDate:
            validatedData.planType === "FREE"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : null,
          isActive: true,
          autoRenew: validatedData.planType !== "FREE",
        },
      });

      // Create default organization (dental clinic)
      const organization = await tx.organization.create({
        data: {
          tenantId: tenant.id,
          name: validatedData.name,
          type: "DENTAL_CLINIC",
        },
      });

      // Create default location
      const location = await tx.location.create({
        data: {
          organizationId: organization.id,
          name: "Main Office",
          address: "Please update",
          city: "Please update",
          state: "Please update",
          zipCode: "00000",
          isMain: true,
        },
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          name: validatedData.adminName,
          email: validatedData.adminEmail,
          password: hashedPassword,
          role: "TENANT_ADMIN",
          organizationId: organization.id,
          isActive: true,
        },
      });

      // Create user-location association
      await tx.userLocation.create({
        data: {
          userId: user.id,
          locationId: location.id,
          isPrimary: true,
        },
      });

      // Set up default permissions for admin
      const allPermissions = await tx.permission.findMany();

      for (const permission of allPermissions) {
        await tx.userPermission.create({
          data: {
            userId: user.id,
            permissionId: permission.id,
            granted: true,
          },
        });
      }

      return {
        tenant,
        organization,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    });

    return NextResponse.json(
      {
        message: "Tenant created successfully",
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          subdomain: result.tenant.subdomain,
        },
        organization: {
          id: result.organization.id,
          name: result.organization.name,
        },
        admin: result.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating tenant:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create tenant", details: error.message },
      { status: 500 }
    );
  }
}
