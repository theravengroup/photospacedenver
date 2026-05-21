import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://photospacedenver.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Denver Camera, Lighting, Grip & Production Rentals — PhotoSpace",
    template: "%s — PhotoSpace Denver",
  },
  description:
    "PhotoSpace is Denver's home for professional production: photo and video equipment rentals, in-studio and on-location, since 2008. Profoto, Phase One, Hasselblad, Blackmagic, Sennheiser and more.",
  applicationName: "PhotoSpace Denver",
  authors: [{ name: "PhotoSpace Denver" }],
  keywords: [
    "Denver camera rental",
    "Denver video equipment rental",
    "Denver lighting rental",
    "Denver grip rental",
    "Denver production rentals",
    "Colorado production equipment rental",
    "Phase One rental Denver",
    "Profoto rental Denver",
    "Hasselblad rental Denver",
    "Blackmagic rental Denver",
    "Denver photo studio rental",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "PhotoSpace Denver",
    title: "Denver's home for professional production",
    description:
      "Photo and video equipment rentals, in-studio and on-location. Serving Denver and Colorado productions since 2008.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Denver's home for professional production",
    description:
      "Photo and video equipment rentals, in-studio and on-location. Serving Denver and Colorado productions since 2008.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Set the .js flag before first paint so reveal-on-scroll knows
            JS is live. Without this, .reveal stays visible at opacity 1
            and the page never depends on the IntersectionObserver to
            unhide content. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-graphite font-sans">
        {children}
      </body>
    </html>
  );
}
