const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixComments() {
  try {
    console.log('Buscando posts y comentarios...\n');

    // Buscar el post "adadadadawddad"
    const post1 = await prisma.post.findFirst({
      where: {
        title: {
          contains: 'adadadadawddad',
          mode: 'insensitive'
        }
      }
    });

    // Buscar el post "LOS PATRONES DEL COMPORTAMIENTO"
    const post2 = await prisma.post.findFirst({
      where: {
        title: {
          contains: 'LOS PATRONES DEL COMPORTAMIENTO',
          mode: 'insensitive'
        },
        published: true
      }
    });

    if (!post1 || !post2) {
      console.error('No se encontraron los posts necesarios');
      if (post1) console.log('Post 1 encontrado:', post1.title, post1.id);
      if (post2) console.log('Post 2 encontrado:', post2.title, post2.id);
      process.exit(1);
    }

    console.log(`Post 1 (adadadadawddad): ${post1.id}`);
    console.log(`Post 2 (LOS PATRONES DEL COMPORTAMIENTO): ${post2.id}\n`);

    // Obtener TODOS los comentarios de ambos posts (incluyendo respuestas)
    const allComments1 = await prisma.comment.findMany({
      where: { postId: post1.id }
    });

    const allComments2 = await prisma.comment.findMany({
      where: { postId: post2.id }
    });

    console.log(`Comentarios actuales en "${post1.title}": ${allComments1.length}`);
    allComments1.forEach(c => console.log(`  - ${c.author}: ${c.content.substring(0, 30)}...`));
    
    console.log(`\nComentarios actuales en "${post2.title}": ${allComments2.length}`);
    allComments2.forEach(c => console.log(`  - ${c.author}: ${c.content.substring(0, 30)}...`));

    // Intercambiar TODOS los comentarios
    // Mover todos los comentarios de post1 a post2
    if (allComments1.length > 0) {
      const result1 = await prisma.comment.updateMany({
        where: { postId: post1.id },
        data: { postId: post2.id }
      });
      console.log(`\n✓ Movidos ${result1.count} comentarios de "${post1.title}" a "${post2.title}"`);
    }

    // Mover todos los comentarios de post2 a post1
    if (allComments2.length > 0) {
      const result2 = await prisma.comment.updateMany({
        where: { postId: post2.id },
        data: { postId: post1.id }
      });
      console.log(`✓ Movidos ${result2.count} comentarios de "${post2.title}" a "${post1.title}"`);
    }

    // Actualizar contadores de comentarios en los posts
    // Contar solo comentarios principales (sin parentId)
    const finalComments1 = await prisma.comment.count({
      where: { 
        postId: post1.id,
        parentId: null
      }
    });

    const finalComments2 = await prisma.comment.count({
      where: { 
        postId: post2.id,
        parentId: null
      }
    });

    await prisma.post.update({
      where: { id: post1.id },
      data: { comments: finalComments1 }
    });

    await prisma.post.update({
      where: { id: post2.id },
      data: { comments: finalComments2 }
    });

    console.log('\n✓ Contadores de comentarios actualizados');
    console.log('\n¡Intercambio completado exitosamente!');
    console.log(`\nResumen final:`);
    console.log(`  "${post1.title}": ${finalComments1} comentarios principales`);
    console.log(`  "${post2.title}": ${finalComments2} comentarios principales`);

    // Verificar el resultado
    const verify1 = await prisma.comment.findMany({
      where: { postId: post1.id },
      select: { author: true, content: true }
    });
    const verify2 = await prisma.comment.findMany({
      where: { postId: post2.id },
      select: { author: true, content: true }
    });

    console.log(`\nVerificación:`);
    console.log(`  Comentarios en "${post1.title}": ${verify1.length}`);
    console.log(`  Comentarios en "${post2.title}": ${verify2.length}`);

  } catch (error) {
    console.error('Error al intercambiar comentarios:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixComments();

