import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "DentalHub - The Complete Dental Management Ecosystem",
    template: "%s | DentalHub",
  },
  description:
    "Centralize, digitize, and integrate your dental practice with our all-in-one platform for clinics, labs, imaging centers, and suppliers.",
  keywords: [
    "dental management",
    "dental software",
    "dental practice management",
    "dental lab management",
    "dental imaging",
    "dental supplies",
    "dental EHR",
    "dental appointment scheduling",
  ],
  authors: [
    {
      name: "DentalHub Team",
    },
  ],
  creator: "DentalHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dentalhub.com",
    title: "DentalHub - The Complete Dental Management Ecosystem",
    description:
      "Centralize, digitize, and integrate your dental practice with our all-in-one platform for clinics, labs, imaging centers, and suppliers.",
    siteName: "DentalHub",
    images: [
      {
        url: "https://dentalhub.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DentalHub - The Complete Dental Management Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DentalHub - The Complete Dental Management Ecosystem",
    description:
      "Centralize, digitize, and integrate your dental practice with our all-in-one platform for clinics, labs, imaging centers, and suppliers.",
    images: ["https://dentalhub.com/twitter-image.jpg"],
    creator: "@dentalhub",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "https://dentalhub.com/site.webmanifest",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
