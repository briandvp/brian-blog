"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Si el usuario no está autenticado
      if (!user) {
        toast.error('Debes iniciar sesión para acceder al dashboard');
        router.push('/');
        return;
      }

      // Si el usuario no tiene los permisos necesarios
      if (!['ADMIN', 'AUTHOR'].includes(user.role)) {
        toast.error('No tienes permisos para acceder al dashboard');
        router.push('/');
        return;
      }

      // Si todo está bien, quitar el loading
      setIsLoading(false);
    };

    // Ejecutar la verificación de autenticación
    checkAuth();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#42403e]" />
          <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20">
            <Loader2 className="h-12 w-12 text-[#42403e]" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

