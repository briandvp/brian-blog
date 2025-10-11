"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit, Trash2, Calendar, User } from "lucide-react";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { EditPostModal } from "@/components/dashboard/edit-post-modal";

// Datos de ejemplo - en producción vendrían de una API
const mockPosts = [
  {
    id: 1,
    title: "La dicotomía de control en la vida moderna",
    excerpt: "Una reflexión profunda sobre cómo aplicar los principios estoicos en nuestro día a día...",
    category: "Principios estoicos",
    status: "published",
    author: "Brian",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    views: 1250,
    comments: 23
  },
  {
    id: 2,
    title: "Entrevista con un filósofo estoico contemporáneo",
    excerpt: "Conversación exclusiva sobre la relevancia del estoicismo en el siglo XXI...",
    category: "Entrevistas",
    status: "draft",
    author: "Brian",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    views: 0,
    comments: 0
  },
  {
    id: 3,
    title: "Citas estoicas para la resiliencia",
    excerpt: "Una recopilación de las mejores citas de Marco Aurelio, Epicteto y Séneca...",
    category: "Citas estoicas",
    status: "published",
    author: "Brian",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
    views: 2100,
    comments: 45
  }
];

export default function Dashboard() {
  const [posts, setPosts] = useState(mockPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleCreatePost = (newPost: any) => {
    const post = {
      ...newPost,
      id: Date.now(),
      author: "Brian",
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0
    };
    setPosts([post, ...posts]);
    setShowCreateModal(false);
  };

  const handleEditPost = (updatedPost: any) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id 
        ? { ...updatedPost, updatedAt: new Date().toISOString().split('T')[0] }
        : post
    ));
    setEditingPost(null);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const labels = {
      published: "Publicado",
      draft: "Borrador",
      archived: "Archivado"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Gestiona tus publicaciones y contenido</p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#42403e] hover:bg-[#36312f] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva publicación
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total publicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publicadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vistas totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.views, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Publicaciones</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {post.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/post/${post.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePost}
          />
        )}

        {editingPost && (
          <EditPostModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onSubmit={handleEditPost}
          />
        )}
      </div>
    </div>
  );
}
