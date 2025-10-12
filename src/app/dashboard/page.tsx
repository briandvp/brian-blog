"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit, Trash2, Calendar, User, Loader2 } from "lucide-react";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { EditPostModal } from "@/components/dashboard/edit-post-modal";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  views: number;
  comments: number;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  // Cargar posts publicados desde la API
  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts?status=published');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        } else {
          console.error('Error al cargar posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error al cargar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, []);

  const handleCreatePost = async (newPost: any) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newPost, status: 'published' }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setShowCreateModal(false);
      } else {
        console.error('Error al crear post:', response.statusText);
        alert('Error al crear la publicación');
      }
    } catch (error) {
      console.error('Error al crear post:', error);
      alert('Error al crear la publicación');
    }
  };

  const handleEditPost = async (updatedPost: any) => {
    try {
      const response = await fetch(`/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === updatedPost.id ? data.post : post
        ));
        setEditingPost(null);
      } else {
        console.error('Error al actualizar post:', response.statusText);
        alert('Error al actualizar la publicación');
      }
    } catch (error) {
      console.error('Error al actualizar post:', error);
      alert('Error al actualizar la publicación');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId));
        } else {
          console.error('Error al eliminar post:', response.statusText);
          alert('Error al eliminar la publicación');
        }
      } catch (error) {
        console.error('Error al eliminar post:', error);
        alert('Error al eliminar la publicación');
      }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publicaciones publicadas</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vistas totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Comentarios totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.comments, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Publicaciones publicadas</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cargando publicaciones...
              </h3>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay publicaciones publicadas
              </h3>
              <p className="text-gray-600">
                Crea tu primera publicación para comenzar
              </p>
            </div>
          ) : (
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
          )}
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
