'use client'

import { useState } from 'react'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'
import { Button } from '@/components/ui/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 p-4">
      {/* Fondo con elementos estoicos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Patrón de círculos concéntricos representando la templanza */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-slate-600/20 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-24 h-24 border border-slate-500/30 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-slate-400/40 rounded-full"></div>
        
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 border border-slate-600/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-slate-500/30 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border border-slate-400/40 rounded-full"></div>
        
        {/* Líneas sutiles representando el equilibrio */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-slate-600/30 to-transparent"></div>
        
        {/* Textura sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.1),transparent_50%)]"></div>
        
        {/* Símbolos de templanza - Escala de equilibrio */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 opacity-20">
          <div className="w-full h-0.5 bg-slate-400 absolute top-1/2"></div>
          <div className="w-0.5 h-4 bg-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Símbolos de templanza - Montaña (estabilidad) */}
        <div className="absolute bottom-1/4 left-1/3 w-6 h-6 opacity-15">
          <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-l-transparent border-r-transparent border-b-slate-400"></div>
        </div>
        
        {/* Puntos de luz representando la sabiduría */}
        <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-slate-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/5 left-1/5 w-1 h-1 bg-slate-300 rounded-full opacity-30"></div>
        <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-slate-300 rounded-full opacity-30"></div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-lg max-w-md w-full relative shadow-2xl border border-slate-200/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm 
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
