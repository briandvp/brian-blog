"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Target,
  Award,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalUsers: number;
    totalComments: number;
    totalSubscribers: number;
  };
  monthlyStats: {
    views: number;
    posts: number;
    comments: number;
  };
  topPosts: Array<{ title: string; views: number; comments: number }>;
  monthlyData: Array<{ date: string; views: number; posts: number; comments: number }>;
}

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const TableSkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </td>
  </tr>
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Error fetching analytics');
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    gradient,
    iconBg
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "increase" | "decrease";
    icon: any;
    gradient: string;
    iconBg: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:border-gray-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`inline-flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${changeType === "increase"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
              }`}>
              {changeType === "increase" ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${gradient}`} />
        </div>
      </div>
    </div>
  );

  const QuickStatCard = ({
    title,
    value,
    icon: Icon,
    color
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
              <p className="text-gray-600 mt-2">Métricas y estadísticas de tu blog</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={loading}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#42403e] focus:border-transparent shadow-sm text-sm font-medium"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold">Error al cargar analíticas</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>

            {/* Stats Sections Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left"><div className="h-3 bg-gray-200 rounded w-16"></div></th>
                    <th className="px-6 py-3 text-left"><div className="h-3 bg-gray-200 rounded w-12"></div></th>
                    <th className="px-6 py-3 text-left"><div className="h-3 bg-gray-200 rounded w-20"></div></th>
                    <th className="px-6 py-3 text-left"><div className="h-3 bg-gray-200 rounded w-20"></div></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <TableSkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Content */}
        {!loading && analytics && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Vistas totales"
                value={analytics.overview.totalViews.toLocaleString()}
                change="+12.5%"
                changeType="increase"
                icon={Eye}
                gradient="text-blue-600"
                iconBg="bg-blue-50"
              />
              <StatCard
                title="Usuarios"
                value={analytics.overview.totalUsers.toLocaleString()}
                change="+8.2%"
                changeType="increase"
                icon={Users}
                gradient="text-emerald-600"
                iconBg="bg-emerald-50"
              />
              <StatCard
                title="Comentarios"
                value={analytics.overview.totalComments}
                change="+15.3%"
                changeType="increase"
                icon={MessageSquare}
                gradient="text-purple-600"
                iconBg="bg-purple-50"
              />
              <StatCard
                title="Suscriptores"
                value={analytics.overview.totalSubscribers.toLocaleString()}
                change="+5.1%"
                changeType="increase"
                icon={Zap}
                gradient="text-amber-600"
                iconBg="bg-amber-50"
              />
            </div>

            {/* Chart and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tendencia de vistas</h3>
                    <p className="text-sm text-gray-500">Últimos 30 días</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#42403e]"></div>
                      <span className="text-xs text-gray-500">Vistas</span>
                    </div>
                  </div>
                </div>

                {analytics.monthlyData.length > 0 ? (
                  <div className="h-64 flex items-end justify-between gap-1">
                    {analytics.monthlyData.map((data, index) => {
                      const maxViews = Math.max(...analytics.monthlyData.map(d => d.views), 1);
                      const height = (data.views / maxViews) * 100;
                      const date = new Date(data.date);
                      const day = date.getDate();

                      return (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                          <div className="relative w-full flex justify-center">
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              {data.views} vistas
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                            <div
                              className="bg-gradient-to-t from-[#42403e] to-[#5a5856] rounded-t w-full transition-all duration-300 group-hover:from-[#36312f] group-hover:to-[#4a4846] cursor-pointer"
                              style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 mt-2 font-medium">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay datos disponibles</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Estadísticas del mes</h3>
                </div>
                <div className="space-y-3">
                  <QuickStatCard
                    title="Vistas"
                    value={analytics.monthlyStats.views.toLocaleString()}
                    icon={Eye}
                    color="bg-blue-500"
                  />
                  <QuickStatCard
                    title="Posts publicados"
                    value={analytics.monthlyStats.posts}
                    icon={Calendar}
                    color="bg-emerald-500"
                  />
                  <QuickStatCard
                    title="Comentarios"
                    value={analytics.monthlyStats.comments}
                    icon={MessageSquare}
                    color="bg-purple-500"
                  />
                  <QuickStatCard
                    title="Promedio por post"
                    value={analytics.topPosts.length > 0
                      ? Math.round(analytics.topPosts.reduce((sum, p) => sum + p.views, 0) / analytics.topPosts.length)
                      : 0}
                    icon={TrendingUp}
                    color="bg-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Top Posts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <Award className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Publicaciones más populares</h3>
              </div>

              {analytics.topPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Vistas
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Comentarios
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Rendimiento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {analytics.topPosts.map((post, index) => {
                        const maxViews = Math.max(...analytics.topPosts.map(p => p.views));
                        const percentage = Math.round((post.views / maxViews) * 100);
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-600' :
                                      index === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-50 text-gray-500'
                                  }`}>
                                  {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {post.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {post.views.toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {post.comments}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                                        'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                      }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-500 w-10">
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hay posts aún</p>
                  <p className="text-sm text-gray-400 mt-1">Las estadísticas aparecerán cuando publiques contenido</p>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#42403e] to-[#2d2b29] rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Resumen general</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Total usuarios</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalUsers}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Suscriptores</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalSubscribers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Engagement</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Comentarios totales</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalComments}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-white/60 text-sm mb-1">Vistas totales</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
