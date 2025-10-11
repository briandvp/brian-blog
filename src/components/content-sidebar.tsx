"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, List, ArrowUp } from "lucide-react";

type TableOfContentsItem = {
  id: string;
  text: string;
  level: number;
};

const tocItems: TableOfContentsItem[] = [
  { id: "QUE_ES_LA_DICOTOMIA_DE_CONTROL", text: "Qué es la dicotomía de control", level: 1 },
  { id: "TRICOTOMIA_DE_CONTROL", text: "Tricotomía de control", level: 1 },
  { id: "AHORRATE_DISGUSTOS_INUTILES", text: "Ahórrate disgustos inútiles", level: 1 },
  { id: "QUE_DEPENDE_DE_TI", text: "¿Qué depende de ti?", level: 1 },
  { id: "LLEVALO_A_LA_PRACTICA", text: "Llévalo a la práctica", level: 1 },
  { id: "TOMA_RESPONSABILIDAD", text: "Toma responsabilidad", level: 1 },
];

export function ContentSidebar() {
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
      }
    );

    // Observe all sections
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Show/hide sidebar based on scroll position
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Sidebar integrada para pantallas medianas (lg) */}
      <div className="sticky top-24 self-start lg:block 2xl:hidden">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <List className="h-5 w-5 text-gold" />
            <h3 className="font-semibold text-gray-800 text-sm">Contenido</h3>
          </div>

          <nav className="space-y-1 max-h-80 overflow-y-auto">
            {tocItems.map((item, index) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 group ${
                  activeSection === item.id
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    activeSection === item.id
                      ? "border-gold bg-gold text-white"
                      : "border-gray-300 text-gray-400 group-hover:border-gray-400"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-1 leading-tight">{item.text}</span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${
                    activeSection === item.id ? "text-gold rotate-90" : "text-transparent group-hover:text-gray-400"
                  }`} />
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={scrollToTop}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gold hover:text-white rounded-lg transition-colors duration-200 text-sm text-gray-600"
            >
              <ArrowUp className="h-4 w-4" />
              Volver arriba
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar flotante para pantallas grandes (xl+) */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden 2xl:block">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 w-64">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <List className="h-5 w-5 text-gold" />
              <h3 className="font-semibold text-gray-800 text-sm">Contenido</h3>
            </div>

            <nav className="space-y-1 max-h-80 overflow-y-auto">
              {tocItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-2 px-3 rounded-lg text-sm transition-all duration-200 group ${
                    activeSection === item.id
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                      activeSection === item.id
                        ? "border-gold bg-gold text-white"
                        : "border-gray-300 text-gray-400 group-hover:border-gray-400"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 leading-tight">{item.text}</span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${
                      activeSection === item.id ? "text-gold rotate-90" : "text-transparent group-hover:text-gray-400"
                    }`} />
                  </div>
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={scrollToTop}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gold hover:text-white rounded-lg transition-colors duration-200 text-sm text-gray-600"
              >
                <ArrowUp className="h-4 w-4" />
                Volver arriba
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
