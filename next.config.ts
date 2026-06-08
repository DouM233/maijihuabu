import type { NextConfig } from 'next';

const lanAllowedDevOrigins = [
  '*.dev.coze.site',
  'localhost:5000',
  '127.0.0.1:5000',
  '192.168.9.86:5000',
  process.env.LAN_DEV_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: lanAllowedDevOrigins,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
