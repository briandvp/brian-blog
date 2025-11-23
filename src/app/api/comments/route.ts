import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET /api/comments - Obtener comentarios de un post específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const status = searchParams.get('status');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID es requerido' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: status ? status.toUpperCase() as any : 'APPROVED', // Por defecto solo comentarios aprobados
        parentId: null, // Solo comentarios principales, no respuestas
      },
      include: {
        replies: {
          where: {
            status: 'APPROVED'
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Crear un nuevo comentario
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing JSON body:', parseError);
      return NextResponse.json(
        { error: 'Error al procesar los datos del formulario' },
        { status: 400 }
      );
    }
    
    if (!body) {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud está vacío' },
        { status: 400 }
      );
    }
    
    const { content, author, email, postId, parentId, saveInfo, notifications, newsletter } = body;
    
    console.log('Parsed body:', body);
    console.log('postId:', postId);

    // Verificar si el usuario está autenticado como admin o author
    const user = await getUserFromSession(request);
    const isAdminOrAuthor = user && (user.role === 'ADMIN' || user.role === 'AUTHOR');
    
    // Si es admin/author, usar sus datos automáticamente
    let commentAuthor = author;
    let commentEmail = email;
    
    if (isAdminOrAuthor) {
      // Para admin/author, no requerir email y author si vienen vacíos
      commentAuthor = author || user.name || user.email || 'Administrador';
      commentEmail = email || user.email || '';
      
      // Validar solo el contenido para admin/author
      if (!content || !postId) {
        return NextResponse.json(
          { error: 'El contenido es requerido' },
          { status: 400 }
        );
      }
    } else {
      // Para usuarios normales, validar todos los campos
      if (!content || !author || !email || !postId) {
        console.log('Validation failed:', { content: !!content, author: !!author, email: !!email, postId: !!postId });
        return NextResponse.json(
          { error: 'Todos los campos son requeridos' },
          { status: 400 }
        );
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'El formato del correo electrónico no es válido' },
          { status: 400 }
        );
      }
    }

    // Verificar que el post existe
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Crear el comentario
    // Todos los comentarios se aprueban automáticamente para publicación directa
    const commentStatus = 'APPROVED';
    
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        author: commentAuthor.trim(),
        email: commentEmail.trim().toLowerCase(),
        postId,
        parentId: parentId || null,
        isReply: !!parentId,
        status: commentStatus
      },
      include: {
        post: {
          select: {
            title: true
          }
        }
      }
    });

    // Actualizar contador de comentarios del post
    await prisma.post.update({
      where: { id: postId },
      data: {
        comments: {
          increment: 1
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });
    
    // Si es un error de Prisma, proporcionar más información
    if (error?.code) {
      return NextResponse.json(
        { 
          error: 'Error al crear el comentario',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error?.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
