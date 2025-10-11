import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, MessageSquare, User2 } from "lucide-react";

export function ArticleHeader() {
  return (
    <div className="mb-12">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#42403e]/50 to-transparent opacity-30 rounded-xl"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 relative z-10">
          <span className="inline-block py-2 px-4 border-b-4 border-gold">LA DICOTOMÍA DE CONTROL</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm relative z-10">
          <Link
            href="/categoria/principios-estoicos"
            className="bg-[#42403e] text-white px-3 py-1.5 rounded-full hover:bg-gold transition-colors duration-300 flex items-center"
          >
            Principios 
          </Link>
          <div className="flex items-center text-gray-600 gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>16 abril 2020</span>
          </div>
          <div className="flex items-center text-gray-600 gap-1.5">
            <User2 className="h-4 w-4" />
            <Link
              href="/author/brian-gamarra"
              className="hover:text-gold"
            >
              Brian Gamarra
            </Link>
          </div>
          <div className="flex items-center text-gray-600 gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <Link
              href="#comments"
              className="hover:text-gold"
            >
              10 Comments
            </Link>
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-10 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="font-medium text-lg text-center">
          <strong className="text-gold">La dicotomía del control,</strong> una de las herramientas utilizadas desde hace más de 2.5oo años más útil y sencillas de implementar en nuestro día a día.
        </p>
        <p className="text-center">
          Aparentemente puede resultar obvia, no obstante, su aplicación no es tan fácil, y la falta de ésta es lo que ocasiona muchas veces, un sufrimiento humano innecesario.
        </p>
        <p className="text-center">
          Esta herramienta nos ayuda a identificar qué es lo que depende de nosotros y qué no. <strong>Dicotomía</strong> quiere decir que hay <strong>dos respuestas</strong> posibles ante cualquier situación.
        </p>
      </div>

      <div className="flex justify-center mb-10 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-gold to-amber-200 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-300"></div>
        <Image
          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="Escritura y reflexión filosófica"
          width={1024}
          height={600}
          className="relative rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Tabla de contenidos
        </h2>
        <ul className="space-y-3">
          {[
            { id: "QUE_ES_LA_DICOTOMIA_DE_CONTROL", text: "QUÉ ES LA DICOTOMÍA DE CONTROL" },
            { id: "TRICOTOMIA_DE_CONTROL", text: "TRICOTOMÍA DE CONTROL" },
            { id: "AHORRATE_DISGUSTOS_INUTILES", text: "AHÓRRATE DISGUSTOS INÚTILES" },
            { id: "QUE_DEPENDE_DE_TI", text: "¿QUÉ DEPENDE DE TI?" },
            { id: "LLEVALO_A_LA_PRACTICA", text: "LLÉVALO A LA PRÁCTICA" },
            { id: "TOMA_RESPONSABILIDAD", text: "TOMA RESPONSABILIDAD" }
          ].map((item, index) => (
            <li key={item.id} className="group">
              <Link
                href={`#${item.id}`}
                className="flex items-center gap-3 text-gold hover:text-amber-800 transition-colors"
              >
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                  {index + 1}
                </span>
                <span className="font-medium">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
