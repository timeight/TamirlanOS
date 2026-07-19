import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>, so every asset URL needs that prefix.
// Empty during local development, set by the deploy workflow.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
