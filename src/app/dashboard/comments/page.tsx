"use client";

import { useState } from "react";
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
  Filter
} from "lucide-react";

// Datos de ejemplo para los comentarios
const mockComments = [
  {
    id: 1,
    postTitle: "La dicotomía de control en la vida moderna",
    author: "María González",
    email: "maria@email.com",
    content: "Excelente artículo. Me ha ayudado mucho a entender cómo aplicar estos principios en mi trabajo diario. ¿Tienes algún consejo específico para manejar el estrés laboral?",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    isReply: false,
    parentId: null
  },
  {
    id: 2,
    postTitle: "La dicotomía de control en la vida moderna",
    author: "Brian",
    email: "brian@diarioestoico.com",
    content: "Gracias por tu comentario, María. Para el estrés laboral, te recomiendo practicar la meditación matutina y recordar que solo puedes controlar tus propias acciones y reacciones.",
    status: "approved",
    createdAt: "2024-01-15T11:15:00Z",
    isReply: true,
    parentId: 1
  },
  {
    id: 3,
    postTitle: "Citas estoicas para la resiliencia",
    author: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    content: "Muy inspirador. La cita de Marco Aurelio sobre la adversidad me ha tocado especialmente. ¿Podrías recomendar más lecturas sobre estoicismo?",
    status: "approved",
    createdAt: "2024-01-14T16:45:00Z",
    isReply: false,
    parentId: null
  },
  {
    id: 4,
    postTitle: "Entrevista con un filósofo estoico contemporáneo",
    author: "Ana Martínez",
    email: "ana.martinez@email.com",
    content: "Interesante entrevista, pero creo que el estoicismo moderno pierde algo de su esencia original. No estoy de acuerdo con algunas interpretaciones.",
    status: "pending",
    createdAt: "2024-01-13T09:20:00Z",
    isReply: false,
    parentId: null
  },
  {
    id: 5,
    postTitle: "La dicotomía de control en la vida moderna",
    author: "Pedro López",
    email: "pedro.lopez@email.com",
    content: "Este artículo es basura. El estoicismo no sirve para nada en el mundo real.",
    status: "spam",
    createdAt: "2024-01-12T14:30:00Z",
    isReply: false,
    parentId: null
  }
];

export default function Comments() {
  const [comments, setComments] = useState(mockComments);
  const [filter, setFilter] = useState("all");
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      spam: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const labels = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      spam: "Spam"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredComments = comments.filter(comment => {
    if (filter === "all") return true;
    return comment.status === filter;
  });

  const handleStatusChange = (commentId: number, newStatus: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: newStatus }
        : comment
    ));
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) return;
    
    if (action === "approve") {
      setComments(comments.map(comment => 
        selectedComments.includes(comment.id)
          ? { ...comment, status: "approved" }
          : comment
      ));
    } else if (action === "reject") {
      setComments(comments.map(comment => 
        selectedComments.includes(comment.id)
          ? { ...comment, status: "rejected" }
          : comment
      ));
    } else if (action === "delete") {
      if (confirm(`¿Estás seguro de que quieres eliminar ${selectedComments.length} comentarios?`)) {
        setComments(comments.filter(comment => !selectedComments.includes(comment.id)));
      }
    }
    
    setSelectedComments([]);
  };

  const toggleCommentSelection = (commentId: number) => {
    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const stats = {
    total: comments.length,
    pending: comments.filter(c => c.status === "pending").length,
    approved: comments.filter(c => c.status === "approved").length,
    spam: comments.filter(c => c.status === "spam").length
  };

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
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
                <option value="spam">Spam</option>
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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Flag className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Spam</p>
                <p className="text-2xl font-bold text-gray-900">{stats.spam}</p>
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
            {filteredComments.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay comentarios para mostrar</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
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
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          En: <span className="font-medium">{comment.postTitle}</span>
                        </p>
                        <p className="text-gray-900">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {comment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(comment.id, "approved")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(comment.id, "rejected")}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                        
                        {comment.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(comment.id, "pending")}
                            className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Marcar como pendiente
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/post/${comment.id}`, '_blank')}
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
      </div>
    </div>
  );
}
