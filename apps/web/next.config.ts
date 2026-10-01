import type { NextConfig } from 'next';

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
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
