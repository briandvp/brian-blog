# brian-blog

Un blog personal sobre filosofía estoica, desarrollo personal y reflexiones sobre la vida.

## Descripción

Este es mi blog personal donde comparto mis memorias de la vida y su eterno retorno, explorando temas relacionados con el estoicismo, la filosofía y el crecimiento personal.

## Características

- Blog personal
- Categorías organizadas: citas estoicas, entrevistas, principios estoicos, psicología estoica
- Dashboard para gestión de contenido
- Diseño responsive y moderno
- Sistema de comentarios
- Tienda integrada

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL (producción) / SQLite (desarrollo)
- Lucide React (iconos)

## Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Configura las variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de base de datos.

3. Ejecuta las migraciones de Prisma:

```bash
npm run db:push
```

4. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Deploy en Vercel

### Configuración de Base de Datos

Este proyecto requiere PostgreSQL en producción. Opciones recomendadas:

1. **Vercel Postgres** (integración nativa)
2. **Neon** (https://neon.tech) - Gratis tier generoso
3. **Supabase** (https://supabase.com) - Incluye auth y storage
4. **Railway** (https://railway.app) - PostgreSQL managed

### Pasos para Deploy

1. Crea una base de datos PostgreSQL en el proveedor de tu elección
2. En Vercel, agrega la variable de entorno:
   - `DATABASE_URL`: Tu connection string de PostgreSQL
3. Haz push a tu repositorio de Git
4. Conecta el repo en Vercel
5. Vercel ejecutará automáticamente las migraciones durante el build

## Estructura del Proyecto

- `/src/app` - Páginas y layouts de la aplicación
- `/src/components` - Componentes reutilizables
- `/src/lib` - Utilidades y configuraciones
- `/public` - Archivos estáticos (imágenes, iconos)

## Contribuir

Este es un proyecto personal, pero si tienes sugerencias o encuentras algún error, no dudes en contactarme.

## Licencia

Todos los derechos reservados.
