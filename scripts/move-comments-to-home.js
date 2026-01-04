/**
 * Script para mover comentarios de la tabla 'comments' a 'home_comments'
 * 
 * Uso: node scripts/move-comments-to-home.js
 * 
 * Este script busca los comentarios de Maya y Mila que fueron guardados
 * incorrectamente en la tabla de comentarios de posts y los mueve a
 * la tabla de comentarios de Home.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function moveCommentsToHome() {
  console.log('🔍 Buscando comentarios para mover...\n');

  try {
    // Buscar comentarios de Maya y Mila que tienen email específico
    // Puedes ajustar estos emails según corresponda
    const commentsToMove = await prisma.comment.findMany({
      where: {
        OR: [
          { email: 'alemayatb@gmail.com' },  // Maya
          { email: 'ko.mazumee@gmail.com' }   // Mila
        ]
      },
      include: {
        post: {
          select: {
            title: true
          }
        }
      }
    });

    if (commentsToMove.length === 0) {
      console.log('❌ No se encontraron comentarios para mover.');
      return;
    }

    console.log(`📋 Se encontraron ${commentsToMove.length} comentario(s) para mover:\n`);

    for (const comment of commentsToMove) {
      console.log(`  - ID: ${comment.id}`);
      console.log(`    Autor: ${comment.author} (${comment.email})`);
      console.log(`    Contenido: ${comment.content.substring(0, 50)}...`);
      console.log(`    Post original: ${comment.post?.title || 'N/A'}`);
      console.log(`    Estado: ${comment.status}`);
      console.log(`    Fecha: ${comment.createdAt}`);
      console.log('');
    }

    // Confirmar antes de proceder
    console.log('⚠️  ¿Deseas mover estos comentarios a HomeComment?');
    console.log('   Para confirmar, ejecuta con el flag --confirm\n');
    console.log('   node scripts/move-comments-to-home.js --confirm\n');

    if (!process.argv.includes('--confirm')) {
      console.log('❌ Operación cancelada (falta --confirm)');
      return;
    }

    console.log('✅ Confirmado. Moviendo comentarios...\n');

    // Mover cada comentario
    for (const comment of commentsToMove) {
      // Crear en home_comments
      const newHomeComment = await prisma.homeComment.create({
        data: {
          content: comment.content,
          author: comment.author,
          email: comment.email,
          status: comment.status,
          isReply: comment.isReply,
          parentId: null, // No mantenemos la relación de respuesta por simplicidad
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt
        }
      });

      console.log(`  ✓ Creado HomeComment: ${newHomeComment.id}`);

      // Eliminar de comments
      await prisma.comment.delete({
        where: { id: comment.id }
      });

      console.log(`  ✓ Eliminado Comment: ${comment.id}\n`);
    }

    console.log(`🎉 ¡Listo! Se movieron ${commentsToMove.length} comentario(s) a home_comments.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

moveCommentsToHome();
