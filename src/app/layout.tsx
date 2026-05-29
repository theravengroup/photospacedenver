import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/content/site-config";
import { organizationSchema, localBusinessSchema } from "@/lib/schema";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "photospace Denver — Studio Rental, Memberships & Gear Rental",
    template: "%s · photospace Denver",
  },
  description:
    "Denver's photo & video studio & gear-rental house since 2008 — a 1,900 ft² cyclorama studio with 24/7 access, plus camera, lighting & grip rental from top brands.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  keywords: [
    "photo studio rental Denver",
    "video studio rental Denver",
    "cyclorama wall Denver",
    "podcast studio Denver",
    "product photography studio Denver",
    "commercial photo studio Denver",
    "content creator studio Denver",
    "studio membership Denver",
    "gear rental Denver",
    "camera lighting grip rental Denver",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "photospace Denver — Studio & Gear Rental",
    description:
      "A custom-built photo & video studio for rent, and a full gear-rental house — cameras, lighting, and grip from the top brands. Under one roof in Denver since 2008.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "photospace Denver — Studio & Gear Rental",
    description:
      "A real working studio — 1,900 ft² floor, real cyclorama, 24/7 access — plus camera, lighting, and grip rental in Denver. Studio + gear, since 2008.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bone focus:outline focus:outline-2 focus:outline-tungsten"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <MobileStickyCTA />
        <div className="h-14 lg:hidden" aria-hidden />
        <JsonLd data={[organizationSchema(), localBusinessSchema()]} />
        <Analytics />
      </body>
    </html>
  );
}
