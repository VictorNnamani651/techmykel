import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/toaster";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

// Geist = display/headings; Inter = body/functional text (per docs DESIGN.md).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Absolute base for resolving OG/Twitter image URLs (needed for WhatsApp/Facebook
// link previews). See lib/site-url.ts for why this is not inlined here.
const siteUrl = getSiteUrl();

// Techmykel is a phone-repair business first; Refer & Earn is a secondary offer
// (ADR-0009). The default title is therefore the business, and every other route
// — /refer, the referrer app, admin — appends to it via the template.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Techmykel — Phone Repairs in Abakaliki",
    template: "%s · Techmykel",
  },
  description:
    "Screen, battery, water-damage and charging-port repairs in Abakaliki, Ebonyi State. Free diagnosis, quote before we start, no fix no fee. Trusted since 2022.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* With JS disabled the scroll-reveal observer never runs, so force any
            reveal elements visible (progressive enhancement). */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
        {children}
        <Suspense>
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
