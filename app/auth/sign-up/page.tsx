// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";

// Define validation schema
const registerFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be less than 63 characters")
    .regex(
      /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen"
    ),
  organizationType: z.enum([
    "DENTAL_CLINIC",
    "DENTAL_LAB",
    "IMAGING_CENTER",
    "SUPPLIER",
  ]),
  adminName: z.string().min(1, "Admin name is required"),
  adminEmail: z.string().email("Invalid email format"),
  adminPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type FormValues = z.infer<typeof registerFormSchema>;

// Pricing plan options
const pricingPlans = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    description: "For small practices just getting started",
    features: [
      "Up to 3 users",
      "Basic patient management",
      "Limited appointment scheduling",
      "Email support",
      "30-day trial",
    ],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: "$49",
    period: "per month",
    description: "For growing practices",
    features: [
      "Up to 10 users",
      "Full patient management",
      "Advanced appointment scheduling",
      "Basic reporting",
      "Email and chat support",
    ],
    popular: true,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "For established practices",
    features: [
      "Up to 25 users",
      "Full patient management",
      "Advanced appointment scheduling",
      "Comprehensive reporting",
      "Priority support",
      "Custom branding",
    ],
  },
];

export default function RegisterPage() {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("FREE");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  // Form initialization
  const form = useForm<FormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      subdomain: "",
      organizationType: "DENTAL_CLINIC",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  // Watch subdomain field
  const subdomain = form.watch("subdomain");

  // Check subdomain availability
  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);

    try {
      const response = await fetch(
        `/api/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`
      );
      const data = await response.json();

      setSubdomainAvailable(data.available);
    } catch (error) {
      console.error("Error checking subdomain:", error);
      setSubdomainAvailable(null);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  // Handle subdomain change with debounce
  const handleSubdomainChange = (value: string) => {
    form.setValue("subdomain", value.toLowerCase().replace(/[^a-z0-9-]/g, ""));

    if (value.length >= 3) {
      // Debounce the API call
      const timer = setTimeout(() => {
        checkSubdomainAvailability(value);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSubdomainAvailable(null);
    }
  };

  // Handle plan selection
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-public-signup": "true", // Flag to indicate this is a public signup
        },
        body: JSON.stringify({
          ...values,
          planType: selectedPlan,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create account");
      }

      // Redirect to success page
      router.push("/auth/register/success");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="flex justify-center mb-6">
          <div className="w-40 h-12 relative">
            {/* Replace with your logo */}
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
              DentalHub
            </div>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Start your free trial
            </CardTitle>
            <CardDescription>
              Create your dental management account in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="p-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Business Information
                        </h3>

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your Dental Practice"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="subdomain"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subdomain</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="relative w-full">
                                      <Input
                                        placeholder="your-practice"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleSubdomainChange(e.target.value);
                                        }}
                                        className={
                                          subdomainAvailable === true
                                            ? "pr-10 border-green-500 focus-visible:ring-green-500"
                                            : subdomainAvailable === false
                                            ? "pr-10 border-red-500 focus-visible:ring-red-500"
                                            : "pr-10"
                                        }
                                      />
                                      {checkingSubdomain && (
                                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                                      )}
                                      {subdomainAvailable === true &&
                                        !checkingSubdomain && (
                                          <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                  </FormControl>
                                  <div className="flex items-center text-sm font-medium text-muted-foreground ml-2">
                                    .dentalhub.com
                                  </div>
                                </div>
                                {subdomainAvailable === true && (
                                  <FormDescription className="text-green-500">
                                    Subdomain is available!
                                  </FormDescription>
                                )}
                                {subdomainAvailable === false && (
                                  <FormDescription className="text-red-500">
                                    Subdomain is already taken. Please choose
                                    another.
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="organizationType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="DENTAL_CLINIC">
                                      Dental Clinic
                                    </SelectItem>
                                    <SelectItem value="DENTAL_LAB">
                                      Dental Lab
                                    </SelectItem>
                                    <SelectItem value="IMAGING_CENTER">
                                      Imaging Center
                                    </SelectItem>
                                    <SelectItem value="SUPPLIER">
                                      Dental Supplier
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Admin Account</h3>

                        <FormField
                          control={form.control}
                          name="adminName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="adminEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="jane@example.com"
                                  type="email"
                                  autoComplete="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="adminPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  autoComplete="new-password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Must be at least 8 characters with uppercase,
                                lowercase and numbers
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Selected Plan:{" "}
                          {
                            pricingPlans.find((p) => p.id === selectedPlan)
                              ?.name
                          }
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {pricingPlans.map((plan) => (
                            <div
                              key={plan.id}
                              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                                selectedPlan === plan.id
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handlePlanSelection(plan.id)}
                            >
                              {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                                  Most Popular
                                </div>
                              )}
                              <div className="space-y-2">
                                <h4 className="font-medium">{plan.name}</h4>
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-bold">
                                    {plan.price}
                                  </span>
                                  {plan.period && (
                                    <span className="ml-1 text-sm text-muted-foreground">
                                      {plan.period}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {plan.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || subdomainAvailable === false}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account & Start Free Trial"
                      )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="pricing" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={
                          plan.popular ? "border-primary shadow-md" : ""
                        }
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
                            Most Popular
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <div className="flex items-baseline mt-2">
                            <span className="text-3xl font-bold">
                              {plan.price}
                            </span>
                            {plan.period && (
                              <span className="ml-1 text-sm text-muted-foreground">
                                {plan.period}
                              </span>
                            )}
                          </div>
                          <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant={plan.popular ? "default" : "outline"}
                            className="w-full"
                            onClick={() => {
                              setSelectedPlan(plan.id);
                              document
                                .querySelector('[data-value="signup"]')
                                ?.dispatchEvent(
                                  new MouseEvent("click", { bubbles: true })
                                );
                            }}
                          >
                            Select {plan.name} Plan
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center p-6 border rounded-lg bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">
                      Need a custom plan?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      For larger organizations or specific requirements, we
                      offer custom plans.
                    </p>
                    <Button variant="outline">Contact Sales</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
