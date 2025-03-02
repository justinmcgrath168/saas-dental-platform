"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrgType } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Package,
  FileText,
  Printer,
} from "lucide-react";

interface DashboardStatsProps {
  organizationType: string;
}

interface StatItem {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}

export default function DashboardStats({
  organizationType,
}: DashboardStatsProps) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch data from the API
    // For now, we'll use mock data based on organization type
    const fetchStats = async () => {
      setLoading(true);

      try {
        // This would be a real API call
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();

        // Instead, we'll create mock data based on organization type
        let mockStats: StatItem[] = [];

        switch (organizationType) {
          case OrgType.DENTAL_CLINIC:
            mockStats = [
              {
                title: "Patients",
                value: 2547,
                description: "Total registered patients",
                icon: <Users className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 12.5,
                  trend: "up",
                },
              },
              {
                title: "Appointments",
                value: 28,
                description: "Scheduled today",
                icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Revenue",
                value: formatCurrency(24635),
                description: "This month",
                icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 7.2,
                  trend: "up",
                },
              },
              {
                title: "Treatments",
                value: 187,
                description: "Completed this month",
                icon: <Activity className="h-4 w-4 text-muted-foreground" />,
              },
            ];
            break;

          case OrgType.DENTAL_LAB:
            mockStats = [
              {
                title: "Active Cases",
                value: 87,
                description: "In production",
                icon: (
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                ),
              },
              {
                title: "New Cases",
                value: 12,
                description: "Received today",
                icon: <FileText className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Revenue",
                value: formatCurrency(32150),
                description: "This month",
                icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 4.3,
                  trend: "up",
                },
              },
              {
                title: "Turnaround Time",
                value: "3.2 days",
                description: "Average completion time",
                icon: <Activity className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 0.5,
                  trend: "down",
                },
              },
            ];
            break;

          case OrgType.IMAGING_CENTER:
            mockStats = [
              {
                title: "Scans",
                value: 156,
                description: "Completed this month",
                icon: <Printer className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 8.7,
                  trend: "up",
                },
              },
              {
                title: "Appointments",
                value: 18,
                description: "Scheduled today",
                icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Revenue",
                value: formatCurrency(41250),
                description: "This month",
                icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 5.9,
                  trend: "up",
                },
              },
              {
                title: "Referrals",
                value: 42,
                description: "New this month",
                icon: <Users className="h-4 w-4 text-muted-foreground" />,
              },
            ];
            break;

          case OrgType.SUPPLIER:
            mockStats = [
              {
                title: "Orders",
                value: 243,
                description: "This month",
                icon: <Package className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 12.1,
                  trend: "up",
                },
              },
              {
                title: "Revenue",
                value: formatCurrency(87450),
                description: "This month",
                icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 6.3,
                  trend: "up",
                },
              },
              {
                title: "Customers",
                value: 78,
                description: "Active accounts",
                icon: <Users className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Inventory Items",
                value: 1254,
                description: "In stock",
                icon: <Package className="h-4 w-4 text-muted-foreground" />,
                change: {
                  value: 2.5,
                  trend: "down",
                },
              },
            ];
            break;

          default:
            mockStats = [
              {
                title: "Users",
                value: 24,
                description: "Active users",
                icon: <Users className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Revenue",
                value: formatCurrency(25000),
                description: "This month",
                icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Activity",
                value: 156,
                description: "This week",
                icon: <Activity className="h-4 w-4 text-muted-foreground" />,
              },
              {
                title: "Growth",
                value: "12%",
                description: "This month",
                icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
              },
            ];
        }

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [organizationType]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-[140px] animate-pulse">
            <CardContent className="p-6">
              <div className="bg-gray-200 h-6 w-24 rounded-md mb-2"></div>
              <div className="bg-gray-200 h-10 w-32 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-4 w-48 rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.change && (
                <>
                  {stat.change.trend === "up" ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  ) : stat.change.trend === "down" ? (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                  ) : null}
                  <span
                    className={
                      stat.change.trend === "up"
                        ? "text-green-600"
                        : stat.change.trend === "down"
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {stat.change.value}%
                  </span>
                  <span className="ml-1">from last month</span>
                </>
              )}
              {!stat.change && stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
