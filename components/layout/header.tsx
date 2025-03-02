"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Building,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
  organization: {
    id: string;
    name: string;
    type: string;
  };
  tenant: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
}

export default function Header({ user, organization, tenant }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { can } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");

  // Get page title based on current route
  const getPageTitle = () => {
    const route = pathname.split("/")[1] || "dashboard";
    const subRoute = pathname.split("/")[2];

    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      users: "User Management",
      patients: "Patient Management",
      appointments: "Appointments",
      treatments: "Treatments",
      invoices: "Invoices",
      "lab-cases": "Lab Cases",
      imaging: "Imaging",
      inventory: "Inventory",
      orders: "Orders",
      organizations: "Organizations",
      settings: "Settings",
      reports: "Reports",
      support: "Help & Support",
    };

    if (subRoute && route === "settings") {
      const settingsTitles: Record<string, string> = {
        profile: "Profile Settings",
        organization: "Organization Settings",
        subscription: "Subscription Management",
      };
      return settingsTitles[subRoute] || titles[route];
    }

    return titles[route] || "Dashboard";
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu toggle - only shown on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        {/* Search form - hide on smaller screens */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex-1 md:flex md:max-w-md md:mx-4 lg:mx-8"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, appointments, or documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right section: notifications and user menu */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-2 px-4 text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Organization switcher - only for admins with multiple orgs */}
          {can("organizations:list") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex gap-2 items-center"
                >
                  <Building className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">
                    {organization.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/organizations")}
                >
                  Manage Organizations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 items-center hidden md:flex"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role.replace(/_/g, " ")}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {can("organizations:view") && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings/organization">
                      <Building className="mr-2 h-4 w-4" />
                      Organization
                    </Link>
                  </DropdownMenuItem>
                )}
                {(user.role === "SUPER_ADMIN" ||
                  user.role === "TENANT_ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings/subscription">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscription
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/support">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile-only avatar button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
