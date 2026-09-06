import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The Λέξις prototype page is redeployed often and phones held stale
  // copies; serve it uncached so every open shows the current build.
  async headers() {
    return [
      // Both: '/flipsi' is the page's own URL, ':path*' its files and functions' assets.
      { source: '/flipsi', headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] },
      { source: '/flipsi/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] },
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
