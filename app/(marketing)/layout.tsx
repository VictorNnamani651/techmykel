import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { BackToTop } from "@/components/marketing/back-to-top";

// Nested layout for public marketing pages. The root app/layout.tsx already
// provides <html>/<body>; this only adds the shared header + footer chrome.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <BackToTop />
    </div>
  );
}
