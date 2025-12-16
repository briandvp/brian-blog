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
- Sistema de suscripciones con notificaciones por email vía SMTP/Brevo

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
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de base de datos y configuración de SMTP.

### Configuración de SMTP/Brevo

Para habilitar las notificaciones por email, necesitas configurar las siguientes variables en `.env.local`:

```env
# Email Configuration (SMTP/Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=tu_usuario_smtp@smtp-brevo.com
SMTP_PASSWORD=tu_contraseña_smtp
SMTP_FROM=noreply@email.brianmep.com
SMTP_AUTH=true
SMTP_STARTTLS_ENABLE=true
SMTP_STARTTLS_REQUIRED=true
SMTP_SSL_TRUST=smtp-relay.brevo.com

# Brevo API (Opcional - para sincronizar suscriptores con Brevo)
BREVO_API_KEY=tu_api_key_de_brevo
BREVO_LIST_ID=id_de_lista  # Opcional: ID de lista específica donde agregar contactos
```

**Cómo obtener tus credenciales SMTP de Brevo:**
1. Inicia sesión en tu cuenta de Brevo
2. Ve a **SMTP & API** → **SMTP**
3. Copia el **SMTP Server**, **Port**, **Login** y **Password**
4. El **Login** es el username SMTP (formato: `xxxxx@smtp-brevo.com`), NO tu email de cuenta
5. El email en `SMTP_FROM` debe ser un email del dominio autenticado en Brevo

**Cómo obtener tu API Key de Brevo (para sincronizar suscriptores):**
1. Inicia sesión en tu cuenta de Brevo
2. Ve a **SMTP & API** → **API Keys**
3. Haz clic en **Generate a new API key**
4. Asigna un nombre al key (ej: "Blog Subscriptions")
5. Selecciona los permisos necesarios: **Contacts** (para agregar contactos)
6. Copia el API key generado y agrégalo a tu `.env` como `BREVO_API_KEY`
7. (Opcional) Si quieres agregar contactos a una lista específica, ve a **CRM** → **Lists**, copia el ID de la lista y agrégalo como `BREVO_LIST_ID`

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
