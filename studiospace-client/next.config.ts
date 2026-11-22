
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://studiospace-ms6z.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
