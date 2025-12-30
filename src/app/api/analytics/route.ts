import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Total de vistas, visitantes y comentarios
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        views: true,
        comments: true,
        commentsList: {
          select: { id: true },
        },
        createdAt: true,
      },
    });

    const users = await prisma.user.findMany({
      select: { id: true },
    });

    const comments = await prisma.comment.findMany({
      select: { id: true, createdAt: true },
    });

    const subscribers = await prisma.subscriber.findMany({
      select: { id: true },
    });

    // Calcular estadísticas totales
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalComments = comments.length;
    const totalUsers = users.length;
    const totalSubscribers = subscribers.length;

    // Top posts (por vistas)
    const topPosts = posts
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        views: post.views,
        comments: post.commentsList.length,
      }));

    // Posts creados este mes
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const postsThisMonth = posts.filter(
      post => new Date(post.createdAt) >= firstDayOfMonth
    );

    // Comentarios este mes
    const commentsThisMonth = comments.filter(
      comment => new Date(comment.createdAt) >= firstDayOfMonth
    );

    // Vistas este mes
    const viewsThisMonth = postsThisMonth.reduce((sum, post) => sum + post.views, 0);

    // Últimos 30 días de datos por día
    const monthlyData: Record<string, { views: number; posts: number; comments: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      monthlyData[dateStr] = { views: 0, posts: 0, comments: 0 };
    }

    posts.forEach(post => {
      const dateStr = new Date(post.createdAt).toISOString().split('T')[0];
      if (monthlyData[dateStr]) {
        monthlyData[dateStr].views += post.views;
        monthlyData[dateStr].posts += 1;
      }
    });

    comments.forEach(comment => {
      const dateStr = new Date(comment.createdAt).toISOString().split('T')[0];
      if (monthlyData[dateStr]) {
        monthlyData[dateStr].comments += 1;
      }
    });

    const monthlyDataArray = Object.entries(monthlyData).map(([date, data]) => ({
      date,
      ...data,
    }));

    return NextResponse.json({
      overview: {
        totalViews,
        totalUsers,
        totalComments,
        totalSubscribers,
      },
      monthlyStats: {
        views: viewsThisMonth,
        posts: postsThisMonth.length,
        comments: commentsThisMonth.length,
      },
      topPosts,
      monthlyData: monthlyDataArray,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Error fetching analytics' },
      { status: 500 }
    );
  }
}
