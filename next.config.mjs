/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar completamente las herramientas de desarrollo de Next.js
  devIndicators: false,
  // Configurar orígenes permitidos para desarrollo
  allowedDevOrigins: [
    '192.168.1.105', // IP desde la cual se está accediendo
    'localhost',
    '127.0.0.1',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
