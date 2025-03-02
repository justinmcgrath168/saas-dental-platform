// app/api/tenants/[tenantId]/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for updating a subscription
const updateSubscriptionSchema = z.object({
  planType: z
    .enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE", "CUSTOM"])
    .optional(),
  endDate: z.string().datetime({ offset: true }).optional().nullable(),
  isActive: z.boolean().optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  autoRenew: z.boolean().optional(),
});

// GET endpoint to fetch a single subscription
export async function GET(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tenantId, id } = params;

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

    // Fetch subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Verify subscription belongs to the tenant
    if (subscription.tenantId !== tenantId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a subscription
export async function PATCH(
  req: NextRequest,
  { params }: { params: { tenantId: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tenantId, id } = params;

    // Only SUPER_ADMIN can update subscriptions
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validatedData = updateSubscriptionSchema.parse(body);

    // Fetch current subscription
    const currentSubscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!currentSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Verify subscription belongs to the tenant
    if (currentSubscription.tenantId !== tenantId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {
      planType: validatedData.planType,
      isActive: validatedData.isActive,
      paymentMethod: validatedData.paymentMethod,
      paymentReference: validatedData.paymentReference,
      autoRenew: validatedData.autoRenew,
    };

    // Handle endDate specifically to allow setting null
    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate
        ? new Date(validatedData.endDate)
        : null;
    }

    // If activating this subscription, deactivate others
    if (validatedData.isActive === true) {
      await prisma.subscription.updateMany({
        where: {
          tenantId,
          id: { not: id },
          isActive: true,
        },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      });
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update subscription", details: error.message },
      { status: 500 }
    );
  }
}
