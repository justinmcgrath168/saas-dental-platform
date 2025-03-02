// app/auth/register/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function RegistrationSuccessPage() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [tenantUrl, setTenantUrl] = useState<string>("");

  useEffect(() => {
    // Try to get the tenant information from localStorage
    // This would need to be set during the registration process
    const savedSubdomain = localStorage.getItem("registeredSubdomain");
    if (savedSubdomain) {
      setSubdomain(savedSubdomain);

      // Determine the environment and construct the URL
      const isLocalhost = window.location.hostname === "localhost";
      if (isLocalhost) {
        setTenantUrl(`http://${savedSubdomain}.localhost:3000`);
      } else {
        // For production, use the actual domain
        setTenantUrl(`https://${savedSubdomain}.dentalhub.com`);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Registration Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Your dental management system has been created and is ready to use.
          </p>

          {subdomain ? (
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium">Your workspace URL:</p>
              <p className="text-primary mt-1">
                <a href={tenantUrl} className="hover:underline">
                  {tenantUrl}
                </a>
              </p>
            </div>
          ) : (
            <p>
              You'll receive an email with your workspace URL and further
              instructions.
            </p>
          )}

          <div className="space-y-2 pt-4">
            <h3 className="font-medium">What happens next?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li>1. Log in to your new workspace</li>
              <li>2. Complete your organization profile</li>
              <li>3. Invite your team members</li>
              <li>4. Set up your services and schedule</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" asChild>
            <Link href={subdomain ? tenantUrl : "/auth/signin"}>
              Continue to Login
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            Need help getting started?{" "}
            <Link
              href="/help"
              className="text-primary font-medium hover:underline"
            >
              Check our guides
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
