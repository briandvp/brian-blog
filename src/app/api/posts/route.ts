import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/posts - Obtener todos los posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Fetching posts with params:', { status, category, search, page, limit });

    // Construir filtros para Prisma
    const where: any = {};
    
    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Obtener posts con paginación
    const skip = (page - 1) * limit;
    
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    // Transformar datos para mantener compatibilidad con el frontend
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      category: post.category,
      status: post.published ? 'published' : 'draft',
      views: post.views,
      comments: post.comments,
      author: {
        id: post.author.id,
        name: post.author.name || 'Autor',
        email: post.author.email
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));

    // Calcular estadísticas
    const [publishedCount, draftCount, totalViews] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.aggregate({
        _sum: { views: true }
      })
    ]);

    const stats = {
      total: totalCount,
      published: publishedCount,
      drafts: draftCount,
      totalViews: totalViews._sum.views || 0
    };

    console.log('Posts fetched:', transformedPosts.length);

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Crear nuevo post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, status = 'draft' } = body;

    console.log('Creating new post:', { title, status, category });

    // Validar campos requeridos
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Buscar o crear un usuario por defecto (temporal)
    let author = await prisma.user.findFirst();
    if (!author) {
      author = await prisma.user.create({
        data: {
          email: 'admin@blog.com',
          name: 'Admin',
          password: 'temp_password' // En producción, esto debería ser hasheado
        }
      });
    }

    // Crear nuevo post en la base de datos
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        category: category || 'General',
        published: status === 'published',
        authorId: author.id
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
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
      category: newPost.category,
      status: newPost.published ? 'published' : 'draft',
      views: newPost.views,
      comments: newPost.comments,
      author: {
        id: newPost.author.id,
        name: newPost.author.name || 'Autor',
        email: newPost.author.email
      },
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString()
    };

    console.log('Post created successfully:', transformedPost);

    return NextResponse.json({
      message: 'Post creado exitosamente',
      post: transformedPost
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
