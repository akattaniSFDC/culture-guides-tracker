/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  // Server-only env vars (Google Sheets, Slack, HuggingFace) are accessed
  // directly via process.env in API routes — no need to expose them here.
  // Only NEXT_PUBLIC_* vars are needed in this block for client-side access.
}

export default nextConfig
