// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for handling multi-tenancy with subdomain routing
 * and protecting authenticated routes.
 */
export async function middleware(req: NextRequest) {
  const { pathname, origin, host } = req.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const hostname = host
    .replace(".localhost:3000", "")
    .replace(".dentalhub.com", "");
  const isRootDomain =
    hostname === "localhost:3000" ||
    hostname === "dentalhub.com" ||
    hostname === "www.dentalhub.com";
  const subdomain = isRootDomain ? null : hostname;

  // Get the JWT token from the cookie
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // For main domain routes (non-tenant specific)
  if (isRootDomain) {
    // Protect dashboard routes on main domain
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/signin", origin));
    }

    // Allow public routes
    return NextResponse.next();
  }

  // For subdomain routes (tenant specific)
  if (subdomain) {
    // Redirect auth requests to the main domain
    if (pathname.startsWith("/auth")) {
      const url = req.nextUrl.clone();
      url.host =
        process.env.NODE_ENV === "development"
          ? "localhost:3000"
          : "dentalhub.com";
      url.pathname = pathname;
      url.search = req.nextUrl.search; // Preserve query parameters like callbackUrl
      return NextResponse.redirect(url);
    }

    // Get tenant information from the database
    try {
      const tenantResponse = await fetch(
        `${origin}/api/tenants/by-subdomain?subdomain=${subdomain}`,
        {
          headers: {
            "x-middleware-request": "true", // Special header to bypass auth in the API route
          },
        }
      );

      if (!tenantResponse.ok) {
        // Tenant doesn't exist - redirect to main domain
        const url = req.nextUrl.clone();
        url.host =
          process.env.NODE_ENV === "development"
            ? "localhost:3000"
            : "dentalhub.com";
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      const tenant = await tenantResponse.json();

      // Check if the user belongs to this tenant if authenticated
      if (isAuthenticated && token.tenantId !== tenant.id) {
        // User is authenticated but doesn't belong to this tenant
        // Either redirect to their tenant or sign them out
        if (token.tenantId) {
          // Find their tenant's subdomain
          const userTenantResponse = await fetch(
            `${origin}/api/tenants/${token.tenantId}`,
            {
              headers: {
                "x-middleware-request": "true",
              },
            }
          );

          if (userTenantResponse.ok) {
            const userTenant = await userTenantResponse.json();
            const url = req.nextUrl.clone();
            url.host =
              process.env.NODE_ENV === "development"
                ? `${userTenant.subdomain}.localhost:3000`
                : `${userTenant.subdomain}.dentalhub.com`;
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
          }
        }

        // If we can't redirect them to their tenant, sign them out
        return NextResponse.redirect(new URL("/auth/signin", origin));
      }

      // Protect all tenant subdomain routes except the public landing page
      if (pathname !== "/" && !isAuthenticated) {
        const callbackUrl = encodeURIComponent(
          `${
            process.env.NODE_ENV === "development"
              ? `http://${subdomain}.localhost:3000`
              : `https://${subdomain}.dentalhub.com`
          }${pathname}`
        );

        return NextResponse.redirect(
          new URL(`/auth/signin?callbackUrl=${callbackUrl}`, origin)
        );
      }

      // If all checks pass, proceed with the request
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-tenant-id", tenant.id);

      return NextResponse.next({
        headers: requestHeaders,
      });
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.next();
    }
  }

  // Fallback
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all request paths except those starting with:
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
