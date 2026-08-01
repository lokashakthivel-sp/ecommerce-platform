import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const catalogUrl = process.env.CATALOG_URL || 'http://localhost:8081';
    const cartUrl = process.env.CART_URL || 'http://localhost:8082';
    const orderUrl = process.env.ORDER_URL || 'http://localhost:8083';
    const userUrl = process.env.USER_URL || 'http://localhost:8084';

    return [
      {
        source: '/api/products/:path*',
        destination: `${catalogUrl}/products/:path*`,
      },
      {
        source: '/api/cart/:path*',
        destination: `${cartUrl}/cart/:path*`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${orderUrl}/orders/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${userUrl}/auth/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${userUrl}/users/:path*`,
      },
    ];
  },
};

export default nextConfig;