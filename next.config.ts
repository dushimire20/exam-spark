import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   typescript: {
    ignoreBuildErrors: true, // ⚠️ Avoid unless absolutely necessary
  },
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
