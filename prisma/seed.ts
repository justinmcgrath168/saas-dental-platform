import { PrismaClient, UserRole, OrgType, PlanType } from "@prisma/client";
import bcrypt from "bcrypt";
import { PERMISSIONS } from "../lib/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding the database...`);

  // Clear existing data
  await clearDatabase();

  // Create permissions
  const permissions = await createPermissions();

  // Create tenants with organizations, users, and locations
  const brightSmileTenant = await createBrightSmileDentalClinic(permissions);
  const eliteLabTenant = await createEliteDentalLab(permissions);
  const clearViewTenant = await createClearViewImagingCenter(permissions);
  const dentalStockTenant = await createDentalStockSupplier(permissions);

  console.log(`Seeding completed!`);
}

async function clearDatabase() {
  console.log("Clearing existing data...");

  // Delete in the correct order to respect foreign key constraints
  await prisma.userPermission.deleteMany({});
  await prisma.userLocation.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log("Database cleared");
}

async function createPermissions() {
  console.log("Creating permissions...");

  const permissionsToCreate = Object.entries(PERMISSIONS).map(
    ([code, description]) => ({
      code,
      name: description,
      description: description,
      module: code.split(":")[0],
    })
  );

  const permissions = await Promise.all(
    permissionsToCreate.map((permission) =>
      prisma.permission.create({
        data: permission,
      })
    )
  );

  console.log(`Created ${permissions.length} permissions`);
  return permissions;
}

async function createBrightSmileDentalClinic(permissions: any[]) {
  console.log("Creating Bright Smile Dental Clinic...");

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Bright Smile Dental",
      subdomain: "brightsmile",
      logoUrl: null,
      primaryColor: "#2563eb",
    },
  });

  // Create subscription
  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planType: PlanType.PROFESSIONAL,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      autoRenew: true,
      paymentMethod: "credit_card",
      paymentReference: "sub_12345",
    },
  });

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: "Bright Smile Dental Clinic",
      type: OrgType.DENTAL_CLINIC,
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      phone: "(415) 555-1234",
      email: "info@brightsmile.com",
      website: "https://brightsmile.com",
    },
  });

  // Create locations
  const mainLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Main Office",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US",
      phone: "(415) 555-1234",
      email: "main@brightsmile.com",
      isMain: true,
    },
  });

  const downtownLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Downtown Office",
      address: "456 Market Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "US",
      phone: "(415) 555-5678",
      email: "downtown@brightsmile.com",
      isMain: false,
    },
  });

  // Create users
  const users = await createDentalClinicUsers(
    organization.id,
    mainLocation.id,
    downtownLocation.id,
    permissions
  );

  console.log(`Created Bright Smile Dental Clinic with ${users.length} users`);
  return tenant;
}

async function createEliteDentalLab(permissions: any[]) {
  console.log("Creating Elite Dental Lab...");

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Elite Dental Lab",
      subdomain: "elitelab",
      logoUrl: null,
      primaryColor: "#8b5cf6",
    },
  });

  // Create subscription
  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planType: PlanType.STARTER,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      isActive: true,
      autoRenew: true,
      paymentMethod: "credit_card",
      paymentReference: "sub_67890",
    },
  });

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: "Elite Dental Laboratory",
      type: OrgType.DENTAL_LAB,
      address: "789 Industrial Blvd",
      city: "Oakland",
      state: "CA",
      zipCode: "94607",
      country: "US",
      phone: "(510) 555-7890",
      email: "info@elitelab.com",
      website: "https://elitelab.com",
    },
  });

  // Create location
  const labLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Main Laboratory",
      address: "789 Industrial Blvd",
      city: "Oakland",
      state: "CA",
      zipCode: "94607",
      country: "US",
      phone: "(510) 555-7890",
      email: "lab@elitelab.com",
      isMain: true,
    },
  });

  // Create users
  const users = await createDentalLabUsers(
    organization.id,
    labLocation.id,
    permissions
  );

  console.log(`Created Elite Dental Lab with ${users.length} users`);
  return tenant;
}

async function createClearViewImagingCenter(permissions: any[]) {
  console.log("Creating Clear View Imaging Center...");

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Clear View Imaging",
      subdomain: "clearview",
      logoUrl: null,
      primaryColor: "#10b981",
    },
  });

  // Create subscription
  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planType: PlanType.PROFESSIONAL,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
      isActive: true,
      autoRenew: true,
      paymentMethod: "credit_card",
      paymentReference: "sub_24680",
    },
  });

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: "Clear View Dental Imaging",
      type: OrgType.IMAGING_CENTER,
      address: "200 Medical Plaza",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
      country: "US",
      phone: "(408) 555-2468",
      email: "info@clearview.com",
      website: "https://clearview-imaging.com",
    },
  });

  // Create location
  const imagingLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Imaging Center",
      address: "200 Medical Plaza",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
      country: "US",
      phone: "(408) 555-2468",
      email: "center@clearview.com",
      isMain: true,
    },
  });

  // Create users
  const users = await createImagingCenterUsers(
    organization.id,
    imagingLocation.id,
    permissions
  );

  console.log(`Created Clear View Imaging Center with ${users.length} users`);
  return tenant;
}

async function createDentalStockSupplier(permissions: any[]) {
  console.log("Creating Dental Stock Supplier...");

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Dental Stock",
      subdomain: "dentalstock",
      logoUrl: null,
      primaryColor: "#f59e0b",
    },
  });

  // Create subscription
  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planType: PlanType.ENTERPRISE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      autoRenew: true,
      paymentMethod: "bank_transfer",
      paymentReference: "sub_13579",
    },
  });

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      tenantId: tenant.id,
      name: "Dental Stock Suppliers",
      type: OrgType.SUPPLIER,
      address: "500 Distribution Way",
      city: "Fremont",
      state: "CA",
      zipCode: "94538",
      country: "US",
      phone: "(510) 555-1357",
      email: "info@dentalstock.com",
      website: "https://dentalstock.com",
    },
  });

  // Create locations
  const warehouseLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Main Warehouse",
      address: "500 Distribution Way",
      city: "Fremont",
      state: "CA",
      zipCode: "94538",
      country: "US",
      phone: "(510) 555-1357",
      email: "warehouse@dentalstock.com",
      isMain: true,
    },
  });

  const officeLocation = await prisma.location.create({
    data: {
      organizationId: organization.id,
      name: "Administrative Office",
      address: "505 Distribution Way",
      city: "Fremont",
      state: "CA",
      zipCode: "94538",
      country: "US",
      phone: "(510) 555-2468",
      email: "office@dentalstock.com",
      isMain: false,
    },
  });

  // Create users
  const users = await createSupplierUsers(
    organization.id,
    warehouseLocation.id,
    officeLocation.id,
    permissions
  );

  console.log(`Created Dental Stock Supplier with ${users.length} users`);
  return tenant;
}

async function createDentalClinicUsers(
  organizationId: string,
  mainLocationId: string,
  secondLocationId: string,
  permissions: any[]
) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: "Sarah Mitchell",
      email: "admin@brightsmile.com",
      password: passwordHash,
      role: UserRole.TENANT_ADMIN,
      organizationId,
      isActive: true,
      lastLogin: new Date(),
    },
  });
  users.push(admin);

  // Add admin to both locations
  await prisma.userLocation.create({
    data: {
      userId: admin.id,
      locationId: mainLocationId,
      isPrimary: true,
    },
  });
  await prisma.userLocation.create({
    data: {
      userId: admin.id,
      locationId: secondLocationId,
      isPrimary: false,
    },
  });

  // Add all permissions to admin
  await addPermissionsToUser(admin.id, permissions, true);

  // Dentist
  const dentist = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "dentist@brightsmile.com",
      password: passwordHash,
      role: UserRole.DENTIST,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });
  users.push(dentist);

  await prisma.userLocation.create({
    data: {
      userId: dentist.id,
      locationId: mainLocationId,
      isPrimary: true,
    },
  });

  // Dentist permissions
  await addPermissionsForRole(dentist.id, UserRole.DENTIST, permissions);

  // Hygienist
  const hygienist = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "hygienist@brightsmile.com",
      password: passwordHash,
      role: UserRole.HYGIENIST,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });
  users.push(hygienist);

  await prisma.userLocation.create({
    data: {
      userId: hygienist.id,
      locationId: secondLocationId,
      isPrimary: true,
    },
  });

  // Hygienist permissions
  await addPermissionsForRole(hygienist.id, UserRole.HYGIENIST, permissions);

  // Front desk
  const frontDesk = await prisma.user.create({
    data: {
      name: "Robert Johnson",
      email: "frontdesk@brightsmile.com",
      password: passwordHash,
      role: UserRole.FRONT_DESK,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });
  users.push(frontDesk);

  await prisma.userLocation.create({
    data: {
      userId: frontDesk.id,
      locationId: mainLocationId,
      isPrimary: true,
    },
  });

  // Front desk permissions
  await addPermissionsForRole(frontDesk.id, UserRole.FRONT_DESK, permissions);

  return users;
}

async function createDentalLabUsers(
  organizationId: string,
  locationId: string,
  permissions: any[]
) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  // Lab Manager
  const manager = await prisma.user.create({
    data: {
      name: "James Wilson",
      email: "manager@elitelab.com",
      password: passwordHash,
      role: UserRole.LAB_MANAGER,
      organizationId,
      isActive: true,
      lastLogin: new Date(),
    },
  });
  users.push(manager);

  await prisma.userLocation.create({
    data: {
      userId: manager.id,
      locationId,
      isPrimary: true,
    },
  });

  // Lab Manager permissions
  await addPermissionsForRole(manager.id, UserRole.LAB_MANAGER, permissions);
  // Also add some admin permissions
  await addPermissionsToUser(
    manager.id,
    permissions.filter(
      (p) =>
        p.code.startsWith("organizations:") ||
        p.code.startsWith("users:") ||
        p.code.startsWith("locations:")
    )
  );

  // Lab Technician
  const technician = await prisma.user.create({
    data: {
      name: "Emily Chen",
      email: "technician@elitelab.com",
      password: passwordHash,
      role: UserRole.LAB_TECHNICIAN,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });
  users.push(technician);

  await prisma.userLocation.create({
    data: {
      userId: technician.id,
      locationId,
      isPrimary: true,
    },
  });

  // Lab Technician permissions
  await addPermissionsForRole(
    technician.id,
    UserRole.LAB_TECHNICIAN,
    permissions
  );

  return users;
}

async function createImagingCenterUsers(
  organizationId: string,
  locationId: string,
  permissions: any[]
) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  // Radiologist
  const radiologist = await prisma.user.create({
    data: {
      name: "Rachel Chen",
      email: "radiologist@clearview.com",
      password: passwordHash,
      role: UserRole.RADIOLOGIST,
      organizationId,
      isActive: true,
      lastLogin: new Date(),
    },
  });
  users.push(radiologist);

  await prisma.userLocation.create({
    data: {
      userId: radiologist.id,
      locationId,
      isPrimary: true,
    },
  });

  // Radiologist permissions
  await addPermissionsForRole(
    radiologist.id,
    UserRole.RADIOLOGIST,
    permissions
  );
  // Also add admin permissions
  await addPermissionsToUser(
    radiologist.id,
    permissions.filter(
      (p) => p.code.startsWith("organizations:") || p.code.startsWith("users:")
    )
  );

  // Imaging Tech
  const tech = await prisma.user.create({
    data: {
      name: "Michael Brown",
      email: "tech@clearview.com",
      password: passwordHash,
      role: UserRole.IMAGING_TECH,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });
  users.push(tech);

  await prisma.userLocation.create({
    data: {
      userId: tech.id,
      locationId,
      isPrimary: true,
    },
  });

  // Imaging Tech permissions
  await addPermissionsForRole(tech.id, UserRole.IMAGING_TECH, permissions);

  return users;
}

async function createSupplierUsers(
  organizationId: string,
  warehouseLocationId: string,
  officeLocationId: string,
  permissions: any[]
) {
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  // Inventory Manager
  const inventoryManager = await prisma.user.create({
    data: {
      name: "David Garcia",
      email: "inventory@dentalstock.com",
      password: passwordHash,
      role: UserRole.INVENTORY_MANAGER,
      organizationId,
      isActive: true,
      lastLogin: new Date(),
    },
  });
  users.push(inventoryManager);

  await prisma.userLocation.create({
    data: {
      userId: inventoryManager.id,
      locationId: warehouseLocationId,
      isPrimary: true,
    },
  });

  // Inventory Manager permissions
  await addPermissionsForRole(
    inventoryManager.id,
    UserRole.INVENTORY_MANAGER,
    permissions
  );
  // Add some admin permissions
  await addPermissionsToUser(
    inventoryManager.id,
    permissions.filter(
      (p) =>
        p.code.startsWith("organizations:view") ||
        p.code.startsWith("users:view")
    )
  );

  // Accounting
  const accounting = await prisma.user.create({
    data: {
      name: "Lisa Wong",
      email: "accounting@dentalstock.com",
      password: passwordHash,
      role: UserRole.ACCOUNTING,
      organizationId,
      isActive: true,
      lastLogin: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });
  users.push(accounting);

  await prisma.userLocation.create({
    data: {
      userId: accounting.id,
      locationId: officeLocationId,
      isPrimary: true,
    },
  });

  // Accounting permissions
  await addPermissionsForRole(accounting.id, UserRole.ACCOUNTING, permissions);

  return users;
}

async function addPermissionsForRole(
  userId: string,
  role: UserRole,
  allPermissions: any[]
) {
  // Get permission codes for this role from the PERMISSION constants
  // This would typically come from your lib/permissions.ts DEFAULT_ROLE_PERMISSIONS mapping
  const permissionCodes = getRolePermissionCodes(role);

  // Find the permission objects that match these codes
  const rolePermissions = allPermissions.filter((p) =>
    permissionCodes.includes(p.code)
  );

  // Add the permissions to the user
  await addPermissionsToUser(userId, rolePermissions);
}

async function addPermissionsToUser(
  userId: string,
  permissions: any[],
  all: boolean = false
) {
  const permissionsToCreate = all
    ? permissions
    : permissions.filter((p) => p !== null);

  await Promise.all(
    permissionsToCreate.map((permission) =>
      prisma.userPermission.create({
        data: {
          userId,
          permissionId: permission.id,
          granted: true,
        },
      })
    )
  );
}

// This function simulates the DEFAULT_ROLE_PERMISSIONS mapping
// Normally this would come from your lib/permissions.ts file
function getRolePermissionCodes(role: UserRole): string[] {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return Object.keys(PERMISSIONS);
    case UserRole.TENANT_ADMIN:
      return Object.keys(PERMISSIONS).filter((p) => !p.startsWith("tenants:"));
    case UserRole.ORG_ADMIN:
      return Object.keys(PERMISSIONS).filter(
        (p) => !p.startsWith("tenants:") && !p.startsWith("subscriptions:")
      );
    case UserRole.DENTIST:
      return [
        "users:view-self",
        "users:update-self",
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
        "inventory:list",
        "inventory:view",
        "orders:list",
        "orders:view",
        "orders:create",
      ];
    case UserRole.HYGIENIST:
      return [
        "users:view-self",
        "users:update-self",
        "patients:list",
        "patients:view",
        "patients:update",
        "appointments:list",
        "appointments:view",
        "treatments:list",
        "treatments:view",
        "treatments:update",
        "lab-cases:list",
        "lab-cases:view",
        "imaging:list",
        "imaging:view",
        "imaging:download",
        "inventory:list",
        "inventory:view",
      ];
    case UserRole.FRONT_DESK:
      return [
        "users:view-self",
        "users:update-self",
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
        "treatments:list",
        "treatments:view",
      ];
    case UserRole.LAB_MANAGER:
      return [
        "users:view-self",
        "users:update-self",
        "lab-cases:list",
        "lab-cases:view",
        "lab-cases:create",
        "lab-cases:update",
        "lab-cases:delete",
        "lab-cases:status-update",
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
      ];
    case UserRole.LAB_TECHNICIAN:
      return [
        "users:view-self",
        "users:update-self",
        "lab-cases:list",
        "lab-cases:view",
        "lab-cases:status-update",
        "inventory:list",
        "inventory:view",
        "inventory:adjust",
      ];
    case UserRole.RADIOLOGIST:
      return [
        "users:view-self",
        "users:update-self",
        "imaging:list",
        "imaging:view",
        "imaging:update",
        "imaging:upload",
        "imaging:download",
        "patients:list",
        "patients:view",
      ];
    case UserRole.IMAGING_TECH:
      return [
        "users:view-self",
        "users:update-self",
        "imaging:list",
        "imaging:view",
        "imaging:upload",
        "imaging:download",
        "patients:list",
        "patients:view",
      ];
    case UserRole.INVENTORY_MANAGER:
      return [
        "users:view-self",
        "users:update-self",
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
      ];
    case UserRole.ACCOUNTING:
      return [
        "users:view-self",
        "users:update-self",
        "invoices:list",
        "invoices:view",
        "invoices:update",
        "invoices:process-payment",
        "orders:list",
        "orders:view",
      ];
    default:
      return ["users:view-self", "users:update-self"];
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
