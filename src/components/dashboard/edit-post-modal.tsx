"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Save, Eye, Trash2 } from "lucide-react";

interface EditPostModalProps {
  post: any;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function EditPostModal({ post, onClose, onSubmit }: EditPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "General",
    status: "draft"
  });

  const categories = [
    "General",
    "Citas estoicas",
    "Entrevistas", 
    "Principios estoicos",
    "Psicología estoica"
  ];

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: post.category || "General",
        status: post.status || "draft"
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...post, ...formData });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      // Aquí se manejaría la eliminación
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar publicación</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                placeholder="Escribe el título de tu publicación..."
                required
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                placeholder="Escribe un breve resumen de tu publicación..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent font-mono text-sm"
                placeholder="Escribe el contenido completo de tu publicación..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar Markdown para formatear el texto
              </p>
            </div>

            {/* Post Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Vistas:</span>
                  <span className="ml-2 font-medium">{post.views?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Comentarios:</span>
                  <span className="ml-2 font-medium">{post.comments || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Creado:</span>
                  <span className="ml-2 font-medium">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Actualizado:</span>
                  <span className="ml-2 font-medium">
                    {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-600"
              >
                Cancelar
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </Button>
              <Button
                type="submit"
                className="bg-[#42403e] hover:bg-[#36312f] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

