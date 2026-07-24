import type { NextConfig } from "next";

// Port is a CLI concern in Next.js and cannot be set here —
// it is pinned to 3003 via `-p 3003` in the package.json dev/start scripts.
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
