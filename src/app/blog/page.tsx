"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { SubscribeForm } from "@/components/subscribe-form";
import { 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  Tag, 
  Search, 
  Filter,
  Clock,
  BookOpen
} from "lucide-react";

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

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Cargar posts publicados
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts from API...');
        const response = await fetch('/api/posts?status=published');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Posts data received:', data);
          setPosts(data.posts || []);
        } else {
          const errorData = await response.json();
          console.error('Error al cargar posts:', errorData);
          setPosts([]); // Establecer array vacío en caso de error
        }
      } catch (error) {
        console.error('Error al cargar posts:', error);
        setPosts([]); // Establecer array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar y ordenar posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'mostViewed':
          return b.views - a.views;
        case 'mostCommented':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  const categories = [
    'all',
    'General',
    'Citas estoicas',
    'Entrevistas',
    'Principios estoicos',
    'Psicología estoica'
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / 200); // Asumiendo 200 palabras por minuto
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? t('blog.allCategories') : category}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              >
                <option value="newest">{t('blog.sort.newest')}</option>
                <option value="oldest">{t('blog.sort.oldest')}</option>
                <option value="mostViewed">{t('blog.sort.mostViewed')}</option>
                <option value="mostCommented">{t('blog.sort.mostCommented')}</option>
              </select>
            </div>
          </div>
        </div>


        {/* Lista de posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('blog.loading')}
            </h3>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('blog.noArticles')}
            </h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== 'all' 
                ? t('blog.adjustFilters')
                : t('blog.noArticlesYet')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  {/* Categoría */}
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-[#42403e]" />
                    <span className="text-sm font-medium text-[#42403e] bg-[#42403e]/10 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/blog/${post.id}`}
                      className="hover:text-[#42403e] transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Extracto */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>

                  {/* Metadatos */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(post.content)} {t('blog.min')}</span>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-[#42403e] border-[#42403e] hover:bg-[#42403e] hover:text-white"
                    >
                      <Link href={`/blog/${post.id}`}>
                        {t('blog.readMore')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to action */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-12 bg-[#42403e] rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t('blog.cta.title')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('blog.cta.subtitle')}
            </p>
            <div className="max-w-md mx-auto">
              <SubscribeForm variant="default" className="text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
