import { Role } from '@prisma/client'
import { AuthUser } from '@/lib/auth'

export const ADMIN_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_POSTS: 'manage_posts',
  MANAGE_COMMENTS: 'manage_comments',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ROLES: 'manage_roles',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_AUTHORIZED_EMAILS: 'manage_authorized_emails',
  MANAGE_STORE: 'manage_store',
  VIEW_STORE: 'view_store',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
} as const

export const AUTHOR_PERMISSIONS = {
  CREATE_POSTS: 'create_posts',
  EDIT_OWN_POSTS: 'edit_own_posts',
  DELETE_OWN_POSTS: 'delete_own_posts',
  MODERATE_OWN_COMMENTS: 'moderate_own_comments',
  VIEW_OWN_ANALYTICS: 'view_own_analytics',
} as const

export const USER_PERMISSIONS = {
  READ_POSTS: 'read_posts',
  CREATE_COMMENTS: 'create_comments',
  EDIT_OWN_COMMENTS: 'edit_own_comments',
} as const

export type Permission = 
  | typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS]
  | typeof AUTHOR_PERMISSIONS[keyof typeof AUTHOR_PERMISSIONS]
  | typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS]

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    ...Object.values(ADMIN_PERMISSIONS),
    ...Object.values(AUTHOR_PERMISSIONS),
    ...Object.values(USER_PERMISSIONS),
  ],
  AUTHOR: [
    ...Object.values(AUTHOR_PERMISSIONS),
    ...Object.values(USER_PERMISSIONS),
  ],
  USER: [...Object.values(USER_PERMISSIONS)],
}

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false
  return ROLE_PERMISSIONS[user.role].includes(permission)
}

export function canManageResource(user: AuthUser | null, resourceOwnerId: string): boolean {
  if (!user) return false
  return user.role === 'ADMIN' || user.id === resourceOwnerId
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN'
}

export function isAuthor(user: AuthUser | null): boolean {
  return user?.role === 'AUTHOR'
}

export function canAccessDashboard(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'AUTHOR'
}