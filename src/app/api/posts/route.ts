import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts - Obtener todos los posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Datos de ejemplo para el blog
    const mockPosts = [
      {
        id: "1",
        title: "La dicotomía de control en la vida moderna",
        content: "Una reflexión profunda sobre cómo aplicar los principios estoicos en nuestro día a día. La dicotomía de control es uno de los conceptos fundamentales del estoicismo que nos enseña a distinguir entre lo que está bajo nuestro control y lo que no.",
        excerpt: "Una reflexión profunda sobre cómo aplicar los principios estoicos en nuestro día a día...",
        category: "Principios estoicos",
        status: "published",
        views: 1250,
        comments: 23,
        author: {
          id: "1",
          name: "Brian",
          email: "brian@example.com"
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "2",
        title: "Entrevista con un filósofo estoico contemporáneo",
        content: "Conversación exclusiva sobre la relevancia del estoicismo en el siglo XXI. Exploramos cómo los principios antiguos pueden aplicarse a los desafíos modernos.",
        excerpt: "Conversación exclusiva sobre la relevancia del estoicismo en el siglo XXI...",
        category: "Entrevistas",
        status: "published",
        views: 890,
        comments: 15,
        author: {
          id: "1",
          name: "Brian",
          email: "brian@example.com"
        },
        createdAt: "2024-01-10T14:30:00Z",
        updatedAt: "2024-01-10T14:30:00Z"
      },
      {
        id: "3",
        title: "Citas estoicas para la resiliencia",
        content: "Una recopilación de las mejores citas de Marco Aurelio, Epicteto y Séneca que nos ayudan a desarrollar la resiliencia mental y emocional.",
        excerpt: "Una recopilación de las mejores citas de Marco Aurelio, Epicteto y Séneca...",
        category: "Citas estoicas",
        status: "published",
        views: 2100,
        comments: 45,
        author: {
          id: "1",
          name: "Brian",
          email: "brian@example.com"
        },
        createdAt: "2024-01-08T09:15:00Z",
        updatedAt: "2024-01-08T09:15:00Z"
      },
      {
        id: "4",
        title: "La psicología del estoicismo aplicada",
        content: "Cómo los principios estoicos pueden mejorar nuestra salud mental y bienestar psicológico en el mundo moderno.",
        excerpt: "Cómo los principios estoicos pueden mejorar nuestra salud mental...",
        category: "Psicología estoica",
        status: "published",
        views: 1800,
        comments: 32,
        author: {
          id: "1",
          name: "Brian",
          email: "brian@example.com"
        },
        createdAt: "2024-01-05T16:45:00Z",
        updatedAt: "2024-01-05T16:45:00Z"
      }
    ];

    // Filtrar posts por estado
    let filteredPosts = mockPosts;
    if (status && status !== 'all') {
      filteredPosts = mockPosts.filter(post => post.status === status);
    }

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Filtrar por búsqueda
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Paginación
    const skip = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(skip, skip + limit);

    // Calcular estadísticas
    const stats = {
      total: filteredPosts.length,
      published: mockPosts.filter(post => post.status === 'published').length,
      drafts: mockPosts.filter(post => post.status === 'draft').length,
      totalViews: mockPosts.reduce((sum, post) => sum + post.views, 0)
    };

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        pages: Math.ceil(filteredPosts.length / limit)
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

// POST /api/posts - Crear nuevo post (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    // Por ahora, solo devolvemos un error ya que no tenemos autenticación configurada
    return NextResponse.json(
      { error: 'Funcionalidad no disponible' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
