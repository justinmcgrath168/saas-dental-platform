// lib/permissions.ts
import { UserRole } from "@prisma/client";

/**
 * Defines all available permissions in the system.
 * Format: module:action
 */
export const PERMISSIONS = {
  // User Management
  "users:list": "View list of users",
  "users:list-all": "View users across organizations",
  "users:view": "View user details",
  "users:view-self": "View own user details",
  "users:create": "Create new users",
  "users:update": "Update user information",
  "users:update-self": "Update own information",
  "users:delete": "Delete users",
  "users:manage-permissions": "Manage user permissions",

  // Organization Management
  "organizations:list": "View list of organizations",
  "organizations:view": "View organization details",
  "organizations:create": "Create new organizations",
  "organizations:update": "Update organization information",
  "organizations:delete": "Delete organizations",

  // Location Management
  "locations:list": "View list of locations",
  "locations:view": "View location details",
  "locations:create": "Create new locations",
  "locations:update": "Update location information",
  "locations:delete": "Delete locations",

  // Tenant Management
  "tenants:list": "View list of tenants",
  "tenants:view": "View tenant details",
  "tenants:create": "Create new tenants",
  "tenants:update": "Update tenant information",
  "tenants:delete": "Delete tenants",

  // Subscription Management
  "subscriptions:list": "View list of subscriptions",
  "subscriptions:view": "View subscription details",
  "subscriptions:create": "Create new subscriptions",
  "subscriptions:update": "Update subscription information",
  "subscriptions:cancel": "Cancel subscriptions",

  // Dental Clinic Module
  "patients:list": "View list of patients",
  "patients:view": "View patient details",
  "patients:create": "Create new patients",
  "patients:update": "Update patient information",
  "patients:delete": "Delete patients",
  "patients:merge": "Merge duplicate patient records",

  "appointments:list": "View list of appointments",
  "appointments:view": "View appointment details",
  "appointments:create": "Create new appointments",
  "appointments:update": "Update appointment information",
  "appointments:cancel": "Cancel appointments",
  "appointments:reschedule": "Reschedule appointments",

  "treatments:list": "View list of treatments",
  "treatments:view": "View treatment details",
  "treatments:create": "Create new treatments",
  "treatments:update": "Update treatment information",
  "treatments:delete": "Delete treatments",
  "treatments:complete": "Mark treatments as complete",

  "invoices:list": "View list of invoices",
  "invoices:view": "View invoice details",
  "invoices:create": "Create new invoices",
  "invoices:update": "Update invoice information",
  "invoices:delete": "Delete invoices",
  "invoices:process-payment": "Process payments for invoices",

  // Dental Lab Module
  "lab-cases:list": "View list of lab cases",
  "lab-cases:view": "View lab case details",
  "lab-cases:create": "Create new lab cases",
  "lab-cases:update": "Update lab case information",
  "lab-cases:delete": "Delete lab cases",
  "lab-cases:status-update": "Update lab case status",

  // Imaging Center Module
  "imaging:list": "View list of imaging orders",
  "imaging:view": "View imaging order details",
  "imaging:create": "Create new imaging orders",
  "imaging:update": "Update imaging order information",
  "imaging:delete": "Delete imaging orders",
  "imaging:upload": "Upload imaging files",
  "imaging:download": "Download imaging files",

  // Supplies Management Module
  "inventory:list": "View list of inventory items",
  "inventory:view": "View inventory item details",
  "inventory:create": "Create new inventory items",
  "inventory:update": "Update inventory information",
  "inventory:delete": "Delete inventory items",
  "inventory:adjust": "Adjust inventory quantities",

  "orders:list": "View list of orders",
  "orders:view": "View order details",
  "orders:create": "Create new orders",
  "orders:update": "Update order information",
  "orders:delete": "Delete orders",
  "orders:approve": "Approve orders",
  "orders:fulfill": "Fulfill orders",
} as const;

// Create a type from the permissions object keys
export type PermissionCode = keyof typeof PERMISSIONS;

/**
 * Default permission sets for each role
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  SUPER_ADMIN: Object.keys(PERMISSIONS) as PermissionCode[],

  TENANT_ADMIN: [
    // All permissions except tenant management
    ...(Object.keys(PERMISSIONS).filter(
      (p) => !p.startsWith("tenants:")
    ) as PermissionCode[]),
  ],

  ORG_ADMIN: [
    // User management within organization
    "users:list",
    "users:view",
    "users:create",
    "users:update",
    "users:delete",
    "users:manage-permissions",
    "users:view-self",
    "users:update-self",

    // Organization management
    "organizations:view",
    "organizations:update",

    // Location management
    "locations:list",
    "locations:view",
    "locations:create",
    "locations:update",
    "locations:delete",

    // All module permissions
    ...(Object.keys(PERMISSIONS).filter(
      (p) =>
        p.startsWith("patients:") ||
        p.startsWith("appointments:") ||
        p.startsWith("treatments:") ||
        p.startsWith("invoices:") ||
        p.startsWith("lab-cases:") ||
        p.startsWith("imaging:") ||
        p.startsWith("inventory:") ||
        p.startsWith("orders:")
    ) as PermissionCode[]),
  ],

  LOCATION_ADMIN: [
    // Limited user management
    "users:list",
    "users:view",
    "users:create",
    "users:update",
    "users:view-self",
    "users:update-self",

    // Location management
    "locations:view",
    "locations:update",

    // All module permissions
    ...(Object.keys(PERMISSIONS).filter(
      (p) =>
        p.startsWith("patients:") ||
        p.startsWith("appointments:") ||
        p.startsWith("treatments:") ||
        p.startsWith("invoices:") ||
        p.startsWith("lab-cases:") ||
        p.startsWith("imaging:") ||
        p.startsWith("inventory:") ||
        p.startsWith("orders:")
    ) as PermissionCode[]),
  ],

  DENTIST: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Patient and clinical permissions
    "patients:list",
    "patients:view",
    "patients:create",
    "patients:update",
    "appointments:list",
    "appointments:view",
    "appointments:create",
    "appointments:update",
    "appointments:cancel",
    "appointments:reschedule",
    "treatments:list",
    "treatments:view",
    "treatments:create",
    "treatments:update",
    "treatments:complete",
    "invoices:list",
    "invoices:view",
    "invoices:create",

    // Lab and imaging permissions
    "lab-cases:list",
    "lab-cases:view",
    "lab-cases:create",
    "lab-cases:update",
    "lab-cases:status-update",
    "imaging:list",
    "imaging:view",
    "imaging:create",
    "imaging:update",
    "imaging:upload",
    "imaging:download",

    // Basic inventory
    "inventory:list",
    "inventory:view",
    "orders:list",
    "orders:view",
    "orders:create",
  ],

  HYGIENIST: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Limited patient and clinical permissions
    "patients:list",
    "patients:view",
    "patients:update",
    "appointments:list",
    "appointments:view",
    "treatments:list",
    "treatments:view",
    "treatments:create",
    "treatments:update",
    "treatments:complete",

    // Very limited lab and imaging permissions
    "lab-cases:list",
    "lab-cases:view",
    "imaging:list",
    "imaging:view",
    "imaging:download",

    // Basic inventory
    "inventory:list",
    "inventory:view",
    "orders:list",
    "orders:view",
    "orders:create",
  ],

  ASSISTANT: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Limited patient and clinical permissions
    "patients:list",
    "patients:view",
    "patients:update",
    "appointments:list",
    "appointments:view",
    "appointments:create",
    "appointments:update",
    "appointments:reschedule",
    "treatments:list",
    "treatments:view",
    "treatments:update",

    // Very limited lab and imaging permissions
    "lab-cases:list",
    "lab-cases:view",
    "imaging:list",
    "imaging:view",
    "imaging:download",

    // Basic inventory
    "inventory:list",
    "inventory:view",
    "orders:list",
    "orders:view",
  ],

  FRONT_DESK: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Patient management and scheduling focused
    "patients:list",
    "patients:view",
    "patients:create",
    "patients:update",
    "appointments:list",
    "appointments:view",
    "appointments:create",
    "appointments:update",
    "appointments:cancel",
    "appointments:reschedule",
    "invoices:list",
    "invoices:view",
    "invoices:create",
    "invoices:update",
    "invoices:process-payment",

    // Limited clinical view
    "treatments:list",
    "treatments:view",

    // Basic inventory and ordering
    "inventory:list",
    "inventory:view",
    "orders:list",
    "orders:view",
    "orders:create",
  ],

  LAB_MANAGER: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Lab-specific permissions
    "lab-cases:list",
    "lab-cases:view",
    "lab-cases:create",
    "lab-cases:update",
    "lab-cases:delete",
    "lab-cases:status-update",

    // Inventory management for lab
    "inventory:list",
    "inventory:view",
    "inventory:create",
    "inventory:update",
    "inventory:adjust",
    "orders:list",
    "orders:view",
    "orders:create",
    "orders:update",
    "orders:approve",
  ],

  LAB_TECHNICIAN: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Lab-specific permissions
    "lab-cases:list",
    "lab-cases:view",
    "lab-cases:status-update",

    // Limited inventory management
    "inventory:list",
    "inventory:view",
    "inventory:adjust",
    "orders:list",
    "orders:view",
  ],

  RADIOLOGIST: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Imaging-specific permissions
    "imaging:list",
    "imaging:view",
    "imaging:update",
    "imaging:upload",
    "imaging:download",

    // Limited patient view
    "patients:list",
    "patients:view",
  ],

  IMAGING_TECH: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Imaging-specific permissions
    "imaging:list",
    "imaging:view",
    "imaging:upload",
    "imaging:download",

    // Limited patient view
    "patients:list",
    "patients:view",
  ],

  INVENTORY_MANAGER: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Inventory-specific permissions
    "inventory:list",
    "inventory:view",
    "inventory:create",
    "inventory:update",
    "inventory:delete",
    "inventory:adjust",
    "orders:list",
    "orders:view",
    "orders:create",
    "orders:update",
    "orders:delete",
    "orders:approve",
    "orders:fulfill",
  ],

  ACCOUNTING: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Finance-related permissions
    "invoices:list",
    "invoices:view",
    "invoices:update",
    "invoices:process-payment",

    // Read-only access to orders
    "orders:list",
    "orders:view",
  ],

  PATIENT: [
    // Self management
    "users:view-self",
    "users:update-self",

    // Patient portal permissions
    "appointments:list",
    "appointments:view",
    "appointments:create",
    "appointments:cancel",
    "treatments:list",
    "treatments:view",
    "invoices:list",
    "invoices:view",
  ],
};

/**
 * Groups permissions by module for UI organization
 */
export const PERMISSION_GROUPS = {
  "User Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("users:")
  ),
  "Organization Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("organizations:")
  ),
  "Location Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("locations:")
  ),
  "Tenant Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("tenants:")
  ),
  "Subscription Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("subscriptions:")
  ),
  "Patient Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("patients:")
  ),
  "Appointment Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("appointments:")
  ),
  "Treatment Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("treatments:")
  ),
  "Invoice Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("invoices:")
  ),
  "Lab Case Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("lab-cases:")
  ),
  "Imaging Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("imaging:")
  ),
  "Inventory Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("inventory:")
  ),
  "Order Management": Object.keys(PERMISSIONS).filter((p) =>
    p.startsWith("orders:")
  ),
};

/**
 * Check if a user has a specific permission
 *
 * @param userPermissions Array of permission codes the user has
 * @param requiredPermission The permission code to check for
 * @returns boolean indicating if the user has the permission
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission: PermissionCode
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has any of the specified permissions
 *
 * @param userPermissions Array of permission codes the user has
 * @param requiredPermissions Array of permission codes to check against
 * @returns boolean indicating if the user has any of the permissions
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined,
  requiredPermissions: PermissionCode[]
): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if a user has all of the specified permissions
 *
 * @param userPermissions Array of permission codes the user has
 * @param requiredPermissions Array of permission codes to check against
 * @returns boolean indicating if the user has all of the permissions
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions: PermissionCode[]
): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Custom hook for checking permissions in React components
 *
 * Usage:
 * const can = usePermissions(session?.user?.permissions);
 * if (can('users:create')) { ... }
 */
export function usePermissions(userPermissions: string[] | undefined) {
  return (permission: PermissionCode) =>
    hasPermission(userPermissions, permission);
}

/**
 * Get default permissions for a role
 *
 * @param role The user role
 * @returns Array of permission codes for the role
 */
export function getDefaultPermissionsForRole(role: UserRole): PermissionCode[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

/**
 * Get a full permission object with description from a permission code
 *
 * @param code The permission code
 * @returns Object with code and description, or null if not found
 */
export function getPermissionDetails(
  code: string
): { code: string; description: string } | null {
  if (code in PERMISSIONS) {
    return {
      code,
      description: PERMISSIONS[code as PermissionCode],
    };
  }
  return null;
}
