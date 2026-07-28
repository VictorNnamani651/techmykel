import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be reached from any LAN/hotspot IP (e.g. when
  // testing the mobile view on a phone), so a DHCP-changed address never needs
  // editing here. Each "*" matches one IP octet. Dev-only; ignored in
  // production, where this option has no effect.
  allowedDevOrigins: ["*.*.*.*"],
};

export default nextConfig;
