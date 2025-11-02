"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage, Language } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface LanguageSelectorProps {
  variant?: "desktop" | "mobile"
}

export function LanguageSelector({ variant = "desktop" }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
    // Forzar re-render del componente
    window.dispatchEvent(new Event('languagechange'))
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200 group w-full"
            >
              <Globe className="h-5 w-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
              <span className="font-medium group-hover:text-[#D4AF37] transition-colors">
                {t('nav.language')}
              </span>
              <span className="ml-auto text-gray-400 text-sm">
                {language === 'es' ? 'ES' : 'EN'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 bg-[#42403e] text-white border-gray-600 shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => handleLanguageChange('es')}
              className={`hover:bg-white/10 cursor-pointer focus:bg-white/10 transition-colors ${
                language === 'es' ? 'bg-white/10' : ''
              }`}
            >
              <span className="flex items-center gap-2 w-full">
                {t('language.spanish')}
                {language === 'es' && <span className="ml-auto text-[#D4AF37]">✓</span>}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange('en')}
              className={`hover:bg-white/10 cursor-pointer focus:bg-white/10 transition-colors ${
                language === 'en' ? 'bg-white/10' : ''
              }`}
            >
              <span className="flex items-center gap-2 w-full">
                {t('language.english')}
                {language === 'en' && <span className="ml-auto text-[#D4AF37]">✓</span>}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Variante desktop (para navbar) o cuenta (para página de cuenta)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-2 px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span>{t('nav.language')}</span>
          </div>
          <span className="text-sm text-gray-500">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-white text-gray-900 border-gray-200 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => handleLanguageChange('es')}
          className={`hover:bg-gray-100 cursor-pointer focus:bg-gray-100 transition-colors ${
            language === 'es' ? 'bg-gray-50' : ''
          }`}
        >
          <span className="flex items-center gap-2 w-full">
            {t('language.spanish')}
            {language === 'es' && <span className="ml-auto text-[#42403e] font-bold">✓</span>}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={`hover:bg-gray-100 cursor-pointer focus:bg-gray-100 transition-colors ${
            language === 'en' ? 'bg-gray-50' : ''
          }`}
        >
          <span className="flex items-center gap-2 w-full">
            {t('language.english')}
            {language === 'en' && <span className="ml-auto text-[#42403e] font-bold">✓</span>}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

