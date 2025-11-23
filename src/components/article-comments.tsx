"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  status: string;
  isReply: boolean;
  parentId?: string;
  createdAt: string;
  replies?: Comment[];
}

interface ArticleCommentsProps {
  postId?: string;
}

export function ArticleComments({ postId }: ArticleCommentsProps) {
  const actualPostId = postId;
  const { user } = useAuth();
  const isAdminOrAuthor = user && (user.role === 'ADMIN' || user.role === 'AUTHOR');
  
  console.log('ArticleComments rendered with postId:', actualPostId);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    content: '',
    author: isAdminOrAuthor ? (user?.name || user?.email || '') : '',
    email: isAdminOrAuthor ? (user?.email || '') : '',
    saveInfo: false,
    notifications: false,
    newsletter: false,
    privacy: false
  });

  // Cargar comentarios
  useEffect(() => {
    if (!actualPostId) {
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${actualPostId}&status=approved`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        toast.error('Error al cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [actualPostId]);

  // Cargar datos guardados del localStorage (solo si no es admin/author)
  useEffect(() => {
    if (isAdminOrAuthor) {
      // Para admin/author, usar sus datos de sesión
      setFormData(prev => ({
        ...prev,
        author: user?.name || user?.email || '',
        email: user?.email || ''
      }));
    } else {
      // Para usuarios normales, cargar del localStorage
      const savedData = localStorage.getItem('commentFormData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          author: parsed.author || '',
          email: parsed.email || '',
          saveInfo: parsed.saveInfo || false
        }));
      }
    }
  }, [isAdminOrAuthor, user]);

  // Si no se proporciona postId, mostrar mensaje al final después de todos los hooks
  if (!postId) {
    return (
      <div id="comments" className="mt-16 border-t pt-10">
        <p className="text-gray-600">No se puede cargar los comentarios. ID del post no encontrado.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT START ===');
    console.log('Form data:', formData);
    console.log('Post ID:', actualPostId);
    console.log('Replying to:', replyingTo);
    
    // Validación diferente para admin/author
    if (isAdminOrAuthor) {
      if (!formData.content) {
        toast.error('Por favor escribe tu comentario');
        return;
      }
    } else {
      if (!formData.content || !formData.author || !formData.email || !formData.privacy) {
        console.log('Validation failed');
        toast.error('Por favor completa todos los campos obligatorios');
        return;
      }
    }

    if (!actualPostId) {
      console.log('PostId is missing');
      toast.error('Error: ID del post no encontrado');
      return;
    }

    setSubmitting(true);

    try {
      const requestBody = {
        content: formData.content,
        author: formData.author,
        email: formData.email,
        postId: actualPostId,
        parentId: replyingTo,
        saveInfo: formData.saveInfo,
        notifications: formData.notifications,
        newsletter: formData.newsletter
      };
      
      console.log('Request body:', requestBody);
      const jsonString = JSON.stringify(requestBody);
      console.log('JSON stringified:', jsonString);
      console.log('JSON length:', jsonString.length);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonString,
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const newComment = await response.json();
        console.log('New comment received:', newComment);
        
        // Todos los comentarios se aprueban automáticamente y se publican directamente
        if (newComment.status === 'APPROVED') {
          // Agregar el comentario aprobado inmediatamente a la lista
          const formattedComment: Comment = {
            id: newComment.id,
            content: newComment.content || '',
            author: newComment.author || '',
            email: newComment.email || '',
            status: newComment.status || 'APPROVED',
            isReply: newComment.isReply || false,
            parentId: newComment.parentId || undefined,
            createdAt: newComment.createdAt || new Date().toISOString(),
            replies: newComment.replies || []
          };
          
          if (replyingTo) {
            // Actualizar comentarios para incluir la nueva respuesta
            setComments(prev => prev.map(comment => 
              comment.id === replyingTo 
                ? { ...comment, replies: [...(comment.replies || []), formattedComment] }
                : comment
            ));
          } else {
            // Agregar nuevo comentario principal
            setComments(prev => [formattedComment, ...prev]);
          }
        }

        // Guardar datos si el usuario lo solicitó
        if (formData.saveInfo) {
          localStorage.setItem('commentFormData', JSON.stringify({
            author: formData.author,
            email: formData.email,
            saveInfo: formData.saveInfo
          }));
        }

        // Limpiar formulario
        setFormData(prev => ({
          ...prev,
          content: '',
          saveInfo: false,
          notifications: false,
          newsletter: false,
          privacy: false
        }));

        setReplyingTo(null);
        
        toast.success('¡Comentario publicado!');
      } else {
        console.log('Response not ok, status:', response.status);
        let errorMessage = 'Error al enviar el comentario';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            console.log('Parsed error:', error);
            errorMessage = error.error || error.details || errorMessage;
          } else {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
            if (errorText) {
              try {
                const error = JSON.parse(errorText);
                errorMessage = error.error || error.details || errorMessage;
              } catch {
                errorMessage = errorText || errorMessage;
              }
            }
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Error al enviar el comentario');
    } finally {
      setSubmitting(false);
      console.log('=== FORM SUBMIT END ===');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="comments" className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-lora font-bold mb-8">Reader Interactions</h2>

      <div className="mb-10">
        <h3 className="text-xl font-lora font-bold mb-6">
          Comentarios ({comments.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={() => setReplyingTo(comment.id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-lora font-bold mb-6">
          {replyingTo ? 'Responder comentario' : 'Deja una respuesta'}
        </h3>

        {replyingTo && (
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              Respondiendo a un comentario...
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="text-[#D4AF37] hover:text-[#B8941F]"
            >
              Cancelar respuesta
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Comentario *"
            className="w-full h-32 resize-none border-gray-300 focus:border-gold focus:ring-gold"
            required
          />

          {!isAdminOrAuthor && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Nombre *"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Correo electrónico *"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-gold focus:ring-1 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="save-info"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 accent-gold cursor-pointer"
                />
                <label htmlFor="save-info" className="text-sm text-gray-600 cursor-pointer">
                  Guarda mi nombre y correo electrónico en este navegador para la próxima vez que comente.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 accent-gold cursor-pointer"
                />
                <label htmlFor="notifications" className="text-sm text-gray-600 cursor-pointer">
                  Avísame por correo electrónico si alguien responde a mi comentario.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 accent-gold cursor-pointer"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600 cursor-pointer">
                  Quiero unirme a la familia de brian-blog y recibir gratis el ebook con más de 150 citas estoicas
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={formData.privacy}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 accent-gold cursor-pointer"
                  required
                />
                <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                  Acepto la <a href="/politica-privacidad/" className="text-gold hover:underline">política de privacidad</a> *
                </label>
              </div>
            </>
          )}

          {isAdminOrAuthor && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
              <p>Comentando como: <strong>{formData.author}</strong> ({formData.email})</p>
            </div>
          )}
          
          {!isAdminOrAuthor && (
            <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-xs">Tu comentario se publicará inmediatamente.</p>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md border border-gray-200">
            <h4 className="font-bold mb-2 text-gray-800">Información sobre protección de datos</h4>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Responsable: Pedro Vivar Nuñez</li>
              <li>Fin del tratamiento: Controlar el spam, gestión de comentarios</li>
              <li>Legitimación: Tu consentimiento</li>
              <li>Comunicación de los datos: No se comunicarán los datos a terceros salvo por obligación legal.</li>
              <li>Derechos: Acceso, rectificación, portabilidad, olvido.</li>
              <li>Contacto: <a href="mailto:web@diarioestoico.com" className="text-gold hover:underline">web@diarioestoico.com</a></li>
              <li>Información adicional: Más información en <a href="/politica-privacidad/" className="text-gold hover:underline">Política de privacidad</a></li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8941F] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 text-base cursor-pointer border-none outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
            >
              {submitting ? 'Enviando...' : 'Publicar comentario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CommentComponentProps {
  comment: Comment;
  onReply: () => void;
  formatDate: (date: string) => string;
}

function Comment({ comment, onReply, formatDate }: CommentComponentProps) {
  const isPending = comment.status === 'PENDING';
  
  return (
    <div>
      <div className="flex items-start space-x-4">
        <Avatar className="h-12 w-12 rounded-full border">
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {comment.author.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className={`rounded-lg p-4 ${isPending ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
              {isPending && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Pendiente de aprobación
                </span>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onReply}
            className="text-gold mt-2 text-sm font-medium hover:text-[#B8941F]"
          >
            Responder
          </Button>
        </div>
      </div>
      
      {/* Mostrar respuestas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-12 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 rounded-full border">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                  {reply.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{reply.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}