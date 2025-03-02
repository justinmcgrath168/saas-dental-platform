// hooks/use-tenant.ts
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  primaryColor: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: string;
  name: string;
  type: string;
}

interface CurrentSubscription {
  id: string;
  planType: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

interface TenantDetails extends Tenant {
  organizations: Organization[];
  currentSubscription: CurrentSubscription | null;
}

/**
 * Custom hook for accessing the current tenant in React components.
 *
 * Returns:
 * - tenant: The current tenant details
 * - isLoading: Whether the tenant is currently being loaded
 * - error: Any error that occurred while loading the tenant
 * - organization: The current organization from the session
 * - refetchTenant: Function to refetch the tenant data
 */
export function useTenant() {
  const { data: session, status } = useSession();
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Get current subdomain
  const getCurrentSubdomain = (): string | null => {
    if (typeof window === "undefined") return null;

    const hostname = window.location.hostname;
    if (hostname === "localhost") return null;

    // For development with localhost:3000
    if (hostname.includes("localhost:3000")) {
      const subdomain = hostname.split(".")[0];
      return subdomain === "localhost" ? null : subdomain;
    }

    // For production
    const parts = hostname.split(".");
    if (parts.length > 2) {
      return parts[0];
    }

    return null;
  };

  const fetchTenant = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have a session, fetch the tenant from the session
      if (session?.user?.tenantId) {
        const response = await fetch(`/api/tenants/${session.user.tenantId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch tenant data");
        }

        const data = await response.json();
        setTenant(data);
        return;
      }

      // Otherwise, try to get the tenant from the subdomain
      const subdomain = getCurrentSubdomain();
      if (subdomain) {
        const response = await fetch(
          `/api/tenants/by-subdomain?subdomain=${subdomain}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tenant data");
        }

        const data = await response.json();
        setTenant(data);
        return;
      }

      // If we don't have a session or subdomain, we don't have a tenant
      setTenant(null);
    } catch (err) {
      console.error("Error fetching tenant:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    fetchTenant();
  }, [session, status]);

  // Get current organization from session
  const organization = session?.user
    ? {
        id: session.user.organizationId,
        name: session.user.organizationName,
        type: session.user.organizationType,
      }
    : null;

  return {
    tenant,
    isLoading: status === "loading" || isLoading,
    error,
    organization,
    refetchTenant: fetchTenant,
  };
}

/**
 * Helper hook to access tenant branding for styling components
 *
 * Returns:
 * - primaryColor: The tenant's primary color or default
 * - logoUrl: The tenant's logo URL or null
 * - isLoading: Whether the tenant is currently being loaded
 */
export function useTenantBranding() {
  const { tenant, isLoading } = useTenant();

  const primaryColor = tenant?.primaryColor || "#2563eb"; // Default blue
  const logoUrl = tenant?.logoUrl || null;

  return {
    primaryColor,
    logoUrl,
    isLoading,
  };
}

/**
 * Helper hook to check if the current subscription is active
 *
 * Returns:
 * - isActive: Whether the subscription is active
 * - daysRemaining: Number of days remaining in the current subscription period
 * - planType: The current plan type
 * - isLoading: Whether the tenant is currently being loaded
 */
export function useSubscriptionStatus() {
  const { tenant, isLoading } = useTenant();
  const subscription = tenant?.currentSubscription;

  const isActive = subscription?.isActive || false;

  let daysRemaining = 0;
  if (subscription?.endDate) {
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const differenceInTime = endDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  return {
    isActive,
    daysRemaining,
    planType: subscription?.planType || "FREE",
    isLoading,
  };
}
