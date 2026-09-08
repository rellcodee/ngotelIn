import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mengizinkan domain gambar dari Unsplash dan gambar eksternal
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
    ],
  },
};

export default nextConfig;
