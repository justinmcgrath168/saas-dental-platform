// app/api/tenants/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for updating a tenant
const updateTenantSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  logoUrl: z.string().url("Logo must be a valid URL").optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code")
    .optional(),
});

// GET endpoint to fetch a single tenant by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = params.id;

    // Only SUPER_ADMIN or users belonging to the tenant can view the tenant
    if (
      session.user.role !== "SUPER_ADMIN" &&
      session.user.tenantId !== tenantId
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Fetch tenant with related data
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        organizations: {
          select: {
            id: true,
            name: true,
            type: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
        subscriptions: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error: any) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a tenant
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = params.id;

    // Only SUPER_ADMIN or TENANT_ADMIN belonging to the tenant can update
    if (
      session.user.role !== "SUPER_ADMIN" &&
      !(
        session.user.role === "TENANT_ADMIN" &&
        session.user.tenantId === tenantId
      )
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validatedData = updateTenantSchema.parse(body);

    // Fetch current tenant
    const currentTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!currentTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Update tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Tenant updated successfully",
      tenant: updatedTenant,
    });
  } catch (error: any) {
    console.error("Error updating tenant:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update tenant", details: error.message },
      { status: 500 }
    );
  }
}
