import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/comments/[id] - Obtener un comentario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            title: true
          }
        },
        replies: {
          where: {
            status: 'APPROVED'
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/comments/[id] - Actualizar un comentario (cambiar estado, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Formato JSON inválido' },
        { status: 400 }
      );
    }
    
    const { status, content } = body;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(content && { content })
      },
      include: {
        post: {
          select: {
            title: true
          }
        }
      }
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Eliminar un comentario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        replies: true
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el comentario y todas sus respuestas
    await prisma.comment.delete({
      where: { id }
    });

    // Actualizar contador de comentarios del post
    const totalDeleted = 1 + comment.replies.length;
    await prisma.post.update({
      where: { id: comment.postId },
      data: {
        comments: {
          decrement: totalDeleted
        }
      }
    });

    return NextResponse.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
