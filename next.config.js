/** @type {import('next').NextConfig} */
const nextConfig = {
  // Penting: jangan set `output: 'export'`
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'gneffrsbfjajsipxogqt.supabase.co', // <-- Avatar Supabase
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // <-- Avatar fallback
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // <-- TAMBAHKAN INI (Untuk Google Login)
      },
    ],
  },
  
  // optional: kalau mau pastikan nodejs runtime default
  experimental: {
    // biarkan default; tidak perlu edge untuk auth
    // Penting: jadikan @sparticuz/chromium sebagai external package
    // supaya folder /node_modules/@sparticuz/chromium/bin ikut tersedia
    // di lingkungan serverless Vercel (tidak di-bundle ke dalam .next saja).
    serverComponentsExternalPackages: ["@sparticuz/chromium"],
  },
};

module.exports = nextConfig;