// components/user/user-role-badge.tsx
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const getRoleConfig = (
    role: string
  ): {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  } => {
    switch (role) {
      case "SUPER_ADMIN":
        return { label: "Super Admin", variant: "destructive" };
      case "TENANT_ADMIN":
        return { label: "Tenant Admin", variant: "destructive" };
      case "ORG_ADMIN":
        return { label: "Organization Admin", variant: "destructive" };
      case "LOCATION_ADMIN":
        return { label: "Location Admin", variant: "destructive" };
      case "DENTIST":
        return { label: "Dentist", variant: "default" };
      case "HYGIENIST":
        return { label: "Hygienist", variant: "default" };
      case "ASSISTANT":
        return { label: "Assistant", variant: "default" };
      case "FRONT_DESK":
        return { label: "Front Desk", variant: "default" };
      case "LAB_MANAGER":
        return { label: "Lab Manager", variant: "secondary" };
      case "LAB_TECHNICIAN":
        return { label: "Lab Technician", variant: "secondary" };
      case "RADIOLOGIST":
        return { label: "Radiologist", variant: "secondary" };
      case "IMAGING_TECH":
        return { label: "Imaging Tech", variant: "secondary" };
      case "INVENTORY_MANAGER":
        return { label: "Inventory Manager", variant: "outline" };
      case "ACCOUNTING":
        return { label: "Accounting", variant: "outline" };
      case "PATIENT":
        return { label: "Patient", variant: "outline" };
      default:
        return { label: role, variant: "outline" };
    }
  };

  const { label, variant } = getRoleConfig(role);

  return <Badge variant={variant}>{label}</Badge>;
}
