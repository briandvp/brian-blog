import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear un usuario admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      name: 'Brian',
      password: 'temp_password' // En producción, esto debería ser hasheado
    }
  })

  console.log('Usuario admin creado:', admin)

  // Crear posts de ejemplo
  const posts = [
    {
      title: "La dicotomía de control en la vida moderna",
      content: "Una reflexión profunda sobre cómo aplicar los principios estoicos en nuestro día a día. La dicotomía de control es uno de los conceptos fundamentales del estoicismo que nos enseña a distinguir entre lo que está bajo nuestro control y lo que no.\n\nMarco Aurelio escribió en sus Meditaciones: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.' Esta sabiduría milenaria sigue siendo relevante en nuestro mundo moderno lleno de incertidumbres.\n\nEn la práctica, esto significa enfocar nuestra energía en lo que podemos controlar: nuestras acciones, pensamientos y reacciones, mientras aceptamos con serenidad lo que está fuera de nuestro control.",
      excerpt: "Una reflexión profunda sobre cómo aplicar los principios estoicos en nuestro día a día...",
      category: "Principios estoicos",
      published: true,
      views: 1250,
      comments: 23
    },
    {
      title: "Entrevista con un filósofo estoico contemporáneo",
      content: "Conversación exclusiva sobre la relevancia del estoicismo en el siglo XXI. Exploramos cómo los principios antiguos pueden aplicarse a los desafíos modernos.\n\nEn esta entrevista, el Dr. Massimo Pigliucci, filósofo y autor de 'Cómo ser estoico', nos comparte su perspectiva sobre la aplicación práctica de la filosofía estoica en el mundo actual.\n\n'El estoicismo no es sobre suprimir emociones', explica Pigliucci, 'sino sobre entenderlas y dirigirlas de manera constructiva. Es una filosofía de acción, no de pasividad.'",
      excerpt: "Conversación exclusiva sobre la relevancia del estoicismo en el siglo XXI...",
      category: "Entrevistas",
      published: true,
      views: 890,
      comments: 15
    },
    {
      title: "Citas estoicas para la resiliencia",
      content: "Una recopilación de las mejores citas de Marco Aurelio, Epicteto y Séneca que nos ayudan a desarrollar la resiliencia mental y emocional.\n\n**Marco Aurelio:**\n'La felicidad de tu vida depende de la calidad de tus pensamientos.'\n\n**Epicteto:**\n'No es lo que te pasa, sino cómo reaccionas a lo que te pasa lo que importa.'\n\n**Séneca:**\n'La vida es muy corta y ansiosa para quien olvida el pasado, descuida el presente y teme el futuro.'\n\nEstas palabras de sabiduría nos recuerdan que la resiliencia no es una cualidad innata, sino una habilidad que podemos desarrollar a través de la práctica consciente.",
      excerpt: "Una recopilación de las mejores citas de Marco Aurelio, Epicteto y Séneca...",
      category: "Citas estoicas",
      published: true,
      views: 2100,
      comments: 45
    },
    {
      title: "La psicología del estoicismo aplicada",
      content: "Cómo los principios estoicos pueden mejorar nuestra salud mental y bienestar psicológico en el mundo moderno.\n\nLa psicología moderna ha encontrado que muchas técnicas estoicas tienen base científica sólida. Por ejemplo, la práctica de la 'premeditatio malorum' (premeditación de males) es similar a la terapia de exposición cognitiva.\n\nLa atención plena (mindfulness) que practicamos hoy tiene sus raíces en la práctica estoica de la 'prosoche' o atención consciente. Los estoicos entendían que la calidad de nuestra vida depende de la calidad de nuestros pensamientos.",
      excerpt: "Cómo los principios estoicos pueden mejorar nuestra salud mental...",
      category: "Psicología estoica",
      published: true,
      views: 1800,
      comments: 32
    },
    {
      title: "El arte de la aceptación estoica",
      content: "Explorando cómo la aceptación radical puede transformar nuestra experiencia de vida y reducir el sufrimiento innecesario.\n\nLa aceptación estoica no es resignación pasiva, sino una elección activa de trabajar con la realidad tal como es, en lugar de luchar contra ella. Como escribió Epicteto: 'No busques que los eventos sucedan como quieres, sino desea que los eventos sucedan como suceden, y tu vida será feliz.'\n\nEsta práctica nos libera de la energía que gastamos resistiendo lo inevitable y nos permite enfocar nuestros recursos en lo que realmente podemos influir.",
      excerpt: "Explorando cómo la aceptación radical puede transformar nuestra experiencia de vida...",
      category: "Principios estoicos",
      published: true,
      views: 950,
      comments: 18
    }
  ]

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: admin.id
      }
    })
    console.log('Post creado:', post.title)
  }

  console.log('Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
