import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar completamente las herramientas de desarrollo de Next.js
  devIndicators: false,
  // Configurar la raíz del workspace para eliminar la advertencia
  outputFileTracingRoot: path.join(__dirname, '../../'),
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
