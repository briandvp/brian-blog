import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { Role } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: Role
}

export async function getUserFromSession(request: NextRequest): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value
    
    if (!session) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return user as AuthUser | null
  } catch (error) {
    console.error('Error getting user from session:', error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password)
  
  // Verifica si el email está en la lista de autorizados
  const authorizedEmail = await prisma.authorizedEmail.findUnique({
    where: { email }
  })
  
  // El email 1brianone1@gmail.com siempre será admin
  const isAdmin = email === '1brianone1@gmail.com'
  
  const role = isAdmin ? Role.ADMIN : (authorizedEmail?.role as Role || Role.USER)
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function verifyUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await getUserByEmail(email)
  
  if (!user) {
    return null
  }
  
  const isValid = await verifyPassword(password, user.password)
  
  if (!isValid) {
    return null
  }
  
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  }
}
