import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBase = process.env.API_BASE_URL || 'http://localhost';

    return [
      {
        source: '/api/products/:path*',
        destination: `${apiBase}:8081/products/:path*`,
      },
      {
        source: '/api/cart/:path*',
        destination: `${apiBase}:8082/cart/:path*`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${apiBase}:8083/orders/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${apiBase}:8084/auth/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${apiBase}:8084/users/:path*`,
      },
    ];
  },
};

export default nextConfig;