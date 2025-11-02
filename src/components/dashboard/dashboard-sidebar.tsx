"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Edit,
  ShoppingBag
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigation = [
    { nameKey: 'dashboard.sidebar.dashboard', href: "/dashboard", icon: LayoutDashboard },
    { nameKey: 'dashboard.sidebar.posts', href: "/dashboard/posts", icon: FileText },
    { nameKey: 'dashboard.sidebar.newPost', href: "/dashboard/posts/new", icon: Plus },
    { nameKey: 'dashboard.sidebar.users', href: "/dashboard/users", icon: Users },
    { nameKey: 'dashboard.sidebar.comments', href: "/dashboard/comments", icon: Users },
    { nameKey: 'dashboard.sidebar.store', href: "/dashboard/store", icon: ShoppingBag },
    { nameKey: 'dashboard.sidebar.analytics', href: "/dashboard/analytics", icon: BarChart3 },
    { nameKey: 'dashboard.sidebar.settings', href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">{t('dashboard.sidebar.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('dashboard.sidebar.subtitle')}</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#42403e] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {t(item.nameKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          {t('dashboard.sidebar.quickActions')}
        </h3>
        <div className="space-y-2">
          <Link
            href="/dashboard/posts/new"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <Plus className="h-4 w-4 mr-3" />
            {t('dashboard.sidebar.createPost')}
          </Link>
          <Link
            href="/dashboard/posts"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <Edit className="h-4 w-4 mr-3" />
            {t('dashboard.sidebar.managePosts')}
          </Link>
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:translate-x-1"
          >
            <Eye className="h-4 w-4 mr-3" />
            {t('dashboard.sidebar.viewBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
}

