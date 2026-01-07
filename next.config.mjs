/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
<<<<<<< HEAD
    ignoreBuildErrors: true,  // ← Adaugă asta
  },
  eslint: {
    ignoreDuringBuilds: true, // ← Și asta
  },
}

module.exports = nextConfig
=======
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
>>>>>>> b6d820a0930ac279c0d48f31cfcdb90e95cca645
