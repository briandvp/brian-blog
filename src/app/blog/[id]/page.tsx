'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, MessageCircle, Clock } from 'lucide-react';

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

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', postId);
        const response = await fetch(`/api/posts/${postId}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Post data received:', data);
          setPost(data.post);
        } else {
          const errorData = await response.json();
          console.error('Error al cargar post:', errorData);
          setError('Post no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar post:', error);
        setError('Error al cargar el post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {error || 'Post no encontrado'}
              </h1>
              <p className="text-gray-600 mb-6">
                El post que buscas no existe o ha sido eliminado.
              </p>
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Botón de regreso */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#B8941F] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Blog
          </Link>

          {/* Contenido del post */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header del post */}
            <div className="p-8 border-b border-gray-200">
              {/* Categoría */}
              <div className="mb-4">
                <span className="inline-block bg-[#D4AF37] text-white text-sm font-medium px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadingTime(post.content)} min de lectura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} vistas</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments} comentarios</span>
                </div>
              </div>
            </div>

            {/* Contenido del post */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>

            {/* Footer del post */}
            <div className="p-8 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{post.author.name}</p>
                    <p className="text-sm text-gray-600">Autor</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    href="/blog"
                    className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Más Posts
                  </Link>
                  <button className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
