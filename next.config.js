/** @type {import('next').NextConfig} */
const nextConfig = {
  // Penting: jangan set `output: 'export'`
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // <-- Domain Anda yang sudah ada
      },
      {
        protocol: 'https',
        hostname: 'gneffrsbfjajsipxogqt.supabase.co', // <-- Untuk avatar Supabase
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // <-- Untuk avatar fallback
      },
    ],
  },
  
  // optional: kalau mau pastikan nodejs runtime default
  experimental: {
    // biarkan default; tidak perlu edge untuk auth
  },
};

module.exports = nextConfig;