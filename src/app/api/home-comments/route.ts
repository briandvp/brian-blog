import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';

// GET /api/home-comments - Obtener comentarios del home
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const comments = await prisma.homeComment.findMany({
            where: {
                status: status ? status.toUpperCase() as any : 'APPROVED',
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
        console.error('Error fetching home comments:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// POST /api/home-comments - Crear un nuevo comentario del home
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

        const { content, author, email, parentId } = body;

        console.log('Creating home comment:', { content, author, parentId });

        // Verificar si el usuario está autenticado como admin o author
        const user = await getUserFromSession(request);
        const isAdminOrAuthor = user && (user.role === 'ADMIN' || user.role === 'AUTHOR');

        // Si es admin/author, usar sus datos automáticamente
        let commentAuthor = author;
        let commentEmail = email;

        if (isAdminOrAuthor) {
            commentAuthor = author || user.name || user.email || 'Administrador';
            commentEmail = email || user.email || '';

            if (!content) {
                return NextResponse.json(
                    { error: 'El contenido es requerido' },
                    { status: 400 }
                );
            }
        } else {
            if (!content || !author || !email) {
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

        // Crear el comentario del home
        const comment = await prisma.homeComment.create({
            data: {
                content: content.trim(),
                author: commentAuthor.trim(),
                email: commentEmail.trim().toLowerCase(),
                parentId: parentId || null,
                isReply: !!parentId,
                status: 'APPROVED'
            }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error: any) {
        console.error('Error creating home comment:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error?.message || 'Error desconocido'
            },
            { status: 500 }
        );
    }
}
