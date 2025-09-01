import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {hostname: "research-storage-s3.s3.us-east-1.amazonaws.com"}
        ]
    }
};

export default nextConfig;
