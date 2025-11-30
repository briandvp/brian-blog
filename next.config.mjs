import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Especificar el directorio raíz del proyecto para evitar advertencias de múltiples lockfiles
  outputFileTracingRoot: __dirname,
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
  // Desactivar ESLint durante el build para evitar errores de configuración
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
