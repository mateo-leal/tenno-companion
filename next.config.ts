import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://wiki.warframe.com/images/**')],
  },
}

export default nextConfig
