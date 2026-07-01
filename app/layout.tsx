import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/toaster";
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
// link previews). Override with NEXT_PUBLIC_SITE_URL once a custom domain is live;
// otherwise falls back to the Vercel production URL, then localhost in dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Techmykel — Referral Rewards",
  description:
    "Refer customers to Techmykel phone repair and earn rewards — cash, airtime, or data.",
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
