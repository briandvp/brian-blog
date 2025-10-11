"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { EditPostModal } from "@/components/dashboard/edit-post-modal";
import { PostCard } from "@/components/dashboard/post-card";

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
  },
  {
    id: 4,
    title: "La psicología del estoicismo aplicada",
    excerpt: "Cómo los principios estoicos pueden mejorar nuestra salud mental...",
    category: "Psicología estoica",
    status: "published",
    author: "Brian",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    views: 1800,
    comments: 32
  }
];

export default function PostsPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
        {filteredPosts.length === 0 ? (
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


