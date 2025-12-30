import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/home-comments/admin - Obtener todos los home comments para administración
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = status && status !== 'all' 
      ? { status: status.toUpperCase() as any, parentId: null }
      : { parentId: null };

    const [comments, total] = await Promise.all([
      prisma.homeComment.findMany({
        where,
        include: {
          replies: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.homeComment.count({ where })
    ]);

    const stats = await prisma.homeComment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const statusStats = {
      total: await prisma.homeComment.count(),
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
      stats: statusStats,
      source: 'home' // Para diferenciar de commentarios de posts
    });
  } catch (error) {
    console.error('Error fetching home comments admin:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/home-comments/admin - Actualizar estados de home comments
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, commentIds, status } = body;

    if (!commentIds || commentIds.length === 0) {
      return NextResponse.json(
        { error: 'No hay comentarios seleccionados' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData.status = 'APPROVED';
        break;
      case 'reject':
        updateData.status = 'REJECTED';
        break;
      case 'spam':
        updateData.status = 'SPAM';
        break;
      case 'delete':
        // Eliminar comentarios
        const result = await prisma.homeComment.deleteMany({
          where: {
            id: { in: commentIds }
          }
        });
        return NextResponse.json({
          message: 'Comentarios eliminados',
          affected: result.count
        });
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

    // Actualizar estado
    const result = await prisma.homeComment.updateMany({
      where: {
        id: { in: commentIds }
      },
      data: updateData
    });

    return NextResponse.json({
      message: `Comentarios ${action === 'approve' ? 'aprobados' : action === 'reject' ? 'rechazados' : 'marcados como spam'}`,
      affected: result.count
    });
  } catch (error) {
    console.error('Error updating home comments:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
