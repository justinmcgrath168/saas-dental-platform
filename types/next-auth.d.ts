// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organizationId: string;
      organizationName: string;
      organizationType: string;
      tenantId: string;
      tenantName: string;
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: string;
    organizationId: string;
    organizationName: string;
    organizationType: string;
    tenantId: string;
    tenantName: string;
    permissions: string[];
  }
}
