/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains
        port: '', // No specific port
        pathname: '/**', // Allows all paths
      },
    ]
  },
}

module.exports = nextConfig
