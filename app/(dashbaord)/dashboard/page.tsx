import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import AppointmentsOverview from "@/components/dashboard/appointments-overview";
import RecentPatients from "@/components/dashboard/recent-patients";
import UpcomingAppointments from "@/components/dashboard/upcoming-appointments";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ActivityFeed from "@/components/dashboard/activity-feed";
import LabCasesOverview from "@/components/dashboard/lab-cases-overview";
import ImagingOverview from "@/components/dashboard/imaging-overview";
import InventoryOverview from "@/components/dashboard/inventory-overview";
import { OrgType } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // This will be handled by the layout component
  }

  // Get organization details including type
  const organization = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    select: {
      id: true,
      name: true,
      type: true,
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!organization) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Organization not found</h1>
        <p>There was an error loading your organization data.</p>
      </div>
    );
  }

  // Get user name
  const userName = session.user.name;

  // Get current date for greeting
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Get time of day for greeting
  const hour = currentDate.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening at {organization.name} today ({formattedDate})
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats organizationType={organization.type} />

      {/* Tab Layout for Organization-Specific Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>

          {/* Conditionally show tabs based on organization type */}
          {organization.type === OrgType.DENTAL_CLINIC && (
            <>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
            </>
          )}

          {organization.type === OrgType.DENTAL_LAB && (
            <TabsTrigger value="cases">Lab Cases</TabsTrigger>
          )}

          {organization.type === OrgType.IMAGING_CENTER && (
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
          )}

          {organization.type === OrgType.SUPPLIER && (
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          )}

          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Common for all organization types */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main content - spans 5 columns on large screens */}
            <div className="col-span-2 lg:col-span-5 space-y-4">
              {/* Organization-specific components */}
              {organization.type === OrgType.DENTAL_CLINIC && (
                <AppointmentsOverview />
              )}

              {organization.type === OrgType.DENTAL_LAB && <LabCasesOverview />}

              {organization.type === OrgType.IMAGING_CENTER && (
                <ImagingOverview />
              )}

              {organization.type === OrgType.SUPPLIER && <InventoryOverview />}

              {/* Revenue chart for all organization types */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    Revenue overview for the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>

            {/* Side content - spans 2 columns on large screens */}
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Appointments Tab - For dental clinics */}
        {organization.type === OrgType.DENTAL_CLINIC && (
          <TabsContent value="appointments" className="space-y-4">
            <UpcomingAppointments />
          </TabsContent>
        )}

        {/* Patients Tab - For dental clinics */}
        {organization.type === OrgType.DENTAL_CLINIC && (
          <TabsContent value="patients" className="space-y-4">
            <RecentPatients />
          </TabsContent>
        )}

        {/* Lab Cases Tab - For dental labs */}
        {organization.type === OrgType.DENTAL_LAB && (
          <TabsContent value="cases" className="space-y-4">
            <LabCasesOverview />
          </TabsContent>
        )}

        {/* Imaging Tab - For imaging centers */}
        {organization.type === OrgType.IMAGING_CENTER && (
          <TabsContent value="imaging" className="space-y-4">
            <ImagingOverview />
          </TabsContent>
        )}

        {/* Inventory Tab - For suppliers */}
        {organization.type === OrgType.SUPPLIER && (
          <TabsContent value="inventory" className="space-y-4">
            <InventoryOverview />
          </TabsContent>
        )}

        {/* Activity Tab - Common for all organization types */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Recent activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Tab - Common for all organization types */}
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Revenue, expenses, and financial metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RevenueChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
