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
  console.log('Post ID:', post.id);
  console.log('Post Title:', post.title);
  console.log('MailerLite API Token:', mailerliteApiToken ? 'Configured' : 'NOT CONFIGURED');
  console.log('MailerLite Group ID:', mailerliteGroupId || 'Not configured (will send to all active subscribers)');

  if (!mailerliteApiToken) {
    console.error('MAILERLITE_API_TOKEN is not set in environment variables.');
    return { success: false, error: 'MailerLite API token not configured' };
  }

  try {
    // Obtener la URL base del sitio
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const postUrl = `${baseUrl}/blog/${post.id}`;
    
    // Crear el contenido del email - más personal y menos como newsletter
    // Nota: Intentamos ocultar el branding de MailerLite con CSS, aunque en plan gratuito se agrega automáticamente
    const emailContent = `
      <style>
        /* Intentar ocultar el branding de MailerLite */
        a[href*="mailerlite.com"], 
        img[src*="mailerlite.com"],
        table[class*="mailerlite"],
        div[class*="mailerlite"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }
      </style>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Hola,
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Acabo de publicar un nuevo artículo que creo que te puede interesar:
        </p>
        
        <h2 style="color: #42403e; font-size: 24px; margin-bottom: 15px; line-height: 1.4;">
          ${post.title}
        </h2>
        
        ${post.excerpt ? `
          <div style="color: #555; font-size: 15px; line-height: 1.7; margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-left: 3px solid #42403e;">
            ${post.excerpt}
          </div>
        ` : ''}
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Puedes leer el artículo completo aquí: <a href="${postUrl}" style="color: #42403e; text-decoration: underline;">${postUrl}</a>
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
          ${post.author?.name ? `Saludos,<br>${post.author.name}` : 'Saludos'}
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px; line-height: 1.5;">
          ${post.category ? `Categoría: ${post.category}` : ''}
          ${post.category && post.author?.name ? ' | ' : ''}
          ${post.author?.name ? `Autor: ${post.author.name}` : ''}
        </p>
      </div>
    `;

    // Crear la campaña en MailerLite usando el formato correcto de la API v2
    // Nota: La API de MailerLite v2 requiere crear la campaña primero sin contenido,
    // luego actualizar el contenido y finalmente enviarla
    
    const campaignName = `Nueva publicación: ${post.title.substring(0, 50)}`;
    // Asunto más personal, sin emojis ni palabras de marketing para evitar Promociones
    const campaignSubject = post.title.length > 50 ? post.title.substring(0, 50) : post.title;
    
    console.log('Creating MailerLite campaign:', { name: campaignName, subject: campaignSubject });

    // Paso 1: Crear la campaña básica
    // Usar nombre del autor si está disponible, sino un nombre más personal
    const fromName = post.author?.name || 'Brian';
    const campaignData: any = {
      name: campaignName,
      type: 'regular',
      subject: campaignSubject, // Sin emojis ni palabras de marketing
      from_name: fromName, // Nombre personal en lugar de "brian-blog"
      from_email: process.env.MAILERLITE_FROM_EMAIL || 'devlop.manage@gmail.com',
      language: 'es',
    };

    // La API de MailerLite requiere el campo 'emails' o 'groups' para especificar destinatarios
    // Si hay un group ID, usar groups, si no, usar emails con un array vacío para enviar a todos
    if (mailerliteGroupId) {
      campaignData.groups = [mailerliteGroupId];
      console.log('Using Group ID for recipients:', mailerliteGroupId);
    } else {
      // Si no hay Group ID, usar emails vacío para enviar a todos los suscriptores activos
      campaignData.emails = [];
      console.log('No Group ID specified, campaign will be sent to all active subscribers');
    }

    console.log('Campaign data:', JSON.stringify(campaignData, null, 2));

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
    console.log('MailerLite create campaign response status:', response.status);
    console.log('MailerLite create campaign response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('MailerLite API error creating campaign:', errorData);
      return { success: false, error: errorData.message || `Error creating campaign: ${response.status}` };
    }

    let campaign;
    try {
      campaign = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing campaign response:', e);
      return { success: false, error: 'Invalid response from MailerLite API' };
    }

    const campaignId = campaign.data?.id || campaign.id;
    
    if (!campaignId) {
      console.error('Campaign created but no ID returned:', campaign);
      return { success: false, error: 'Campaign created but no ID returned' };
    }

    console.log('Campaign created successfully with ID:', campaignId);

    // Paso 2: Actualizar la campaña con el contenido HTML
    const updateData = {
      content: {
        html: emailContent,
        plain_text: `Hola,\n\nAcabo de publicar un nuevo artículo que creo que te puede interesar:\n\n${post.title}\n\n${post.excerpt || post.content.substring(0, 200)}...\n\nPuedes leer el artículo completo aquí: ${postUrl}\n\n${post.author?.name ? `Saludos,\n${post.author.name}` : 'Saludos'}`
      }
    };

    console.log('Updating campaign content for ID:', campaignId);
    const updateResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    const updateResponseText = await updateResponse.text();
    console.log('MailerLite update campaign response status:', updateResponse.status);
    console.log('MailerLite update campaign response:', updateResponseText);

    if (!updateResponse.ok) {
      let updateError;
      try {
        updateError = JSON.parse(updateResponseText);
      } catch {
        updateError = { message: updateResponseText };
      }
      console.error('Error updating campaign content:', updateError);
      // Continuar de todas formas, la campaña se creó
    } else {
      console.log('Campaign content updated successfully');
    }

    // Paso 3: Enviar la campaña inmediatamente
    console.log('Sending campaign for ID:', campaignId);
    const sendResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type: 'now' // Enviar inmediatamente
        }),
      }
    );

    const sendResponseText = await sendResponse.text();
    console.log('MailerLite send campaign response status:', sendResponse.status);
    console.log('MailerLite send campaign response:', sendResponseText);

    if (!sendResponse.ok) {
      let sendError;
      try {
        sendError = JSON.parse(sendResponseText);
      } catch {
        sendError = { message: sendResponseText };
      }
      console.error('Error sending campaign:', sendError);
      // La campaña se creó pero no se pudo enviar automáticamente
      return { 
        success: true, 
        campaignId: campaignId,
        warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
      };
    }

    console.log('Campaign sent successfully!');
    return { success: true, campaignId: campaignId };
  } catch (error) {
    console.error('Error notifying subscribers:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Función simple para enviar un email de prueba a todos los suscriptores
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    // Asunto más personal sin emojis ni palabras de marketing
    const emailSubject = subject || `Actualización del blog - ${new Date().toLocaleDateString('es-ES')}`;
    const emailMessage = message || `
      <p>Hola,</p>
      <p>Este es un email de prueba para verificar que la configuración está funcionando correctamente.</p>
      <p>Si recibes este mensaje, todo está configurado bien.</p>
    `;

    // Nota: Intentamos ocultar el branding de MailerLite con CSS, aunque en plan gratuito se agrega automáticamente
    const emailContent = `
      <style>
        /* Intentar ocultar el branding de MailerLite */
        a[href*="mailerlite.com"], 
        img[src*="mailerlite.com"],
        table[class*="mailerlite"],
        div[class*="mailerlite"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }
      </style>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          ${emailMessage}
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Puedes visitar el blog aquí: <a href="${baseUrl}" style="color: #42403e; text-decoration: underline;">${baseUrl}</a>
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 30px;">
          Saludos,<br>
          Brian
        </p>
      </div>
    `;

    const campaignName = `Email de prueba - ${new Date().toLocaleDateString('es-ES')}`;

    // Paso 1: Crear la campaña básica
    const campaignData: any = {
      name: campaignName,
      type: 'regular',
      subject: emailSubject,
      from_name: 'Brian', // Nombre personal en lugar de "brian-blog"
      from_email: process.env.MAILERLITE_FROM_EMAIL || 'devlop.manage@gmail.com',
      language: 'es',
    };

    if (mailerliteGroupId) {
      campaignData.groups = [mailerliteGroupId];
      console.log('Using Group ID for recipients:', mailerliteGroupId);
    } else {
      campaignData.emails = [];
      console.log('No Group ID specified, campaign will be sent to all active subscribers');
    }

    // Crear la campaña
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
    console.log('MailerLite create campaign response status:', response.status);
    console.log('MailerLite create campaign response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('MailerLite API error creating campaign:', errorData);
      return { success: false, error: errorData.message || `Error creating campaign: ${response.status}` };
    }

    let campaign;
    try {
      campaign = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing campaign response:', e);
      return { success: false, error: 'Invalid response from MailerLite API' };
    }

    const campaignId = campaign.data?.id || campaign.id;
    
    if (!campaignId) {
      console.error('Campaign created but no ID returned:', campaign);
      return { success: false, error: 'Campaign created but no ID returned' };
    }

    console.log('Campaign created successfully with ID:', campaignId);

    // Paso 2: Actualizar la campaña con el contenido HTML
    const updateData = {
      content: {
        html: emailContent,
        plain_text: `Email de prueba\n\n${emailMessage.replace(/<[^>]*>/g, '')}\n\nVisitar el blog: ${baseUrl}`
      }
    };

    const updateResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );

    const updateResponseText = await updateResponse.text();
    console.log('MailerLite update campaign response status:', updateResponse.status);

    if (!updateResponse.ok) {
      let updateError;
      try {
        updateError = JSON.parse(updateResponseText);
      } catch {
        updateError = { message: updateResponseText };
      }
      console.error('Error updating campaign content:', updateError);
    } else {
      console.log('Campaign content updated successfully');
    }

    // Paso 3: Enviar la campaña inmediatamente
    console.log('Sending campaign for ID:', campaignId);
    const sendResponse = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${campaignId}/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiToken}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type: 'now'
        }),
      }
    );

    const sendResponseText = await sendResponse.text();
    console.log('MailerLite send campaign response status:', sendResponse.status);
    console.log('MailerLite send campaign response:', sendResponseText);

    if (!sendResponse.ok) {
      let sendError;
      try {
        sendError = JSON.parse(sendResponseText);
      } catch {
        sendError = { message: sendResponseText };
      }
      console.error('Error sending campaign:', sendError);
      return { 
        success: true, 
        campaignId: campaignId,
        warning: `Campaign created but not sent automatically. Error: ${sendError.message || 'Unknown error'}. You can send it manually from MailerLite dashboard.`
      };
    }

    console.log('Test email sent successfully!');
    return { success: true, campaignId: campaignId };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

