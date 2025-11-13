import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmailToSubscribers } from '@/lib/mailerlite-notifications';

/**
 * Endpoint simple para enviar un email de prueba a todos los suscriptores
 * POST /api/send-test-email
 * 
 * Body (opcional):
 * {
 *   "subject": "Asunto personalizado",
 *   "message": "Mensaje personalizado en HTML"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { subject, message } = body;

    console.log('Sending test email to subscribers...');

    const result = await sendTestEmailToSubscribers(subject, message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        campaignId: result.campaignId,
        warning: result.warning
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Error desconocido al enviar el email'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en send-test-email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/send-test-email
 * Envía un email de prueba con valores por defecto
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Sending test email to subscribers (GET request)...');

    const result = await sendTestEmailToSubscribers();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de prueba enviado exitosamente',
        campaignId: result.campaignId,
        warning: result.warning
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Error desconocido al enviar el email'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en send-test-email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

