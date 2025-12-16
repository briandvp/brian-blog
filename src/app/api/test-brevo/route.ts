import { NextRequest, NextResponse } from 'next/server';

/**
 * Ruta de prueba para verificar la integración con la API de Brevo
 * GET /api/test-brevo?email=test@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || 'test-api@example.com';

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'BREVO_API_KEY no está configurado en las variables de entorno',
          message: 'Por favor, agrega BREVO_API_KEY a tu archivo .env',
        },
        { status: 500 }
      );
    }

    console.log('=== Test de API de Brevo ===');
    console.log(`Email de prueba: ${testEmail}`);
    console.log('API Key configurado:', brevoApiKey ? 'Sí' : 'No');

    // Intentar agregar un contacto de prueba
    const contactData = {
      email: testEmail,
      updateEnabled: true,
      attributes: {
        FIRSTNAME: 'Test',
        LASTNAME: 'API',
      },
    };

    console.log('Enviando petición a Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(contactData),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('✅ Contacto agregado exitosamente a Brevo');
      return NextResponse.json({
        success: true,
        message: 'Contacto agregado exitosamente a Brevo',
        data: responseData,
      });
    } else {
      // Si el contacto ya existe, no es un error
      if (response.status === 400 && responseData.message?.includes('already exists')) {
        console.log('ℹ️  El contacto ya existe en Brevo (esto es normal)');
        return NextResponse.json({
          success: true,
          message: 'El contacto ya existe en Brevo',
          alreadyExists: true,
          data: responseData,
        });
      }

      console.error('❌ Error al agregar contacto:', response.status, responseData);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al agregar contacto a Brevo',
          status: response.status,
          data: responseData,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Error en el test:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
