import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The Λέξις prototype page is redeployed often and phones held stale
  // copies; serve it uncached so every open shows the current build.
  async headers() {
    return [
      {
        source: '/flipsi/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.figma.com' },
    ],
  },
}

export default nextConfig
