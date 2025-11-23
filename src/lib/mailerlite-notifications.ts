/**
 * Función para enviar notificaciones a MailerLite cuando se publique un nuevo post
 */

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

/**
 * Crea una campaña en MailerLite para notificar sobre un nuevo post
 */
export async function notifySubscribersAboutNewPost(post: PostData) {
  const mailerliteApiToken = process.env.MAILERLITE_API_TOKEN;
  const mailerliteGroupId = process.env.MAILERLITE_GROUP_ID;

  console.log('=== MailerLite Notification Started ===');
  console.log('Post:', post.title);

  console.log('MailerLite API Token:', mailerliteApiToken ? 'Configured' : 'NOT CONFIGURED');
  console.log('MailerLite Group ID:', mailerliteGroupId || 'Not configured (will send to all active subscribers)');

  if (!mailerliteApiToken) {
    console.error('MAILERLITE_API_TOKEN is not set in environment variables.');
    return { success: false, error: 'MailerLite API token not configured' };
  }

  try {
    // Preparar el contenido del email
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.id}`;
    const excerpt = post.excerpt || post.content.substring(0, 200) + '...';
    const authorName = post.author?.name || 'Brian';

    // HTML del email - diseñado para llegar a la bandeja principal
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
            color: #42403e;
            text-decoration: underline;
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
          <p><a href="${postUrl}" class="read-more">Leer artículo completo</a></p>
        </div>
        <div class="footer">
          <p>${authorName}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog">Ver todos los artículos</a></p>
        </div>
      </body>
      </html>
    `;

    const campaignName = `Nuevo artículo: ${post.title}`;
    const campaignSubject = post.title;

    // Crear la campaña en MailerLite usando el formato correcto de la API v2
    // Nota: La API de MailerLite v2 requiere crear la campaña primero sin contenido,
    // luego actualizarla con el contenido, y finalmente enviarla

    console.log('Creating MailerLite campaign:', { name: campaignName, subject: campaignSubject });

    const campaignData: any = {
      name: campaignName,
      type: 'regular',
      subject: campaignSubject,
      from_name: authorName,
      from_email: process.env.MAILERLITE_FROM_EMAIL || 'devlop.manage@gmail.com',
      language: 'es',
    };

    // La API de MailerLite requiere el campo 'emails' o 'groups' para especificar destinatarios
    if (mailerliteGroupId) {
      campaignData.groups = [mailerliteGroupId];
      console.log('Using Group ID for recipients:', mailerliteGroupId);
    } else {
      // Si no hay group ID, se enviará a todos los suscriptores activos
      console.log('No Group ID specified, campaign will be sent to all active subscribers');
    }

    // Crear la campaña usando la API de MailerLite
    const response = await fetch('https://connect.mailerlite.com/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerliteApiToken}`,
        'Accept': 'application/json',
        'X-MailerLite-ApiDocs': 'true',
      },
      body: JSON.stringify(campaignData),
    });

    const responseText = await response.text();
    let campaignId: string | null = null;

    console.log('MailerLite create campaign response status:', response.status);
    console.log('MailerLite create campaign response:', responseText);

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      console.error('MailerLite API error creating campaign:', errorData);
      return { success: false, error: errorData.message || 'Error creating campaign' };
    }

    try {
      const data = JSON.parse(responseText);
      campaignId = data.data?.id || null;
    } catch (e) {
      console.error('Error parsing campaign response:', e);
      return { success: false, error: 'Invalid response from MailerLite API' };
    }

    if (!campaignId) {
      return { success: false, error: 'Campaign ID not found in response' };
    }

    // Actualizar la campaña con el contenido HTML
    const updateResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
          'X-MailerLite-ApiDocs': 'true',
        },
        body: JSON.stringify({
          content: {
            html: emailHtml,
          },
        }),
      }
    );

    const updateResponseText = await updateResponse.text();
    console.log('MailerLite update campaign response status:', updateResponse.status);
    console.log('MailerLite update campaign response:', updateResponseText);

    // Intentar enviar la campaña automáticamente
    try {
      const sendResponse = await fetch(
        `https://connect.mailerlite.com/api/campaigns/${campaignId}/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mailerliteApiToken}`,
            'Accept': 'application/json',
            'X-MailerLite-ApiDocs': 'true',
          },
        }
      );

      const sendResponseText = await sendResponse.text();
      console.log('MailerLite send campaign response status:', sendResponse.status);
      console.log('MailerLite send campaign response:', sendResponseText);

      if (sendResponse.ok) {
        console.log('=== MailerLite Notification Completed Successfully ===');
        return { success: true, campaignId };
      } else {
        const sendError = JSON.parse(sendResponseText);
        return {
          success: true,
          campaignId,
          warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
        };
      }
    } catch (sendError: any) {
      return {
        success: true,
        campaignId,
        warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
      };
    }
  } catch (error) {
    console.error('Error notifying subscribers:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Envía un email de prueba a todos los suscriptores
 * Útil para probar la configuración de MailerLite
 */
export async function sendTestEmailToSubscribers(subject?: string, message?: string) {
  const mailerliteApiToken = process.env.MAILERLITE_API_TOKEN;
  const mailerliteGroupId = process.env.MAILERLITE_GROUP_ID;

  console.log('=== MailerLite Test Email Started ===');
  console.log('MailerLite API Token:', mailerliteApiToken ? 'Configured' : 'NOT CONFIGURED');
  console.log('MailerLite Group ID:', mailerliteGroupId || 'Not configured (will send to all active subscribers)');

  if (!mailerliteApiToken) {
    console.error('MAILERLITE_API_TOKEN is not set in environment variables.');
    return { success: false, error: 'MailerLite API token not configured' };
  }

  try {
    const emailSubject = subject || 'Email de prueba - Blog Estoico';
    const emailMessage = message || '<p>Este es un email de prueba para verificar que la configuración de MailerLite está funcionando correctamente.</p>';

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

    const campaignData: any = {
      name: 'Email de prueba',
      type: 'regular',
      subject: emailSubject,
      from_name: 'Brian',
      from_email: process.env.MAILERLITE_FROM_EMAIL || 'devlop.manage@gmail.com',
      language: 'es',
    };

    if (mailerliteGroupId) {
      campaignData.groups = [mailerliteGroupId];
      console.log('Using Group ID for recipients:', mailerliteGroupId);
    } else {
      console.log('No Group ID specified, campaign will be sent to all active subscribers');
    }

    const response = await fetch('https://connect.mailerlite.com/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerliteApiToken}`,
        'Accept': 'application/json',
        'X-MailerLite-ApiDocs': 'true',
      },
      body: JSON.stringify(campaignData),
    });

    const responseText = await response.text();
    let campaignId: string | null = null;

    console.log('MailerLite create campaign response status:', response.status);
    console.log('MailerLite create campaign response:', responseText);

    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      console.error('MailerLite API error creating campaign:', errorData);
      return { success: false, error: errorData.message || 'Error creating campaign' };
    }

    try {
      const data = JSON.parse(responseText);
      campaignId = data.data?.id || null;
    } catch (e) {
      console.error('Error parsing campaign response:', e);
      return { success: false, error: 'Invalid response from MailerLite API' };
    }

    if (!campaignId) {
      return { success: false, error: 'Campaign ID not found in response' };
    }

    // Actualizar la campaña con el contenido HTML
    const updateResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
          'X-MailerLite-ApiDocs': 'true',
        },
        body: JSON.stringify({
          content: {
            html: emailHtml,
          },
        }),
      }
    );

    const updateResponseText = await updateResponse.text();
    console.log('MailerLite update campaign response status:', updateResponse.status);
    console.log('MailerLite update campaign response:', updateResponseText);

    // Intentar enviar la campaña automáticamente
    try {
      const sendResponse = await fetch(
        `https://connect.mailerlite.com/api/campaigns/${campaignId}/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mailerliteApiToken}`,
            'Accept': 'application/json',
            'X-MailerLite-ApiDocs': 'true',
          },
        }
      );

      const sendResponseText = await sendResponse.text();
      console.log('MailerLite send campaign response status:', sendResponse.status);
      console.log('MailerLite send campaign response:', sendResponseText);

      if (sendResponse.ok) {
        console.log('=== MailerLite Test Email Completed Successfully ===');
        return { success: true, campaignId };
      } else {
        const sendError = JSON.parse(sendResponseText);
        return {
          success: true,
          campaignId,
          warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
        };
      }
    } catch (sendError: any) {
      return {
        success: true,
        campaignId,
        warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
      };
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

