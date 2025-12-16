/**
 * Función para enviar notificaciones por email vía SMTP/Brevo cuando se publique un nuevo post
 */

import nodemailer from 'nodemailer';

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: {
    name?: string;
    email?: string;
  };
}

interface Subscriber {
  email: string;
  name?: string | null;
}

/**
 * Crea un transporter de nodemailer configurado con las credenciales SMTP de Brevo
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUsername = process.env.SMTP_USERNAME;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpUsername || !smtpPassword || !smtpFrom) {
    throw new Error('SMTP configuration is incomplete. Please check your environment variables.');
  }

  const transporterConfig: any = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  };

  // Configuración adicional para Brevo con STARTTLS
  if (process.env.SMTP_STARTTLS_ENABLE === 'true') {
    transporterConfig.requireTLS = process.env.SMTP_STARTTLS_REQUIRED === 'true';
    transporterConfig.tls = {
      rejectUnauthorized: false, // Brevo requiere esto
    };
  }

  return nodemailer.createTransport(transporterConfig);
}

/**
 * Obtiene todos los suscriptores activos de la base de datos
 */
async function getActiveSubscribers() {
  const { prisma } = await import('@/lib/prisma');
  return await prisma.subscriber.findMany({
    where: { active: true },
    select: {
      email: true,
      name: true,
    },
  });
}

/**
 * Genera el HTML del email para notificar sobre un nuevo post
 */
function generatePostEmailHtml(post: PostData, postUrl: string, excerpt: string, authorName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #42403e;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .post-title {
          font-size: 24px;
          font-weight: bold;
          color: #42403e;
          margin-bottom: 15px;
        }
        .post-excerpt {
          color: #666;
          margin-bottom: 20px;
        }
        .read-more {
          display: inline-block;
          padding: 12px 24px;
          background-color: #42403e;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <p>Hola,</p>
      </div>
      <div class="content">
        <p>He publicado un nuevo artículo que creo que te puede interesar:</p>
        <h2 class="post-title">${post.title}</h2>
        <p class="post-excerpt">${excerpt}</p>
        <a href="${postUrl}" class="read-more">Leer artículo completo</a>
      </div>
      <div class="footer">
        <p>${authorName}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog">Ver todos los artículos</a></p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía notificaciones por email a todos los suscriptores sobre un nuevo post
 */
export async function notifySubscribersAboutNewPost(post: PostData) {
  console.log('=== SMTP Notification Started ===');
  console.log('Post:', post.title);

  try {
    // Verificar configuración SMTP
    const smtpFrom = process.env.SMTP_FROM;
    if (!smtpFrom) {
      console.error('SMTP_FROM is not set in environment variables.');
      return { success: false, error: 'SMTP configuration not complete' };
    }

    // Obtener suscriptores activos
    const subscribers = await getActiveSubscribers();
    console.log(`Found ${subscribers.length} active subscribers`);

    if (subscribers.length === 0) {
      console.log('No active subscribers found');
      return { success: true, message: 'No subscribers to notify' };
    }

    // Preparar el contenido del email
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.id}`;
    const excerpt = post.excerpt || post.content.substring(0, 200) + '...';
    const authorName = post.author?.name || 'Brian';

    const emailHtml = generatePostEmailHtml(post, postUrl, excerpt, authorName);
    const emailSubject = post.title;

    // Crear transporter
    const transporter = createTransporter();

    // Enviar emails a todos los suscriptores
    const emailPromises = subscribers.map(async (subscriber: Subscriber) => {
      try {
        await transporter.sendMail({
          from: `"${authorName}" <${smtpFrom}>`,
          to: subscriber.email,
          subject: emailSubject,
          html: emailHtml,
        });
        console.log(`Email sent successfully to ${subscriber.email}`);
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Error sending email to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`=== SMTP Notification Completed ===`);
    console.log(`Successful: ${successful}, Failed: ${failed}`);

    return {
      success: true,
      sent: successful,
      failed,
      total: subscribers.length,
    };
  } catch (error) {
    console.error('Error notifying subscribers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Envía un email de prueba a todos los suscriptores
 * Útil para probar la configuración de SMTP
 */
export async function sendTestEmailToSubscribers(subject?: string, message?: string) {
  console.log('=== SMTP Test Email Started ===');

  try {
    const smtpFrom = process.env.SMTP_FROM;
    if (!smtpFrom) {
      console.error('SMTP_FROM is not set in environment variables.');
      return { success: false, error: 'SMTP configuration not complete' };
    }

    // Obtener suscriptores activos
    const subscribers = await getActiveSubscribers();
    console.log(`Found ${subscribers.length} active subscribers`);

    if (subscribers.length === 0) {
      console.log('No active subscribers found');
      return { success: false, error: 'No active subscribers found' };
    }

    const emailSubject = subject || 'Email de prueba - Blog Estoico';
    const emailMessage = message || '<p>Este es un email de prueba para verificar que la configuración de SMTP está funcionando correctamente.</p>';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        ${emailMessage}
      </body>
      </html>
    `;

    // Crear transporter
    const transporter = createTransporter();

    // Enviar emails a todos los suscriptores
    const emailPromises = subscribers.map(async (subscriber: Subscriber) => {
      try {
        await transporter.sendMail({
          from: `"Brian" <${smtpFrom}>`,
          to: subscriber.email,
          subject: emailSubject,
          html: emailHtml,
        });
        console.log(`Test email sent successfully to ${subscriber.email}`);
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Error sending test email to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`=== SMTP Test Email Completed ===`);
    console.log(`Successful: ${successful}, Failed: ${failed}`);

    return {
      success: true,
      sent: successful,
      failed,
      total: subscribers.length,
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
