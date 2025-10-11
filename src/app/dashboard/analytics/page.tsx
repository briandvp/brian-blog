"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  MessageSquare, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Datos de ejemplo para las analíticas
const mockAnalytics = {
  overview: {
    totalViews: 15420,
    totalVisitors: 8230,
    totalComments: 156,
    avgTimeOnSite: "3:24"
  },
  monthlyStats: {
    views: 3240,
    visitors: 1890,
    comments: 34,
    bounceRate: 42.5
  },
  topPosts: [
    { title: "La dicotomía de control en la vida moderna", views: 1250, comments: 23 },
    { title: "Citas estoicas para la resiliencia", views: 2100, comments: 45 },
    { title: "Entrevista con un filósofo estoico contemporáneo", views: 890, comments: 12 }
  ],
  trafficSources: [
    { source: "Búsqueda orgánica", percentage: 45, visitors: 3704 },
    { source: "Redes sociales", percentage: 30, visitors: 2469 },
    { source: "Directo", percentage: 15, visitors: 1235 },
    { source: "Referidos", percentage: 10, visitors: 823 }
  ],
  monthlyData: [
    { month: "Ene", views: 2100, visitors: 1200 },
    { month: "Feb", views: 2800, visitors: 1600 },
    { month: "Mar", views: 3200, visitors: 1800 },
    { month: "Abr", views: 2900, visitors: 1650 },
    { month: "May", views: 3400, visitors: 1950 },
    { month: "Jun", views: 3240, visitors: 1890 }
  ]
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

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
            <div className={`flex items-center mt-1 text-sm ${
              changeType === "increase" ? "text-green-600" : "text-red-600"
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Vistas totales"
            value={mockAnalytics.overview.totalViews.toLocaleString()}
            change="+12.5%"
            changeType="increase"
            icon={Eye}
            color="text-blue-600"
          />
          <StatCard
            title="Visitantes únicos"
            value={mockAnalytics.overview.totalVisitors.toLocaleString()}
            change="+8.2%"
            changeType="increase"
            icon={Users}
            color="text-green-600"
          />
          <StatCard
            title="Comentarios"
            value={mockAnalytics.overview.totalComments}
            change="+15.3%"
            changeType="increase"
            icon={MessageSquare}
            color="text-purple-600"
          />
          <StatCard
            title="Tiempo promedio"
            value={mockAnalytics.overview.avgTimeOnSite}
            change="-2.1%"
            changeType="decrease"
            icon={Calendar}
            color="text-orange-600"
          />
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del mes</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vistas</span>
                <span className="font-semibold">{mockAnalytics.monthlyStats.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Visitantes</span>
                <span className="font-semibold">{mockAnalytics.monthlyStats.visitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Comentarios</span>
                <span className="font-semibold">{mockAnalytics.monthlyStats.comments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tasa de rebote</span>
                <span className="font-semibold">{mockAnalytics.monthlyStats.bounceRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de tráfico</h3>
            <div className="space-y-4">
              {mockAnalytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <span className="text-sm text-gray-600">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#42403e] h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {source.visitors.toLocaleString()} visitantes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Publicaciones más populares</h3>
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
                {mockAnalytics.topPosts.map((post, index) => (
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
                            style={{ width: `${(post.views / 2100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((post.views / 2100) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de vistas (6 meses)</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalytics.monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-[#42403e] rounded-t w-full mb-2 transition-all duration-300 hover:bg-[#36312f]"
                  style={{ height: `${(data.views / 3400) * 200}px` }}
                  title={`${data.views} vistas`}
                ></div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Hover sobre las barras para ver los números exactos
          </div>
        </div>
      </div>
    </div>
  );
}
