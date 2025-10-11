"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Calendar, User, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    status: string;
    author: string;
    createdAt: string;
    views: number;
    comments: number;
  };
  onEdit: (post: any) => void;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
          <div className="ml-4">
            {getStatusBadge(post.status)}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(post.createdAt).toLocaleDateString('es-ES')}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {post.views.toLocaleString()}
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.comments}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {post.category}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/post/${post.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(post)}
              className="text-yellow-600 hover:text-yellow-900"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(post.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

