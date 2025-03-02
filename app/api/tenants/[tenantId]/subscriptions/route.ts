// app/api/tenants/[tenantId]/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for creating a subscription
const createSubscriptionSchema = z.object({
  planType: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE", "CUSTOM"]),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }).optional(),
  isActive: z.boolean().default(true),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  autoRenew: z.boolean().default(true),
});

// GET endpoint to fetch subscriptions for a tenant
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = params.tenantId;

    // Check permissions - only SUPER_ADMIN or TENANT_ADMIN of this tenant can view
    if (
      session.user.role !== "SUPER_ADMIN" &&
      !(
        session.user.role === "TENANT_ADMIN" &&
        session.user.tenantId === tenantId
      )
    ) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Fetch subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { tenantId },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ subscriptions });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions", details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new subscription
export async function POST(
  req: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = params.tenantId;

    // Only SUPER_ADMIN can create subscriptions
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validatedData = createSubscriptionSchema.parse(body);

    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Deactivate current active subscription
    if (validatedData.isActive) {
      await prisma.subscription.updateMany({
        where: {
          tenantId,
          isActive: true,
        },
        data: {
          isActive: false,
          endDate: new Date(validatedData.startDate),
        },
      });
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        tenantId,
        planType: validatedData.planType,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        isActive: validatedData.isActive,
        paymentMethod: validatedData.paymentMethod,
        paymentReference: validatedData.paymentReference,
        autoRenew: validatedData.autoRenew,
      },
    });

    return NextResponse.json(
      {
        message: "Subscription created successfully",
        subscription,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create subscription", details: error.message },
      { status: 500 }
    );
  }
}
