"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  CalendarDays,
  Stethoscope,
  CreditCard,
  Building2,
  Microscope,
  FileText,
  Box,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BadgeHelp,
  BarChart,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  tenant: {
    name: string;
    logoUrl: string | null;
    primaryColor: string | null;
  };
  userRole: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiredPermissions: string[];
  children?: {
    title: string;
    href: string;
    requiredPermissions: string[];
  }[];
}

export default function Sidebar({ tenant, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { canAny } = usePermissions();

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation items with permission requirements
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      requiredPermissions: [],
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users size={20} />,
      requiredPermissions: ["users:list"],
    },
    {
      title: "Patients",
      href: "/patients",
      icon: <Tooth size={20} />,
      requiredPermissions: ["patients:list"],
      children: [
        {
          title: "All Patients",
          href: "/patients",
          requiredPermissions: ["patients:list"],
        },
        {
          title: "Patient Groups",
          href: "/patients/groups",
          requiredPermissions: ["patients:list"],
        },
        {
          title: "Patient Portal",
          href: "/patients/portal",
          requiredPermissions: ["patients:list"],
        },
      ],
    },
    {
      title: "Appointments",
      href: "/appointments",
      icon: <CalendarDays size={20} />,
      requiredPermissions: ["appointments:list"],
      children: [
        {
          title: "Calendar",
          href: "/appointments/calendar",
          requiredPermissions: ["appointments:list"],
        },
        {
          title: "Appointment List",
          href: "/appointments",
          requiredPermissions: ["appointments:list"],
        },
        {
          title: "Scheduling Rules",
          href: "/appointments/rules",
          requiredPermissions: ["appointments:list"],
        },
      ],
    },
    {
      title: "Treatments",
      href: "/treatments",
      icon: <Stethoscope size={20} />,
      requiredPermissions: ["treatments:list"],
    },
    {
      title: "Invoices",
      href: "/invoices",
      icon: <CreditCard size={20} />,
      requiredPermissions: ["invoices:list"],
    },
    {
      title: "Lab Cases",
      href: "/lab-cases",
      icon: <Microscope size={20} />,
      requiredPermissions: ["lab-cases:list"],
    },
    {
      title: "Imaging",
      href: "/imaging",
      icon: <FileText size={20} />,
      requiredPermissions: ["imaging:list"],
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: <Box size={20} />,
      requiredPermissions: ["inventory:list"],
    },
    {
      title: "Orders",
      href: "/orders",
      icon: <ShoppingBag size={20} />,
      requiredPermissions: ["orders:list"],
    },
    {
      title: "Organizations",
      href: "/organizations",
      icon: <Building2 size={20} />,
      requiredPermissions: ["organizations:list"],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart size={20} />,
      requiredPermissions: ["users:list"],
      children: [
        {
          title: "Financial Reports",
          href: "/reports/financial",
          requiredPermissions: ["invoices:list"],
        },
        {
          title: "Productivity Reports",
          href: "/reports/productivity",
          requiredPermissions: ["users:list"],
        },
        {
          title: "Patient Reports",
          href: "/reports/patients",
          requiredPermissions: ["patients:list"],
        },
      ],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
      requiredPermissions: ["users:view-self"],
      children: [
        {
          title: "Profile",
          href: "/settings/profile",
          requiredPermissions: ["users:view-self"],
        },
        {
          title: "Organization",
          href: "/settings/organization",
          requiredPermissions: ["organizations:view"],
        },
        {
          title: "Subscription",
          href: "/settings/subscription",
          requiredPermissions: ["users:view-self"],
        },
      ],
    },
    {
      title: "Help & Support",
      href: "/support",
      icon: <BadgeHelp size={20} />,
      requiredPermissions: [],
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(
    (item) =>
      item.requiredPermissions.length === 0 ||
      canAny(item.requiredPermissions as any)
  );

  // Check if a route is active
  const isRouteActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Toggle sidebar collapse on desktop
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Generate sidebar classes based on state
  const sidebarClasses = cn(
    "bg-white h-full border-r flex flex-col transition-all duration-300",
    {
      "w-64": !collapsed && !isMobile,
      "w-20": collapsed && !isMobile,
      "fixed inset-y-0 left-0 z-50 shadow-lg": isMobile,
      "w-64 translate-x-0": isMobile && isOpen,
      "w-64 -translate-x-full": isMobile && !isOpen,
    }
  );

  // Mobile overlay backdrop
  const overlayClasses = cn(
    "fixed inset-0 bg-black/50 z-40 transition-opacity",
    {
      "opacity-100 pointer-events-auto": isMobile && isOpen,
      "opacity-0 pointer-events-none": !isMobile || !isOpen,
    }
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div className={overlayClasses} onClick={toggleSidebar} />

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="fixed bottom-4 left-4 z-50 bg-primary text-white p-2 rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Logo and title */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 overflow-hidden"
          >
            {tenant.logoUrl ? (
              <Image
                src={tenant.logoUrl}
                alt={tenant.name}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center text-white"
                style={{ backgroundColor: tenant.primaryColor || "#2563eb" }}
              >
                {tenant.name.charAt(0)}
              </div>
            )}
            {(!collapsed || isMobile) && (
              <span className="font-semibold truncate">{tenant.name}</span>
            )}
          </Link>

          {/* Collapse toggle button - desktop only */}
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="text-gray-500 hover:text-gray-700"
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          )}

          {/* Close button - mobile only */}
          {isMobile && isOpen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <ScrollArea className="flex-1">
          <nav className="px-2 py-4">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = isRouteActive(item.href);

                return (
                  <li key={item.href}>
                    {item.children ? (
                      <details
                        className="group"
                        open={item.children.some((child) =>
                          isRouteActive(child.href)
                        )}
                      >
                        <summary
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md cursor-pointer outline-none",
                            {
                              "bg-gray-100 text-primary": item.children.some(
                                (child) => isRouteActive(child.href)
                              ),
                              "text-gray-700 hover:bg-gray-100":
                                !item.children.some((child) =>
                                  isRouteActive(child.href)
                                ),
                            }
                          )}
                        >
                          <div className="flex items-center flex-1 space-x-3">
                            <span className="flex-shrink-0">{item.icon}</span>
                            {(!collapsed || isMobile) && (
                              <span className="font-medium">{item.title}</span>
                            )}
                          </div>
                        </summary>

                        {(!collapsed || isMobile) && (
                          <ul className="mt-1 ml-7 space-y-1">
                            {item.children
                              .filter(
                                (child) =>
                                  child.requiredPermissions.length === 0 ||
                                  canAny(child.requiredPermissions as any)
                              )
                              .map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "block px-3 py-2 rounded-md text-sm",
                                      {
                                        "bg-gray-100 text-primary":
                                          isRouteActive(child.href),
                                        "text-gray-700 hover:bg-gray-100":
                                          !isRouteActive(child.href),
                                      }
                                    )}
                                  >
                                    {child.title}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        )}
                      </details>
                    ) : collapsed && !isMobile ? (
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-center p-2 rounded-md",
                              {
                                "bg-gray-100 text-primary": isActive,
                                "text-gray-700 hover:bg-gray-100": !isActive,
                              }
                            )}
                          >
                            {item.icon}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md space-x-3",
                          {
                            "bg-gray-100 text-primary": isActive,
                            "text-gray-700 hover:bg-gray-100": !isActive,
                          }
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
