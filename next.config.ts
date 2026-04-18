import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mengoptimalkan format gambar (AVIF dulu untuk ukuran lebih kecil)
    formats: ['image/avif', 'image/webp'],
    // Mengatur ukuran gambar yang didukung
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Mengaktifkan optimasi gambar
    unoptimized: false,
    // Mengatur domain yang diizinkan untuk gambar eksternal
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.latihan.id',
      },
      {
        protocol: 'https',
        hostname: 'latihan.id',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Mengaktifkan kompresi
  compress: true,
  // Optimasi package imports untuk tree-shaking lebih baik
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
};

export default nextConfig;
