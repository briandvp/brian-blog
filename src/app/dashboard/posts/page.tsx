"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { EditPostModal } from "@/components/dashboard/edit-post-modal";
import { PostCard } from "@/components/dashboard/post-card";

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Cargar posts desde la API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
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

    fetchPosts();
  }, []);

  const handleCreatePost = async (newPost: any) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
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

  // Filtrar posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Publicaciones</h1>
              <p className="text-gray-600 mt-2">Gestiona todas tus publicaciones</p>
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Borradores</option>
                  <option value="archived">Archivados</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#42403e] text-white' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#42403e] text-white' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cargando publicaciones...
            </h3>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron publicaciones
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera publicación para comenzar'
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={setEditingPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}

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


