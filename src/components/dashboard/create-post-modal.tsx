"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Save, Eye } from "lucide-react";

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva publicación</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
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
                Guardar publicación
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

