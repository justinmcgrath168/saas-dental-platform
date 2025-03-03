// app/(dashboard)/layout.tsx

import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { prisma } from "@/lib/prisma";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // Fetch additional user data that might not be in the session
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          type: true,
          tenant: {
            select: {
              id: true,
              name: true,
              subdomain: true,
              logoUrl: true,
              primaryColor: true,
            },
          },
        },
      },
    },
  });

  // If user record doesn't exist (e.g., it was deleted after session was created)
  if (!user) {
    redirect("/auth/signin?error=UserNotFound");
  }

  // Verify user is active
  if (!user.organization) {
    redirect("/auth/signin?error=OrganizationNotFound");
  }

  // Fetch tenant subscription status
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      tenantId: user.organization.tenant.id,
      isActive: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  // If no active subscription, redirect to subscription page
  // (skip for SUPER_ADMIN as they need access regardless)
  if (!activeSubscription && session.user.role !== "SUPER_ADMIN") {
    redirect("/subscription/expired");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar tenant={user.organization.tenant} userRole={user.role} />

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            user={session.user}
            organization={user.organization}
            tenant={user.organization.tenant}
          />

          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Toaster for notifications */}
        <Toaster />
      </div>
    </SessionProvider>
  );
}
