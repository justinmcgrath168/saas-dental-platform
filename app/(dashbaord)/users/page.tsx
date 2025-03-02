// app/(dashboard)/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { UserRoleBadge } from "@/components/user/user-role-badge";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    type: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get current page from URL
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setPagination((prev) => ({ ...prev, page: parseInt(page) }));
    }

    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
      setDebouncedSearchTerm(search);
    }

    const role = searchParams.get("role");
    if (role) {
      setSelectedRole(role);
    }

    const active = searchParams.get("active");
    if (active) {
      setActiveFilter(active);
    }
  }, [searchParams]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    async function fetchUsers() {
      setLoading(true);

      try {
        let url = `/api/users?page=${pagination.page}&limit=${pagination.limit}`;

        if (debouncedSearchTerm) {
          url += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
        }

        if (selectedRole) {
          url += `&role=${encodeURIComponent(selectedRole)}`;
        }

        if (activeFilter) {
          url += `&isActive=${activeFilter === "active"}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [
    session,
    status,
    router,
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
    selectedRole,
    activeFilter,
  ]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (pagination.page > 1) {
      params.set("page", pagination.page.toString());
    }

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }

    if (selectedRole) {
      params.set("role", selectedRole);
    }

    if (activeFilter) {
      params.set("active", activeFilter);
    }

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    router.replace(`/users${url}`, { scroll: false });
  }, [
    pagination.page,
    debouncedSearchTerm,
    selectedRole,
    activeFilter,
    router,
  ]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle role filter
  const handleRoleFilter = (value: string) => {
    setSelectedRole(value === "all" ? null : value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle active filter
  const handleActiveFilter = (value: string) => {
    setActiveFilter(value === "all" ? null : value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh user list
      setUsers(users.filter((user) => user.id !== userToDelete));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        pages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        {session?.user.permissions.includes("users:create") && (
          <Button onClick={() => router.push("/users/create")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-row gap-2">
                <Select
                  value={selectedRole || "all"}
                  onValueChange={handleRoleFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                    <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
                    <SelectItem value="LOCATION_ADMIN">
                      Location Admin
                    </SelectItem>
                    <SelectItem value="DENTIST">Dentist</SelectItem>
                    <SelectItem value="HYGIENIST">Hygienist</SelectItem>
                    <SelectItem value="ASSISTANT">Assistant</SelectItem>
                    <SelectItem value="FRONT_DESK">Front Desk</SelectItem>
                    <SelectItem value="LAB_MANAGER">Lab Manager</SelectItem>
                    <SelectItem value="LAB_TECHNICIAN">
                      Lab Technician
                    </SelectItem>
                    <SelectItem value="RADIOLOGIST">Radiologist</SelectItem>
                    <SelectItem value="IMAGING_TECH">Imaging Tech</SelectItem>
                    <SelectItem value="INVENTORY_MANAGER">
                      Inventory Manager
                    </SelectItem>
                    <SelectItem value="ACCOUNTING">Accounting</SelectItem>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={activeFilter || "all"}
                  onValueChange={handleActiveFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <UserRoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "destructive"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? formatDistanceToNow(new Date(user.lastLogin), {
                                addSuffix: true,
                              })
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {session?.user.permissions.includes(
                                "users:view"
                              ) && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/users/${user.id}`)
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                              )}
                              {session?.user.permissions.includes(
                                "users:update"
                              ) && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/users/${user.id}/edit`)
                                  }
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {session?.user.permissions.includes(
                                "users:delete"
                              ) && (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setUserToDelete(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.pages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page > 1) {
                          handlePageChange(pagination.page - 1);
                        }
                      }}
                      className={
                        pagination.page <= 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, and pages around current page
                      return (
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, i, array) => {
                      // Add ellipsis where needed
                      const prevPage = array[i - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <PaginationItem>
                              <span className="px-4 py-2">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={page === pagination.page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.page < pagination.pages) {
                          handlePageChange(pagination.page + 1);
                        }
                      }}
                      className={
                        pagination.page >= pagination.pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
