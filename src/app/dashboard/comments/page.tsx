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
  RefreshCw,
  Home
} from "lucide-react";
import { toast } from "sonner";

interface PostComment {
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

interface HomeComment {
  id: string;
  content: string;
  author: string;
  email: string;
  status: string;
  isReply: boolean;
  parentId?: string;
  createdAt: string;
  replies?: HomeComment[];
}

type Comment = PostComment | HomeComment;

type CommentWithType = (PostComment | HomeComment) & {
  type?: 'post' | 'home';
};

interface CommentsData {
  comments: CommentWithType[];
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

interface LoadingState {
  table: boolean;
  action: boolean;
}

export default function Comments() {
  const [data, setData] = useState<CommentsData | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    table: true,
    action: false
  });
  const [filter, setFilter] = useState("all");
  const [commentType, setCommentType] = useState<"all" | "post" | "home">("all");
  const [selectedComments, setSelectedComments] = useState<Map<string, 'post' | 'home'>>(new Map());
  const [page, setPage] = useState(1);

  // Fetch comentarios de posts
  const fetchPostComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments/admin?status=${filter}&page=${page}&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("No tienes permisos para ver los comentarios");
          return null;
        }
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching post comments:', error);
      return null;
    }
  }, [filter, page]);

  // Fetch comentarios del home
  const fetchHomeComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/home-comments/admin?status=${filter}&page=${page}&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching home comments:', error);
      return null;
    }
  }, [filter, page]);

  // Cargar comentarios
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(prev => ({ ...prev, table: true }));
        let postResult = null;
        let homeResult = null;

        if (commentType === "all" || commentType === "post") {
          postResult = await fetchPostComments();
        }

        if (commentType === "all" || commentType === "home") {
          homeResult = await fetchHomeComments();
        }

        // Combinar datos según el tipo de comentario seleccionado
        if (commentType === "post") {
          setData(postResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else if (commentType === "home") {
          setData(homeResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else {
          // Mostrar todos los comentarios combinados
          const allComments: CommentWithType[] = [];
          let totalStats = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            spam: 0
          };

          if (postResult?.comments) {
            allComments.push(...postResult.comments.map((c: PostComment) => ({ ...c, type: 'post' as const })));
            totalStats.total += postResult.stats?.total || 0;
            totalStats.pending += postResult.stats?.pending || 0;
            totalStats.approved += postResult.stats?.approved || 0;
            totalStats.rejected += postResult.stats?.rejected || 0;
            totalStats.spam += postResult.stats?.spam || 0;
          }

          if (homeResult?.comments) {
            allComments.push(...homeResult.comments.map((c: HomeComment) => ({ ...c, type: 'home' as const })));
            totalStats.total += homeResult.stats?.total || 0;
            totalStats.pending += homeResult.stats?.pending || 0;
            totalStats.approved += homeResult.stats?.approved || 0;
            totalStats.rejected += homeResult.stats?.rejected || 0;
            totalStats.spam += homeResult.stats?.spam || 0;
          }

          // Ordenar por fecha descendente
          allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setData({
            comments: allComments,
            pagination: {
              page,
              limit: 20,
              total: totalStats.total,
              pages: Math.ceil(totalStats.total / 20)
            },
            stats: totalStats
          });
        }
      } finally {
        setIsLoading(prev => ({ ...prev, table: false }));
      }
    };

    loadComments();
  }, [fetchPostComments, fetchHomeComments, commentType]);

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

  const handleStatusChange = async (commentId: string, newStatus: string, type: 'post' | 'home' = 'post') => {
    try {
      const endpoint = type === 'home' ? `/api/home-comments/${commentId}` : `/api/comments/${commentId}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Estado actualizado correctamente');
        // Recargar comentarios
        const postResult = await fetchPostComments();
        const homeResult = await fetchHomeComments();

        if (commentType === "post") {
          setData(postResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else if (commentType === "home") {
          setData(homeResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else {
          // Combinar ambos
          const allComments: CommentWithType[] = [];
          if (postResult?.comments) allComments.push(...postResult.comments.map((c: PostComment) => ({ ...c, type: 'post' as const })));
          if (homeResult?.comments) allComments.push(...homeResult.comments.map((c: HomeComment) => ({ ...c, type: 'home' as const })));
          allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setData({
            comments: allComments,
            pagination: { page, limit: 20, total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0), pages: 1 },
            stats: {
              total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0),
              pending: (postResult?.stats?.pending || 0) + (homeResult?.stats?.pending || 0),
              approved: (postResult?.stats?.approved || 0) + (homeResult?.stats?.approved || 0),
              rejected: (postResult?.stats?.rejected || 0) + (homeResult?.stats?.rejected || 0),
              spam: (postResult?.stats?.spam || 0) + (homeResult?.stats?.spam || 0),
            }
          });
        }
      } else {
        toast.error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDeleteComment = async (commentId: string, type: 'post' | 'home' = 'post') => {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        const endpoint = type === 'home' ? `/api/home-comments/${commentId}` : `/api/comments/${commentId}`;
        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Comentario eliminado correctamente');
          // Recargar comentarios
          const postResult = await fetchPostComments();
          const homeResult = await fetchHomeComments();

          if (commentType === "post") {
            setData(postResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
          } else if (commentType === "home") {
            setData(homeResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
          } else {
            const allComments: CommentWithType[] = [];
            if (postResult?.comments) allComments.push(...postResult.comments.map((c: PostComment) => ({ ...c, type: 'post' as const })));
            if (homeResult?.comments) allComments.push(...homeResult.comments.map((c: HomeComment) => ({ ...c, type: 'home' as const })));
            allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setData({
              comments: allComments,
              pagination: { page, limit: 20, total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0), pages: 1 },
              stats: {
                total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0),
                pending: (postResult?.stats?.pending || 0) + (homeResult?.stats?.pending || 0),
                approved: (postResult?.stats?.approved || 0) + (homeResult?.stats?.approved || 0),
                rejected: (postResult?.stats?.rejected || 0) + (homeResult?.stats?.rejected || 0),
                spam: (postResult?.stats?.spam || 0) + (homeResult?.stats?.spam || 0),
              }
            });
          }
        } else {
          toast.error('Error al eliminar el comentario');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Error al eliminar el comentario');
      }
    }
  };

  const toggleCommentSelection = (commentId: string, type: 'post' | 'home') => {
    setSelectedComments(prev => {
      const newMap = new Map(prev);
      if (newMap.has(commentId)) {
        newMap.delete(commentId);
      } else {
        newMap.set(commentId, type);
      }
      return newMap;
    });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedComments.size === 0) return;

    try {
      const postCommentIds = Array.from(selectedComments).filter(([_, type]) => type === 'post').map(([id]) => id);
      const homeCommentIds = Array.from(selectedComments).filter(([_, type]) => type === 'home').map(([id]) => id);

      const promises = [];

      if (postCommentIds.length > 0) {
        let body: any = { action, commentIds: postCommentIds };
        if (action === "approve") body.status = "APPROVED";
        else if (action === "reject") body.status = "REJECTED";
        else if (action === "spam") body.status = "SPAM";
        else if (action === "delete") {
          if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedComments.size} comentarios?`)) return;
        }

        promises.push(
          fetch('/api/comments/admin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        );
      }

      if (homeCommentIds.length > 0) {
        let body: any = { action, commentIds: homeCommentIds };
        if (action === "approve") body.status = "APPROVED";
        else if (action === "reject") body.status = "REJECTED";
        else if (action === "spam") body.status = "SPAM";

        promises.push(
          fetch('/api/home-comments/admin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        );
      }

      const responses = await Promise.all(promises);
      if (responses.every(r => r.ok)) {
        toast.success(`Acción completada en ${selectedComments.size} comentarios`);
        setSelectedComments(new Map());
        // Recargar
        const postResult = await fetchPostComments();
        const homeResult = await fetchHomeComments();

        if (commentType === "post") {
          setData(postResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else if (commentType === "home") {
          setData(homeResult || { comments: [], pagination: { page, limit: 20, total: 0, pages: 0 }, stats: { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 } });
        } else {
          const allComments: CommentWithType[] = [];
          if (postResult?.comments) allComments.push(...postResult.comments.map((c: PostComment) => ({ ...c, type: 'post' as const })));
          if (homeResult?.comments) allComments.push(...homeResult.comments.map((c: HomeComment) => ({ ...c, type: 'home' as const })));
          allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setData({
            comments: allComments,
            pagination: { page, limit: 20, total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0), pages: 1 },
            stats: {
              total: (postResult?.stats?.total || 0) + (homeResult?.stats?.total || 0),
              pending: (postResult?.stats?.pending || 0) + (homeResult?.stats?.pending || 0),
              approved: (postResult?.stats?.approved || 0) + (homeResult?.stats?.approved || 0),
              rejected: (postResult?.stats?.rejected || 0) + (homeResult?.stats?.rejected || 0),
              spam: (postResult?.stats?.spam || 0) + (homeResult?.stats?.spam || 0),
            }
          });
        }
      } else {
        toast.error('Error al realizar la acción masiva');
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error('Error al realizar la acción masiva');
    }
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

  if (isLoading.table && !data) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              <p className="text-gray-600 mt-2">Gestiona los comentarios de tus publicaciones y página de inicio</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                disabled={isLoading.table}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading.table ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de comentario</label>
            <select
              value={commentType}
              onChange={(e) => {
                setCommentType(e.target.value as "all" | "post" | "home");
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="post">Comentarios de Posts</option>
              <option value="home">Comentarios del Home</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendientes</option>
              <option value="APPROVED">Aprobados</option>
              <option value="REJECTED">Rechazados</option>
              <option value="SPAM">Spam</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total comentarios</p>
                <p className="text-2xl font-bold text-gray-900">{data?.stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{data?.stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{data?.stats.approved || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Flag className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Spam</p>
                <p className="text-2xl font-bold text-gray-900">{data?.stats.spam || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedComments.size} comentario(s) seleccionado(s)
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
            {!data || data.comments.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay comentarios para mostrar</p>
              </div>
            ) : (
              data.comments.map((comment) => {
                const isPostComment = comment.type === 'post' || 'post' in comment && 'post' in comment;
                const commentType = comment.type || (isPostComment ? 'post' : 'home');
                return (
                  <div key={comment.id} className={`p-6 ${comment.isReply ? 'bg-gray-50 pl-12' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedComments.has(comment.id)}
                        onChange={() => toggleCommentSelection(comment.id, commentType)}
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
                            {commentType === 'home' && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                Home
                              </span>
                            )}
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
                          {isPostComment && 'post' in comment && (
                            <p className="text-sm text-gray-600 mb-1">
                              En: <span className="font-medium">{comment.post.title}</span>
                            </p>
                          )}
                          <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                        </div>

                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          {comment.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(comment.id, "APPROVED", commentType)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(comment.id, "REJECTED", commentType)}
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
                              onClick={() => handleStatusChange(comment.id, "PENDING", commentType)}
                              className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Marcar como pendiente
                            </Button>
                          )}

                          {isPostComment && 'post' in comment && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/blog/${comment.post.id}`, '_blank')}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver post
                            </Button>
                          )}

                          {commentType === 'home' && !isPostComment && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('/', '_blank')}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver home
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteComment(comment.id, commentType)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((page - 1) * 20) + 1} a{' '}
              {Math.min(page * 20, data.pagination.total)} de{' '}
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
