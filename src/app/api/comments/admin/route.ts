import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/comments/admin - Obtener todos los comentarios para administración
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = status && status !== 'all' 
      ? { status: status.toUpperCase() as any }
      : {};

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          post: {
            select: {
              title: true,
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.comment.count({ where })
    ]);

    const stats = await prisma.comment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const statusStats = {
      total: await prisma.comment.count(),
      pending: stats.find(s => s.status === 'PENDING')?._count.status || 0,
      approved: stats.find(s => s.status === 'APPROVED')?._count.status || 0,
      rejected: stats.find(s => s.status === 'REJECTED')?._count.status || 0,
      spam: stats.find(s => s.status === 'SPAM')?._count.status || 0
    };

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: statusStats
    });
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/comments/admin - Acciones masivas en comentarios
export async function PUT(request: NextRequest) {
  try {
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
    
    const { action, commentIds, status } = body;

    if (!action || !commentIds || !Array.isArray(commentIds)) {
      return NextResponse.json(
        { error: 'Acción y IDs de comentarios son requeridos' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'updateStatus':
        if (!status) {
          return NextResponse.json(
            { error: 'Estado es requerido para esta acción' },
            { status: 400 }
          );
        }
        result = await prisma.comment.updateMany({
          where: {
            id: {
              in: commentIds
            }
          },
          data: {
            status: status.toUpperCase() as any
          }
        });
        break;

      case 'delete':
        result = await prisma.comment.deleteMany({
          where: {
            id: {
              in: commentIds
            }
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Acción ${action} completada exitosamente`,
      affected: result.count
    });
  } catch (error) {
    console.error('Error in bulk comment action:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
