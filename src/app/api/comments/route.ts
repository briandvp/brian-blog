import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      const rawBody = await request.text();
      console.log('Raw request body:', rawBody);
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Formato JSON inválido' },
        { status: 400 }
      );
    }
    
    const { content, author, email, postId, parentId, saveInfo, notifications, newsletter } = body;
    
    console.log('Parsed body:', body);
    console.log('postId:', postId);

    // Validaciones básicas
    if (!content || !author || !email || !postId) {
      console.log('Validation failed:', { content: !!content, author: !!author, email: !!email, postId: !!postId });
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
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
    const comment = await prisma.comment.create({
      data: {
        content,
        author,
        email,
        postId,
        parentId: parentId || null,
        isReply: !!parentId,
        status: 'PENDING'
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
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
