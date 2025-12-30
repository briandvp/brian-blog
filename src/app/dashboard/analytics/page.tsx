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
  Loader
} from "lucide-react";

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

interface LoadingState {
  cards: boolean;
  stats: boolean;
  table: boolean;
  chart: boolean;
}

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded ml-4"></div>
    </div>
  </div>
);

const TableSkeletonRow = () => (
  <tr className="border-b border-gray-200">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
  </tr>
);

const ChartSkeletonBar = () => (
  <div className="flex flex-col items-center flex-1">
    <div className="bg-gray-200 rounded-t w-full mb-2 animate-pulse" style={{ height: `${Math.random() * 150 + 30}px` }}></div>
    <div className="h-3 bg-gray-200 rounded w-6"></div>
  </div>
);

const AnalyticsSkeleton = () => (
  <>
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Monthly Stats Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-white rounded-lg shadow p-6 mb-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vistas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rendimiento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <TableSkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Chart Skeleton */}
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
      <div className="h-64 flex items-end justify-between space-x-1">
        {[...Array(30)].map((_, i) => (
          <ChartSkeletonBar key={i} />
        ))}
      </div>
    </div>
  </>
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchAnalytics();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "increase" | "decrease";
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}>
              {changeType === "increase" ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
              <p className="text-gray-600 mt-2">Métricas y estadísticas de tu blog</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">Error al cargar analíticas</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <AnalyticsSkeleton />
          </div>
        )}

        {/* Analytics Content */}
        {!loading && analytics && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="Vistas totales"
                value={analytics.overview.totalViews.toLocaleString()}
                change="+12.5%"
                changeType="increase"
                icon={Eye}
                color="text-blue-600"
              />
              <StatCard
                title="Usuarios"
                value={analytics.overview.totalUsers.toLocaleString()}
                change="+8.2%"
                changeType="increase"
                icon={Users}
                color="text-green-600"
              />
              <StatCard
                title="Comentarios totales"
                value={analytics.overview.totalComments}
                change="+15.3%"
                changeType="increase"
                icon={MessageSquare}
                color="text-purple-600"
              />
              <StatCard
                title="Suscriptores"
                value={analytics.overview.totalSubscribers.toLocaleString()}
                change="+5.1%"
                changeType="increase"
                icon={Calendar}
                color="text-orange-600"
              />
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Comentarios del Home</p>
                    <p className="text-2xl font-bold text-gray-900">Ver en dashboard</p>
                    <div className="flex items-center mt-1 text-sm text-blue-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Sección de comentarios
                    </div>
                  </div>
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del mes</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vistas</span>
                    <span className="font-semibold">{analytics.monthlyStats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posts publicados</span>
                    <span className="font-semibold">{analytics.monthlyStats.posts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Comentarios</span>
                    <span className="font-semibold">{analytics.monthlyStats.comments}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen general</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de usuarios</span>
                    <span className="font-semibold">{analytics.overview.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de suscriptores</span>
                    <span className="font-semibold">{analytics.overview.totalSubscribers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vistas promedio por post</span>
                    <span className="font-semibold">
                      {analytics.topPosts.length > 0
                        ? Math.round(
                          analytics.topPosts.reduce((sum, p) => sum + p.views, 0) /
                          analytics.topPosts.length
                        )
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Posts */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publicaciones más populares</h3>
              {analytics.topPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vistas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comentarios
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rendimiento
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topPosts.map((post, index) => {
                        const maxViews = Math.max(...analytics.topPosts.map(p => p.views));
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {post.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {post.views.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {post.comments}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${(post.views / maxViews) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {Math.round((post.views / maxViews) * 100)}%
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
                <p className="text-center text-gray-500">No hay posts aún</p>
              )}
            </div>

            {/* Monthly Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de vistas (últimos 30 días)</h3>
              {analytics.monthlyData.length > 0 ? (
                <div className="h-64 flex items-end justify-between space-x-1">
                  {analytics.monthlyData.map((data, index) => {
                    const maxViews = Math.max(...analytics.monthlyData.map(d => d.views), 1);
                    const height = (data.views / maxViews) * 200;
                    const date = new Date(data.date);
                    const day = date.getDate();

                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="bg-[#42403e] rounded-t w-full mb-2 transition-all duration-300 hover:bg-[#36312f]"
                          style={{ height: `${height}px`, minHeight: '4px' }}
                          title={`${data.date}: ${data.views} vistas`}
                        ></div>
                        <span className="text-xs text-gray-500">{day}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
              )}
              <div className="mt-4 text-center text-sm text-gray-600">
                Hover sobre las barras para ver los números exactos
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
