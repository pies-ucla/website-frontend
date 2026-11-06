import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fewer sizes = fewer resize jobs per photo
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256],
    // Let browsers and the CDN cache resized images for 31 days
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
