import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true,
  },
   typescript: {
    ignoreBuildErrors: true, 
  },
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
  },
   
};

export default nextConfig;

