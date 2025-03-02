// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking to existing accounts
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            organization: {
              include: {
                tenant: true,
              },
            },
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add custom user properties to token
        token.userId = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;

        // Get organization and tenant details
        const userWithDetails = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            organization: {
              include: {
                tenant: true,
              },
            },
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        if (userWithDetails) {
          token.organizationName = userWithDetails.organization.name;
          token.organizationType = userWithDetails.organization.type;
          token.tenantId = userWithDetails.organization.tenant.id;
          token.tenantName = userWithDetails.organization.tenant.name;

          // Flatten permissions for easier access
          token.permissions = userWithDetails.permissions
            .filter((p) => p.granted)
            .map((p) => p.permission.code);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationName = token.organizationName as string;
        session.user.organizationType = token.organizationType as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
