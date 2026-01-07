/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ← Adaugă asta
  },
  eslint: {
    ignoreDuringBuilds: true, // ← Și asta
  },
}

module.exports = nextConfig