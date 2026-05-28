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
    default: "PhotoSpace Denver — Studio Rental, Memberships & Gear Rental",
    template: "%s · PhotoSpace Denver",
  },
  description:
    "Denver's creative production hub since 2008. A 1,900 ft² shooting floor with a real cyclorama, pro lighting and grip included, 24/7 access, plus gear rental, memberships, and production services. Where serious creators work.",
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
    "production studio Denver",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "PhotoSpace Denver — Denver's Creative Production Hub",
    description:
      "Studio rental, memberships, gear rental, podcast & interview production, and full production services — under one roof in Denver since 2008.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoSpace Denver — Denver's Creative Production Hub",
    description:
      "A real working studio: 1,900 ft² floor, cyclorama, pro gear included, 24/7 access. Studio rental, memberships, and gear rental in Denver.",
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
