import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true, remotePatterns: [{ protocol: "https", hostname: "**" }] },
  output: "export",
  trailingSlash: true,
  distDir: "out",
};

export default nextConfig;
