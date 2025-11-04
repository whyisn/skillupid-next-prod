/** @type {import('next').NextConfig} */
const nextConfig = {
  // Penting: jangan set `output: 'export'`
  images: {
    // sesuaikan jika pakai next/image dari domain luar
    domains: ['images.unsplash.com'],
  },
  // optional: kalau mau pastikan nodejs runtime default
  experimental: {
    // biarkan default; tidak perlu edge untuk auth
  },
};
module.exports = nextConfig;
