import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#42403e] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <Link
              href="/politica-privacidad/"
              className="text-gray-300 hover:text-white text-sm"
            >
              Política de privacidad
            </Link>
            <Link
              href="/aviso-legal/"
              className="text-gray-300 hover:text-white text-sm"
            >
              Aviso legal
            </Link>
            <Link
              href="/politica-de-cookies/"
              className="text-gray-300 hover:text-white text-sm"
            >
              Política de cookies
            </Link>
            <Link
              href="/condiciones-de-venta/"
              className="text-gray-300 hover:text-white text-sm"
            >
              Condiciones de venta
            </Link>
          </div>

          <p className="text-sm text-gray-300">
            {currentYear} brian-blog
          </p>

          <div className="mt-4 text-xs text-gray-400 max-w-2xl text-center">
            <p>
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.
              Puede obtener más información <Link href="politica-de-cookies/" className="text-gold hover:underline">aquí</Link>.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="text-gold hover:underline">Configuración</button>
              <button className="text-gold hover:underline">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
