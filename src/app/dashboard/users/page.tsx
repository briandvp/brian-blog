"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users,
  Shield,
  UserCog,
  RefreshCw,
  Filter,
  User as UserIcon,
  Calendar
} from "lucide-react";
import { CardSkeleton } from "@/components/dashboard/skeleton-loader";

interface UserStats {
  total: number;
  admin: number;
  author: number;
  user: number;
}

interface LoadingState {
  table: boolean;
  action: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    table: true,
    action: false
  });
  const [filter, setFilter] = useState<string>("all");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, table: true }));
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("No tienes permisos para ver los usuarios");
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : "Error al cargar los usuarios"
      );
    } finally {
      setIsLoading(prev => ({ ...prev, table: false }));
    }
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsLoading(prev => ({ ...prev, action: true }));
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success("Rol actualizado correctamente");
        fetchUsers();
      } else {
        toast.error("Error al actualizar el rol");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error al actualizar el rol");
    } finally {
      setIsLoading(prev => ({ ...prev, action: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getStats = (users: User[]): UserStats => {
    return {
      total: users.length,
      admin: users.filter(user => user.role === 'ADMIN').length,
      author: users.filter(user => user.role === 'AUTHOR').length,
      user: users.filter(user => user.role === 'USER').length
    };
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
      AUTHOR: "bg-blue-100 text-blue-800 border-blue-200",
      USER: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const labels = {
      ADMIN: "Administrador",
      AUTHOR: "Autor",
      USER: "Usuario"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  const stats = getStats(users);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading.table && users.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
              <p className="text-gray-600 mt-2">Gestiona los usuarios y sus roles en la plataforma</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isLoading.table}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading.table ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="ADMIN">Administradores</option>
                <option value="AUTHOR">Autores</option>
                <option value="USER">Usuarios</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admin}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCog className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Autores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.author}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.user}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Usuarios {filter !== "all" && `(${filter})`}
            </h2>
          </div>
          
          {isLoading.table ? (
            <div className="p-8 text-center">
              <div className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4">
                <RefreshCw className="h-8 w-8" />
              </div>
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de registro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Sin nombre'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isLoading.action}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="USER">Usuario</option>
                          <option value="AUTHOR">Autor</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}