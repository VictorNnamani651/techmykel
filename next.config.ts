import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached from this machine's LAN IP (e.g. when
  // testing the mobile view on a phone). Dev-only; ignored in production.
  allowedDevOrigins: ["192.168.86.142"],
};

export default nextConfig;
