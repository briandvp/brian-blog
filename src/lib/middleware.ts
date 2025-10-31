import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromSession } from './auth'
import { hasPermission, Permission } from './permissions'

export async function withAuth(
  request: NextRequest,
  requiredPermission?: Permission
) {
  const user = await getUserFromSession(request)

  if (!user) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    )
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 403 }
    )
  }

  return { user }
}