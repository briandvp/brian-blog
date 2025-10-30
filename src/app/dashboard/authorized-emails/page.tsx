"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface AuthorizedEmail {
  id: string
  email: string
  role: 'ADMIN' | 'AUTHOR'
  createdAt: string
  active: boolean
}

export default function AuthorizedEmailsPage() {
  const [emails, setEmails] = useState<AuthorizedEmail[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setIsFetching(true)
      const response = await fetch('/api/auth/authorized-emails', { credentials: 'include' })
      const data = await response.json()
      if (response.ok) {
        setEmails(data)
      } else {
        setError(data.error || 'Error al cargar los emails')
      }
    } catch (error) {
      setError('Error al cargar los emails')
    } finally {
      setIsFetching(false)
    }
  }

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/authorized-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: newEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmails([data, ...emails])
        setNewEmail('')
      } else {
        setError(data.error || 'Error al añadir el email')
      }
    } catch (error) {
      setError('Error al añadir el email')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      const response = await fetch('/api/auth/authorized-emails', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setEmails(emails.filter(email => email.id !== id))
      } else {
        const data = await response.json()
        setError(data.error || 'Error al eliminar el email')
      }
    } catch (error) {
      setError('Error al eliminar el email')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestión de Correos Autorizados</h1>
        <Button
          onClick={fetchEmails}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>
      
      {/* Formulario para añadir nuevo email */}
      <form onSubmit={handleAddEmail} className="mb-8">
        <div className="flex gap-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Ingresa un correo electrónico"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gold hover:bg-gold/90"
          >
            {loading ? 'Añadiendo...' : 'Añadir'}
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-red-500">{error}</p>
        )}
      </form>

      {/* Lista de emails autorizados */}
      <div className="space-y-4">
        {emails.map((email) => (
          <div 
            key={email.id} 
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-medium">{email.email}</p>
              <p className="text-sm text-gray-500">
                Añadido el {new Date(email.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              onClick={() => handleDeleteEmail(email.id)}
              variant="destructive"
              size="sm"
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}