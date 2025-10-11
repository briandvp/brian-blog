"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  FileText, 
  Tag, 
  Calendar,
  User,
  Image,
  Link
} from "lucide-react";

export default function NewPost() {
  const router = useRouter();
  const [post, setPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    featuredImage: "",
    metaTitle: "",
    metaDescription: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (status: string) => {
    setIsSaving(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Guardando post:", { ...post, status });
    
    // En una aplicación real, aquí se haría la llamada a la API
    alert(`Post ${status === "draft" ? "guardado como borrador" : "publicado"} exitosamente`);
    
    setIsSaving(false);
    
    if (status === "published") {
      router.push("/dashboard/posts");
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const categories = [
    "Principios estoicos",
    "Citas estoicas", 
    "Entrevistas",
    "Reflexiones",
    "Historia del estoicismo",
    "Aplicación práctica"
  ];

  const wordCount = post.content.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Asumiendo 200 palabras por minuto

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nueva publicación</h1>
                <p className="text-gray-600 mt-2">Crea una nueva entrada para tu blog</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Editar" : "Vista previa"}
              </Button>
            </div>
          </div>
        </div>

        {!showPreview ? (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Información básica
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Escribe un título atractivo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extracto
                  </label>
                  <Textarea
                    value={post.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Breve descripción del artículo..."
                    rows={3}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {post.excerpt.length}/160 caracteres
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={post.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={post.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <input
                    type="text"
                    value={post.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="estoicismo, filosofía, resiliencia (separadas por comas)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Contenido
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del artículo *
                </label>
                <Textarea
                  value={post.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Escribe tu artículo aquí... Puedes usar Markdown para formatear el texto."
                  rows={20}
                  className="w-full font-mono text-sm"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Puedes usar Markdown para formatear el texto</span>
                  <span>{wordCount} palabras • {readingTime} min de lectura</span>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Link className="h-5 w-5 mr-2" />
                Configuración SEO
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={post.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    placeholder="Título optimizado para motores de búsqueda..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {post.metaTitle.length}/60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción SEO
                  </label>
                  <Textarea
                    value={post.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    placeholder="Descripción que aparecerá en los resultados de búsqueda..."
                    rows={3}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {post.metaDescription.length}/160 caracteres
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Imagen destacada
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  value={post.featuredImage}
                  onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                />
                {post.featuredImage && (
                  <div className="mt-4">
                    <img 
                      src={post.featuredImage} 
                      alt="Vista previa" 
                      className="max-w-xs h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-500">
                <p>Autor: Brian</p>
                <p>Fecha de creación: {new Date().toLocaleDateString('es-ES')}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave("draft")}
                  disabled={isSaving || !post.title || !post.content}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Guardando..." : "Guardar borrador"}
                </Button>
                
                <Button
                  onClick={() => handleSave("published")}
                  disabled={isSaving || !post.title || !post.content}
                  className="bg-[#42403e] hover:bg-[#36312f] text-white flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isSaving ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow p-8">
            <div className="max-w-3xl mx-auto">
              <article>
                {post.featuredImage && (
                  <div className="mb-8">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {post.title || "Título del artículo"}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Brian
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date().toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {post.category || "Sin categoría"}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {readingTime} min de lectura
                    </div>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </header>
                
                <div className="prose prose-lg max-w-none">
                  {post.content ? (
                    <div className="whitespace-pre-wrap">{post.content}</div>
                  ) : (
                    <p className="text-gray-500 italic">El contenido del artículo aparecerá aquí...</p>
                  )}
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
