// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Add prisma to the NodeJS global type
declare global {
  const prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In development, don't shut down the Prisma Client on hot reloads
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
