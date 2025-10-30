import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const TEMP_PASSWORD = 'changeme123' // Contraseña temporal para nuevos usuarios autorizados

// GET /api/auth/authorized-emails
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const authorizedEmails = await prisma.user.findMany({
      where: {
        role: 'AUTHOR'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(authorizedEmails)
  } catch (error) {
    console.error('Error al obtener emails autorizados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/auth/authorized-emails
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { email, role = 'AUTHOR' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Actualizar el rol si el usuario ya existe
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'AUTHOR' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      })
      return NextResponse.json(updatedUser)
    }

    // Crear un nuevo usuario con rol de autor
    const newUser = await prisma.user.create({
      data: {
        email,
        role: 'AUTHOR',
        // Se establecerá una contraseña temporal que deberá ser cambiada en el primer login
        password: await bcrypt.hash('changeme', 12),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error al crear email autorizado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/authorized-emails
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'El ID es requerido' },
        { status: 400 }
      )
    }

    // En lugar de eliminar el usuario, le quitamos el rol de autor
    await prisma.user.update({
      where: { id },
      data: { role: 'USER' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar email autorizado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}