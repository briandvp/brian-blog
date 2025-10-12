import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/posts/[id] - Obtener un post específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    
    console.log('Fetching post with ID:', postId);

    // Buscar el post por ID en la base de datos
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      console.log('Post not found with ID:', postId);
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Incrementar las vistas
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } }
    });

    // Transformar para mantener compatibilidad con el frontend
    const transformedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      category: post.category,
      status: post.published ? 'published' : 'draft',
      views: post.views + 1, // Incluir la vista incrementada
      comments: post.comments,
      author: {
        id: post.author.id,
        name: post.author.name || 'Autor',
        email: post.author.email
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };

    console.log('Post found:', transformedPost.title);

    return NextResponse.json({
      post: transformedPost
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Actualizar un post específico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();
    const { title, content, excerpt, category, status } = body;

    console.log('Updating post with ID:', postId);
    console.log('Update data:', { title, status, category });

    // Verificar que el post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el post en la base de datos
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        ...(category && { category }),
        ...(status && { published: status === 'published' })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Transformar para mantener compatibilidad con el frontend
    const transformedPost = {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt || updatedPost.content.substring(0, 150) + '...',
      category: updatedPost.category,
      status: updatedPost.published ? 'published' : 'draft',
      views: updatedPost.views,
      comments: updatedPost.comments,
      author: {
        id: updatedPost.author.id,
        name: updatedPost.author.name || 'Autor',
        email: updatedPost.author.email
      },
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };

    console.log('Post updated successfully:', transformedPost.title);

    return NextResponse.json({
      message: 'Post actualizado exitosamente',
      post: transformedPost
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Eliminar un post específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    console.log('Deleting post with ID:', postId);

    // Verificar que el post existe
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el post de la base de datos
    await prisma.post.delete({
      where: { id: postId }
    });

    // Transformar para mantener compatibilidad con el frontend
    const transformedPost = {
      id: existingPost.id,
      title: existingPost.title,
      content: existingPost.content,
      excerpt: existingPost.excerpt || existingPost.content.substring(0, 150) + '...',
      category: existingPost.category,
      status: existingPost.published ? 'published' : 'draft',
      views: existingPost.views,
      comments: existingPost.comments,
      author: {
        id: existingPost.author.id,
        name: existingPost.author.name || 'Autor',
        email: existingPost.author.email
      },
      createdAt: existingPost.createdAt.toISOString(),
      updatedAt: existingPost.updatedAt.toISOString()
    };

    console.log('Post deleted successfully:', transformedPost.title);

    return NextResponse.json({
      message: 'Post eliminado exitosamente',
      post: transformedPost
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}