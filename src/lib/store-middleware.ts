import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { ADMIN_PERMISSIONS } from '@/lib/permissions'

export async function withStoreAccess(request: NextRequest) {
  const auth = await withAuth(request, ADMIN_PERMISSIONS.VIEW_STORE)
  if ('error' in auth) {
    // Si el usuario no está autenticado o no tiene el permiso específico,
    // aún así permitimos el acceso pero sin funcionalidades de administración
    return { isAdmin: false }
  }
  // Si no hay error, auth contiene el objeto user
  return { isAdmin: 'user' in auth && auth.user.role === 'ADMIN' }
}