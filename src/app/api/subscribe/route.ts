import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Agrega un contacto a Brevo usando su API
 */
async function addContactToBrevo(email: string, name?: string) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  
  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY no está configurado. El contacto no se agregará a Brevo.');
    return null;
  }

  try {
    const brevoListId = process.env.BREVO_LIST_ID; // Opcional: ID de lista específica
    
    const contactData: any = {
      email: email.toLowerCase().trim(),
      updateEnabled: true, // Actualizar si ya existe
    };

    // Agregar nombre si está disponible
    if (name) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length > 0) {
        contactData.attributes = {
          FIRSTNAME: nameParts[0],
          ...(nameParts.length > 1 && { LASTNAME: nameParts.slice(1).join(' ') }),
        };
      }
    }

    // Agregar a lista específica si está configurada
    if (brevoListId) {
      contactData.listIds = [parseInt(brevoListId)];
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Si el contacto ya existe (código 400 con mensaje específico), no es un error crítico
      if (response.status === 400 && errorData.message?.includes('already exists')) {
        console.log(`Contacto ${email} ya existe en Brevo`);
        return { success: true, alreadyExists: true };
      }
      console.error('Error agregando contacto a Brevo:', errorData);
      return null;
    }

    const data = await response.json();
    console.log(`Contacto ${email} agregado exitosamente a Brevo`);
    return { success: true, data };
  } catch (error) {
    console.error('Error al agregar contacto a Brevo:', error);
    return null;
  }
}

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

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    try {
      // Intentar crear el suscriptor en la base de datos
      const subscriber = await prisma.subscriber.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          active: true,
        },
      });

      // Intentar agregar a Brevo (no bloquea si falla)
      addContactToBrevo(email, name).catch(err => {
        console.error('Error no crítico al agregar a Brevo:', err);
      });

      return NextResponse.json(
        { message: 'Suscripción exitosa', data: subscriber },
        { status: 200 }
      );
    } catch (error: any) {
      // Si el suscriptor ya existe (error de unique constraint)
      if (error.code === 'P2002') {
        // Verificar si el suscriptor está activo
        const existingSubscriber = await prisma.subscriber.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (existingSubscriber?.active) {
          return NextResponse.json(
            { message: 'Ya estás suscrito a nuestra lista', success: true },
            { status: 200 }
          );
        } else {
          // Reactivar el suscriptor si estaba inactivo
          const reactivatedSubscriber = await prisma.subscriber.update({
            where: { email: email.toLowerCase().trim() },
            data: {
              active: true,
              name: name?.trim() || existingSubscriber.name,
            },
          });

          // Intentar agregar a Brevo (no bloquea si falla)
          addContactToBrevo(email, name || existingSubscriber.name || undefined).catch(err => {
            console.error('Error no crítico al agregar a Brevo:', err);
          });

          return NextResponse.json(
            { message: 'Suscripción reactivada exitosamente', data: reactivatedSubscriber },
            { status: 200 }
          );
        }
      }

      throw error;
    }
  } catch (error) {
    console.error('Error en la suscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

