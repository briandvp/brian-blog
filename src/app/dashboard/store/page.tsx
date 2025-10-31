"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Package, Settings, Loader2 } from "lucide-react";

export default function StoreDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }
    
    if (user.role !== 'ADMIN') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Tienda</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona productos, pedidos y configuración de la tienda
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pedidos Pendientes</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Ingresos del Mes</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Productos en Stock</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Productos</h3>
              <p className="text-sm text-gray-600">Gestiona el catálogo de productos</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Button variant="default" className="w-full" onClick={() => {}}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {}}>
              Ver Catálogo
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Pedidos</h3>
          <p className="text-sm text-gray-600 mb-4">Administra los pedidos recibidos</p>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <Package className="h-4 w-4 mr-2" />
            Ver Pedidos
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Configuración</h3>
          <p className="text-sm text-gray-600 mb-4">Ajusta la configuración de la tienda</p>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>
    </div>
  );
}