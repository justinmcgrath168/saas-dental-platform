// app/(dashboard)/users/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronLeft } from "lucide-react";
import { UserRoleBadge } from "@/components/user/user-role-badge";
import { toast } from "@/components/ui/sonner";

// Define validation schema
const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.string({
    required_error: "Please select a role",
  }),
  organizationId: z.string({
    required_error: "Please select an organization",
  }),
  locationIds: z.array(z.string()).optional(),
  primaryLocationId: z.string().optional(),
  isActive: z.boolean().default(true),
  // We'll handle permissions separately
});

type FormValues = z.infer<typeof userFormSchema>;

interface Organization {
  id: string;
  name: string;
  type: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // State
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<
    Record<string, Permission[]>
  >({});

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      organizationId: session?.user.organizationId || "",
      locationIds: [],
      isActive: true,
    },
  });

  // Watch form values
  const organizationId = form.watch("organizationId");
  const role = form.watch("role");

  // Check authentication and permissions
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!session.user.permissions.includes("users:create")) {
      // toast({
      //   title: "Permission Denied",
      //   description: "You do not have permission to create users.",
      //   variant: "destructive",
      // });
      toast(
        "Permission Denied",
        "You do not have permission to create users.",
        "destructive"
      );
      router.push("/users");
    }
  }, [session, status, router]);

  // Fetch organizations
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        let url = "/api/organizations";

        // Regular users can only create users in their own organization
        if (
          session?.user.role !== "SUPER_ADMIN" &&
          session?.user.role !== "TENANT_ADMIN"
        ) {
          url += `?id=${session?.user.organizationId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch organizations");
        }

        const data = await response.json();
        setOrganizations(data.organizations);

        // If there's only one organization, set it as default
        if (data.organizations.length === 1) {
          form.setValue("organizationId", data.organizations[0].id);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load organizations",
        //   variant: "destructive",
        // });
        toast("Error", "Failed to load organizations", "destructive");
      }
    }

    if (session) {
      fetchOrganizations();
    }
  }, [session, form]);

  // Fetch locations when organization changes
  useEffect(() => {
    async function fetchLocations() {
      if (!organizationId) return;

      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/locations`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        setLocations(data.locations);

        // Reset selected locations
        form.setValue("locationIds", []);
        form.setValue("primaryLocationId", undefined);
      } catch (error) {
        console.error("Error fetching locations:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load locations",
        //   variant: "destructive",
        // });
        toast("Error", "Failed to load locations", "destructive");
      }
    }

    fetchLocations();
  }, [organizationId, form]);

  // Fetch permissions
  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch("/api/permissions");

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();
        setPermissions(data.permissions);

        // Group permissions by module
        const grouped = data.permissions.reduce(
          (acc: Record<string, Permission[]>, permission: Permission) => {
            if (!acc[permission.module]) {
              acc[permission.module] = [];
            }
            acc[permission.module].push(permission);
            return acc;
          },
          {}
        );

        setPermissionGroups(grouped);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load permissions",
        //   variant: "destructive",
        // });
        toast("Error", "Failed to load permissions", "destructive");
      }
    }

    if (session) {
      fetchPermissions();
    }
  }, [session]);

  // Set default permissions based on role
  useEffect(() => {
    if (!role || !permissions.length) return;

    // Define default permission sets for each role
    const defaultPermissionsByRole: Record<string, string[]> = {
      SUPER_ADMIN: permissions.map((p) => p.code), // All permissions
      TENANT_ADMIN: permissions.map((p) => p.code), // All permissions
      ORG_ADMIN: permissions
        .filter(
          (p) =>
            !p.code.startsWith("tenants:") &&
            !p.code.startsWith("subscriptions:")
        )
        .map((p) => p.code),
      LOCATION_ADMIN: permissions
        .filter(
          (p) =>
            p.code.startsWith("users:") ||
            p.code.startsWith("patients:") ||
            p.code.startsWith("appointments:") ||
            p.code.startsWith("treatments:") ||
            p.code.startsWith("invoices:")
        )
        .map((p) => p.code),
      DENTIST: permissions
        .filter(
          (p) =>
            p.code.startsWith("patients:view") ||
            p.code.startsWith("appointments:") ||
            p.code.startsWith("treatments:") ||
            p.code.startsWith("prescriptions:")
        )
        .map((p) => p.code),
      HYGIENIST: permissions
        .filter(
          (p) =>
            p.code.startsWith("patients:view") ||
            p.code.startsWith("appointments:view") ||
            p.code.startsWith("treatments:view")
        )
        .map((p) => p.code),
      FRONT_DESK: permissions
        .filter(
          (p) =>
            p.code.startsWith("patients:") ||
            p.code.startsWith("appointments:") ||
            p.code.startsWith("invoices:")
        )
        .map((p) => p.code),
      // Add more role-based permission sets as needed
    };

    if (defaultPermissionsByRole[role]) {
      setSelectedPermissions(defaultPermissionsByRole[role]);
    } else {
      // For roles without predefined permissions, start with a minimal set
      setSelectedPermissions(
        permissions.filter((p) => p.code.includes(":view")).map((p) => p.code)
      );
    }
  }, [role, permissions]);

  // Handle location selection
  const handleLocationChange = (locationId: string, checked: boolean) => {
    const currentLocations = form.getValues("locationIds") || [];

    if (checked) {
      // Add location
      const newLocations = [...currentLocations, locationId];
      form.setValue("locationIds", newLocations);

      // If this is the first location, set it as primary
      if (newLocations.length === 1) {
        form.setValue("primaryLocationId", locationId);
      }
    } else {
      // Remove location
      const newLocations = currentLocations.filter((id) => id !== locationId);
      form.setValue("locationIds", newLocations);

      // If primary location was removed, set a new one or clear it
      if (form.getValues("primaryLocationId") === locationId) {
        form.setValue("primaryLocationId", newLocations[0] || undefined);
      }
    }
  };

  // Handle primary location selection
  const handlePrimaryLocationChange = (locationId: string) => {
    form.setValue("primaryLocationId", locationId);
  };

  // Handle permission selection
  const handlePermissionChange = (permissionCode: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionCode]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((code) => code !== permissionCode)
      );
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      // Add permissions to the payload
      const payload = {
        ...values,
        permissions: selectedPermissions,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      // toast({
      //   title: "Success",
      //   description: "User created successfully",
      // });
      toast("Success", "User created successfully");

      // Redirect to user list
      router.push("/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to create user",
      //   variant: "destructive",
      // });
      toast("Error", error.message || "Failed to create user", "destructive");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/users")}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create User</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Enter the basic information for the new user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email address"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used for login and notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters with uppercase, lowercase
                        and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Only show SUPER_ADMIN option to existing super admins */}
                          {session?.user.role === "SUPER_ADMIN" && (
                            <SelectItem value="SUPER_ADMIN">
                              Super Admin
                            </SelectItem>
                          )}

                          {/* Only show TENANT_ADMIN option to super admins and tenant admins */}
                          {(session?.user.role === "SUPER_ADMIN" ||
                            session?.user.role === "TENANT_ADMIN") && (
                            <SelectItem value="TENANT_ADMIN">
                              Tenant Admin
                            </SelectItem>
                          )}

                          <SelectItem value="ORG_ADMIN">
                            Organization Admin
                          </SelectItem>
                          <SelectItem value="LOCATION_ADMIN">
                            Location Admin
                          </SelectItem>
                          <SelectItem value="DENTIST">Dentist</SelectItem>
                          <SelectItem value="HYGIENIST">Hygienist</SelectItem>
                          <SelectItem value="ASSISTANT">Assistant</SelectItem>
                          <SelectItem value="FRONT_DESK">Front Desk</SelectItem>
                          <SelectItem value="LAB_MANAGER">
                            Lab Manager
                          </SelectItem>
                          <SelectItem value="LAB_TECHNICIAN">
                            Lab Technician
                          </SelectItem>
                          <SelectItem value="RADIOLOGIST">
                            Radiologist
                          </SelectItem>
                          <SelectItem value="IMAGING_TECH">
                            Imaging Tech
                          </SelectItem>
                          <SelectItem value="INVENTORY_MANAGER">
                            Inventory Manager
                          </SelectItem>
                          <SelectItem value="ACCOUNTING">Accounting</SelectItem>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name} ({org.type.replace("_", " ")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Inactive users cannot log in to the system
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {locations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
                <CardDescription>
                  Assign the user to one or more locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((location) => {
                      const locationIds = form.getValues("locationIds") || [];
                      const isSelected = locationIds.includes(location.id);
                      const isPrimary =
                        form.getValues("primaryLocationId") === location.id;

                      return (
                        <div
                          key={location.id}
                          className={`rounded-md border p-4 ${
                            isSelected ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleLocationChange(location.id, !!checked)
                                }
                              />
                              <div>
                                <p className="font-medium">{location.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {location.address}, {location.city},{" "}
                                  {location.state}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <Checkbox
                                checked={isPrimary}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handlePrimaryLocationChange(location.id);
                                  }
                                }}
                              />
                            )}
                          </div>
                          {isSelected && (
                            <div className="mt-2 text-xs text-right">
                              {isPrimary ? (
                                <span className="text-primary">
                                  Primary Location
                                </span>
                              ) : (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() =>
                                    handlePrimaryLocationChange(location.id)
                                  }
                                >
                                  Set as Primary
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Configure what this user can access and modify
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {role && (
                  <div className="flex items-center space-x-2">
                    <span>Selected Role:</span>
                    <UserRoleBadge role={role} />
                    <span className="text-sm text-muted-foreground">
                      (Default permissions have been selected based on this
                      role)
                    </span>
                  </div>
                )}

                {Object.entries(permissionGroups).map(
                  ([module, modulePermissions]) => (
                    <div key={module} className="space-y-2">
                      <h3 className="text-lg font-medium border-b pb-2">
                        {module}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                        {modulePermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-2"
                          >
                            <Checkbox
                              id={permission.code}
                              checked={selectedPermissions.includes(
                                permission.code
                              )}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  permission.code,
                                  !!checked
                                )
                              }
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={permission.code}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.name}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {permission.code}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/users")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
