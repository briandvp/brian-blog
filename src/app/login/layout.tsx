'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Este layout oculta el footer y navbar del layout raíz
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Ocultar footer y navbar cuando estamos en /login
    if (pathname === '/login') {
      const footer = document.querySelector('footer')
      const navbar = document.querySelector('header')
      if (footer) footer.style.display = 'none'
      if (navbar) navbar.style.display = 'none'
    }

    return () => {
      // Restaurar al salir
      const footer = document.querySelector('footer')
      const navbar = document.querySelector('header')
      if (footer) footer.style.display = ''
      if (navbar) navbar.style.display = ''
    }
  }, [pathname])

  return <>{children}</>
}

