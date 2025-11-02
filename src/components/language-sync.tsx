"use client"

import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"

/**
 * Componente que sincroniza el atributo lang del HTML con el idioma del contexto
 */
export function LanguageSync() {
  const { language } = useLanguage()

  useEffect(() => {
    // Actualizar el atributo lang del elemento HTML
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  return null
}

