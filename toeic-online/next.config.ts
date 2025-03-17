const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during build
  },
  onDemandEntries: {
    // Continue building even if some pages fail to prerender
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optional: Disable static generation for the /exams page
  experimental: {
    disableOptimizedLoading: true,
  },
};

export default nextConfig;
