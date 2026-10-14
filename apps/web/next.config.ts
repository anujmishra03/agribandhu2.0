import type { NextConfig } from 'next';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const nextConfig: NextConfig = {
  transpilePackages: ['@agribandhu/ui', '@agribandhu/types'],
  reactStrictMode: true,
  eslint: {
    // Allow production builds to successfully complete even if the project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if the project has type errors.
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
