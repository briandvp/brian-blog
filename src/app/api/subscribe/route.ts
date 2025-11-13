import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Obtener el API token de MailerLite desde las variables de entorno
    const mailerliteApiToken = process.env.MAILERLITE_API_TOKEN;
    const mailerliteGroupId = process.env.MAILERLITE_GROUP_ID;

    if (!mailerliteApiToken) {
      console.error('MAILERLITE_API_TOKEN no está configurado');
      return NextResponse.json(
        { error: 'Servicio de suscripción no configurado' },
        { status: 500 }
      );
    }

    // Preparar los datos del suscriptor
    const subscriberData: any = {
      email,
      status: 'active',
    };

    if (name) {
      subscriberData.name = name;
    }

    // Si hay un group ID, agregarlo
    if (mailerliteGroupId) {
      subscriberData.groups = [mailerliteGroupId];
    }

    // Hacer la petición a la API de MailerLite v2
    const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailerliteApiToken}`,
        'Accept': 'application/json',
        'X-MailerLite-ApiDocs': 'true',
      },
      body: JSON.stringify(subscriberData),
    });

    const mailerliteData = await mailerliteResponse.json();

    if (!mailerliteResponse.ok) {
      // Si el suscriptor ya existe, no es un error crítico
      if (mailerliteResponse.status === 422 || mailerliteData.message?.includes('already exists')) {
        return NextResponse.json(
          { message: 'Ya estás suscrito a nuestra lista', success: true },
          { status: 200 }
        );
      }

      console.error('Error de MailerLite:', mailerliteData);
      return NextResponse.json(
        { error: mailerliteData.message || 'Error al suscribirse' },
        { status: mailerliteResponse.status }
      );
    }

    return NextResponse.json(
      { message: 'Suscripción exitosa', data: mailerliteData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en la suscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

