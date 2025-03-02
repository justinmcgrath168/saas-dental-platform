// hooks/use-permissions.ts
import { useSession } from "next-auth/react";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type PermissionCode,
} from "@/lib/permissions";

/**
 * Custom hook for checking user permissions in React components
 *
 * Returns an object with functions to check different permission scenarios:
 * - can: Check if the user has a specific permission
 * - canAny: Check if the user has any of the specified permissions
 * - canAll: Check if the user has all of the specified permissions
 * - permissions: The user's permissions array
 * - role: The user's role
 * - isLoading: Whether the session is currently loading
 */
export function usePermissions() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const permissions = session?.user?.permissions || [];
  const role = session?.user?.role;

  /**
   * Check if the user has a specific permission
   *
   * @param permission The permission code to check
   * @returns boolean indicating if the user has the permission
   */
  const can = (permission: PermissionCode): boolean => {
    if (!session?.user) return false;
    return hasPermission(permissions, permission);
  };

  /**
   * Check if the user has any of the specified permissions
   *
   * @param permissionList Array of permission codes to check against
   * @returns boolean indicating if the user has any of the permissions
   */
  const canAny = (permissionList: PermissionCode[]): boolean => {
    if (!session?.user) return false;
    return hasAnyPermission(permissions, permissionList);
  };

  /**
   * Check if the user has all of the specified permissions
   *
   * @param permissionList Array of permission codes to check against
   * @returns boolean indicating if the user has all of the permissions
   */
  const canAll = (permissionList: PermissionCode[]): boolean => {
    if (!session?.user) return false;
    return hasAllPermissions(permissions, permissionList);
  };

  /**
   * Check if the user is assigned a specific role
   *
   * @param roleToCheck The role to check against
   * @returns boolean indicating if the user has the role
   */
  const hasRole = (roleToCheck: string): boolean => {
    if (!session?.user?.role) return false;
    return session.user.role === roleToCheck;
  };

  /**
   * Check if the user has any of the specified roles
   *
   * @param rolesToCheck Array of roles to check against
   * @returns boolean indicating if the user has any of the roles
   */
  const hasAnyRole = (rolesToCheck: string[]): boolean => {
    if (!session?.user?.role) return false;
    return rolesToCheck.includes(session.user.role);
  };

  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    permissions,
    role,
    isLoading,
    isAuthenticated: !!session?.user,
  };
}

/**
 * Helper hook for conditionally rendering UI based on permissions
 *
 * @param requiredPermission The permission required to view the component
 * @returns boolean indicating if the component should be rendered
 *
 * Usage:
 * ```
 * const canViewUsers = useHasPermission('users:list');
 *
 * if (canViewUsers) {
 *   // Render UI
 * }
 * ```
 */
export function useHasPermission(requiredPermission: PermissionCode): boolean {
  const { can } = usePermissions();
  return can(requiredPermission);
}

/**
 * Higher-order component for permission-based component rendering
 *
 * @param Component The component to render if the user has permission
 * @param permission The permission required to view the component
 * @param fallback Optional fallback component to render if permission is denied
 *
 * Usage:
 * ```
 * const ProtectedUserList = withPermission(UserList, 'users:list');
 *
 * // Or with a fallback
 * const ProtectedUserList = withPermission(UserList, 'users:list', AccessDenied);
 * ```
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: PermissionCode,
  FallbackComponent?: React.ComponentType<any>
) {
  return function PermissionGuard(props: P) {
    const { can, isLoading } = usePermissions();

    if (isLoading) {
      return null; // Or a loading spinner
    }

    if (can(permission)) {
      return <Component {...props} />;
    }

    if (FallbackComponent) {
      return <FallbackComponent />;
    }

    return null;
  };
}
