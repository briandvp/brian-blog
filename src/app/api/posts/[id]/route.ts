import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifySubscribersAboutNewPost } from '@/lib/smtp-notifications';

// GET /api/posts/[id] - Obtener un post específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'es'; // Idioma por defecto: español
    const incrementViews = searchParams.get('incrementViews') !== 'false'; // Por defecto true
    
    console.log('Fetching post with ID:', postId, 'Language:', lang, 'Increment views:', incrementViews);

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

    // Incrementar las vistas solo si se solicita
    if (incrementViews) {
      await prisma.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } }
      });
    }

    // Seleccionar contenido según el idioma
    const useEnglish = lang === 'en';
    const title = useEnglish && post.titleEn ? post.titleEn : post.title;
    const content = useEnglish && post.contentEn ? post.contentEn : post.content;
    const excerpt = useEnglish && post.excerptEn ? post.excerptEn : (post.excerpt || post.content.substring(0, 150) + '...');
    const category = useEnglish && post.categoryEn ? post.categoryEn : post.category;

    // Transformar para mantener compatibilidad con el frontend
    const transformedPost = {
      id: post.id,
      title,
      content,
      excerpt,
      category,
      status: post.published ? 'published' : 'draft',
      views: incrementViews ? post.views + 1 : post.views, // Incluir la vista incrementada solo si se incrementó
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

    // Verificar si el post está siendo publicado (cambiando de draft a published)
    const wasPublished = existingPost.published;
    const willBePublished = status === 'published';

    // Extraer campos en inglés si vienen en el body
    const { titleEn, contentEn, excerptEn, categoryEn } = body;

    // Actualizar el post en la base de datos
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        ...(category && { category }),
        ...(titleEn !== undefined && { titleEn }),
        ...(contentEn !== undefined && { contentEn }),
        ...(excerptEn !== undefined && { excerptEn }),
        ...(categoryEn !== undefined && { categoryEn }),
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

    // Notificar a los suscriptores si el post se está publicando por primera vez
    if (!wasPublished && willBePublished) {
      console.log('Post is being published for the first time, notifying subscribers...');
      // Ejecutar en segundo plano para no bloquear la respuesta
      notifySubscribersAboutNewPost({
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        excerpt: updatedPost.excerpt || undefined,
        category: updatedPost.category || undefined,
        author: {
          name: updatedPost.author.name || undefined,
          email: updatedPost.author.email || undefined
        }
      }).then(result => {
        if (result.success) {
          console.log('Subscribers notified successfully:', 'sent' in result ? `${result.sent}/${result.total}` : result.message);
        } else {
          console.error('Error notifying subscribers:', result.error);
        }
      }).catch(error => {
        console.error('Error in notification process:', error);
      });
    }

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