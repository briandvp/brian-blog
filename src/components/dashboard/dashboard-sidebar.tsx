"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Edit
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Publicaciones", href: "/dashboard/posts", icon: FileText },
  { name: "Nueva publicación", href: "/dashboard/posts/new", icon: Plus },
  { name: "Comentarios", href: "/dashboard/comments", icon: Users },
  { name: "Analíticas", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Panel de Control</h2>
        <p className="text-sm text-gray-600 mt-1">Gestiona brian-blog</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#42403e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Acciones rápidas
        </h3>
        <div className="space-y-2">
          <Link
            href="/dashboard/posts/new"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-3" />
            Crear publicación
          </Link>
          <Link
            href="/dashboard/posts"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4 mr-3" />
            Gestionar posts
          </Link>
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4 mr-3" />
            Ver blog
          </Link>
        </div>
      </div>
    </div>
  );
}

