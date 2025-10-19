"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Reply, 
  Flag,
  User,
  Calendar,
  Eye,
  Filter,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  status: string;
  isReply: boolean;
  parentId?: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
  };
}

interface CommentsData {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
  };
}

export default function Comments() {
  const [data, setData] = useState<CommentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/admin?status=${filter}&page=${page}&limit=20`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error('Error al cargar los comentarios');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  // Cargar comentarios
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      SPAM: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const labels = {
      PENDING: "Pendiente",
      APPROVED: "Aprobado",
      REJECTED: "Rechazado",
      SPAM: "Spam"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Estado actualizado correctamente');
        fetchComments(); // Recargar comentarios
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Comentario eliminado correctamente');
          fetchComments(); // Recargar comentarios
        } else {
          toast.error('Error al eliminar el comentario');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Error al eliminar el comentario');
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedComments.length === 0) return;
    
    try {
      let endpoint = '';
      let body: any = { action, commentIds: selectedComments };

      if (action === "approve") {
        body.status = "APPROVED";
      } else if (action === "reject") {
        body.status = "REJECTED";
      } else if (action === "spam") {
        body.status = "SPAM";
      } else if (action === "delete") {
        if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedComments.length} comentarios?`)) {
          return;
        }
      }

      const response = await fetch('/api/comments/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.message} (${result.affected} comentarios afectados)`);
        setSelectedComments([]);
        fetchComments(); // Recargar comentarios
      } else {
        toast.error('Error al realizar la acción masiva');
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error('Error al realizar la acción masiva');
    }
  };

  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !data) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando comentarios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Error al cargar los comentarios</p>
            <Button onClick={fetchComments} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comentarios</h1>
              <p className="text-gray-600 mt-2">Gestiona los comentarios de tus publicaciones</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchComments}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobados</option>
                <option value="REJECTED">Rechazados</option>
                <option value="SPAM">Spam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total comentarios</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Flag className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Spam</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.spam}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedComments.length} comentario(s) seleccionado(s)
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("reject")}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("spam")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Marcar como spam
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Comentarios {filter !== "all" && `(${filter})`}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando comentarios...</p>
              </div>
            ) : data.comments.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay comentarios para mostrar</p>
              </div>
            ) : (
              data.comments.map((comment) => (
                <div key={comment.id} className={`p-6 ${comment.isReply ? 'bg-gray-50 pl-12' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => toggleCommentSelection(comment.id)}
                      className="mt-1 h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{comment.email}</span>
                          </div>
                          {getStatusBadge(comment.status)}
                          {comment.isReply && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Respuesta
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          En: <span className="font-medium">{comment.post.title}</span>
                        </p>
                        <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {comment.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(comment.id, "APPROVED")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(comment.id, "REJECTED")}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                        
                        {comment.status === "APPROVED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(comment.id, "PENDING")}
                            className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Marcar como pendiente
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Si es el post principal, ir a la página de inicio
                            // Si es otro post, ir a la página individual del blog
                            const postId = comment.post.id;
                            const isMainPost = postId === "cmgr8pkw70002dl9snrgsjf5v";
                            const url = isMainPost ? "/" : `/blog/${postId}`;
                            window.open(url, '_blank');
                          }}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver post
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {data.pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((data.pagination.page - 1) * data.pagination.limit) + 1} a{' '}
              {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} de{' '}
              {data.pagination.total} comentarios
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página {page} de {data.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.pages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
