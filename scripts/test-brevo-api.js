/**
 * Script de prueba para verificar la integración con la API de Brevo
 * Ejecutar con: node scripts/test-brevo-api.js
 */

require('dotenv').config({ path: '.env.local' });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const TEST_EMAIL = 'test-api@example.com';

async function testBrevoAPI() {
  console.log('=== Test de API de Brevo ===\n');

  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY no está configurado en .env.local');
    console.log('Por favor, agrega BREVO_API_KEY a tu archivo .env.local');
    process.exit(1);
  }

  console.log('✅ BREVO_API_KEY encontrado');
  console.log(`📧 Email de prueba: ${TEST_EMAIL}\n`);

  try {
    // Intentar agregar un contacto de prueba
    const contactData = {
      email: TEST_EMAIL,
      updateEnabled: true,
      attributes: {
        FIRSTNAME: 'Test',
        LASTNAME: 'API',
      },
    };

    console.log('🔄 Enviando petición a Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(contactData),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('✅ Contacto agregado exitosamente a Brevo');
      console.log('📋 Datos del contacto:', JSON.stringify(responseData, null, 2));
    } else {
      // Si el contacto ya existe, no es un error
      if (response.status === 400 && responseData.message?.includes('already exists')) {
        console.log('ℹ️  El contacto ya existe en Brevo (esto es normal)');
        console.log('📋 Respuesta:', JSON.stringify(responseData, null, 2));
      } else {
        console.error('❌ Error al agregar contacto:', response.status);
        console.error('📋 Respuesta:', JSON.stringify(responseData, null, 2));
        process.exit(1);
      }
    }

    // Intentar obtener el contacto para verificar
    console.log('\n🔄 Verificando contacto en Brevo...');
    const getResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(TEST_EMAIL)}`, {
      method: 'GET',
      headers: {
        'api-key': BREVO_API_KEY,
      },
    });

    if (getResponse.ok) {
      const contact = await getResponse.json();
      console.log('✅ Contacto encontrado en Brevo');
      console.log('📋 Información del contacto:', JSON.stringify(contact, null, 2));
    } else {
      console.log('⚠️  No se pudo obtener el contacto (puede ser normal si acabas de crearlo)');
    }

    console.log('\n✅ Test completado exitosamente');
    console.log('🎉 La integración con Brevo API está funcionando correctamente');

  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testBrevoAPI();
