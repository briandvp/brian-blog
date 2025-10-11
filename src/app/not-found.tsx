import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
        <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#42403e] text-white px-6 py-3 rounded-lg hover:bg-gold transition-colors duration-300"
        >
          <Home className="h-5 w-5" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
