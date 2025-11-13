# Configuración de MailerLite

Este proyecto está integrado con MailerLite para gestionar las suscripciones de usuarios.

## Variables de Entorno Requeridas

Para que la funcionalidad de suscripción funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```env
# MailerLite API Configuration
MAILERLITE_API_TOKEN=tu_api_token_aqui
MAILERLITE_GROUP_ID=tu_group_id_aqui  # Opcional: si no se especifica, se enviará a todos los suscriptores activos
MAILERLITE_FROM_EMAIL=tu_email@ejemplo.com  # Opcional: email desde el que se enviarán las campañas (por defecto: devlop.manage@gmail.com)
```

## Cómo obtener tu API Token de MailerLite

1. Inicia sesión en tu cuenta de MailerLite
2. Ve a **Settings** → **Integrations** → **Developer API**
3. Crea un nuevo token de API o usa uno existente
4. Copia el token y agrégalo a tu archivo `.env.local`

## Cómo obtener tu Group ID (Opcional)

1. En MailerLite, ve a **Subscribers** → **Groups**
2. Selecciona el grupo al que quieres agregar los suscriptores
3. El Group ID está en la URL o en la configuración del grupo
4. Si no especificas un Group ID, los suscriptores se agregarán a la lista principal

## Endpoints de la API

### POST `/api/subscribe`

Suscribe un usuario a la lista de MailerLite.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Nombre del Usuario" // Opcional
}
```

**Respuesta exitosa:**
```json
{
  "message": "Suscripción exitosa",
  "data": { ... }
}
```

### POST/GET `/api/send-test-email`

Envía un email de prueba a todos los suscriptores. Útil para verificar que la configuración de MailerLite está funcionando correctamente.

**Body (opcional para POST):**
```json
{
  "subject": "Asunto personalizado",
  "message": "<p>Mensaje personalizado en HTML</p>"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Email de prueba enviado exitosamente",
  "campaignId": "123456789"
}
```

**Ejemplo de uso:**
```bash
# Enviar email de prueba con valores por defecto
curl http://localhost:3000/api/send-test-email

# Enviar email de prueba personalizado
curl -X POST http://localhost:3000/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"subject": "Mi asunto", "message": "<p>Mi mensaje</p>"}'
```

## Componentes

### SubscribeForm

Componente reutilizable para formularios de suscripción.

**Props:**
- `variant`: "default" | "inline" | "compact" (default: "default")
- `className`: Clases CSS adicionales

**Ejemplo de uso:**
```tsx
import { SubscribeForm } from "@/components/subscribe-form";

<SubscribeForm variant="default" />
```

## Ubicaciones del Formulario

El formulario de suscripción está integrado en:
- Página del blog (`/blog`) - CTA al final
- Sidebar de contenido (página principal)
- Componente reutilizable para usar en cualquier lugar

## Cómo hacer que los emails lleguen a la Bandeja Principal (no Promociones)

El código está configurado para maximizar las posibilidades de que los emails lleguen a la bandeja principal en lugar de la carpeta de Promociones. Los cambios implementados incluyen:

### Cambios implementados:

1. **Remitente personal**: Usa el nombre del autor (ej: "Brian") en lugar de "brian-blog"
2. **Asunto sin emojis**: Los asuntos no incluyen emojis ni palabras de marketing
3. **Contenido personal**: El email está escrito como una comunicación personal, no como newsletter
4. **Sin botones grandes**: Los enlaces son texto subrayado, no botones grandes de marketing

### Recomendaciones adicionales:

1. **Configurar dominio personalizado** (Recomendado):
   - Ve a MailerLite → Settings → Domains
   - Configura un dominio personalizado (ej: `newsletter.tudominio.com`)
   - Esto mejora significativamente la entrega y reduce la probabilidad de ir a Promociones

2. **Pedir a los suscriptores que marquen como importante**:
   - En el primer email, pide a los suscriptores que marquen tu email como importante
   - En Gmail: Arrastra el email a la pestaña "Principal" o marca como importante

3. **Evitar palabras clave de marketing**:
   - Evita palabras como: "oferta", "descuento", "promoción", "newsletter", "suscripción"
   - Usa lenguaje más conversacional y personal

4. **Frecuencia de envío**:
   - No envíes demasiados emails (máximo 1-2 por semana)
   - Gmail penaliza a los remitentes que envían demasiado frecuentemente

### Nota importante:

Aunque estos cambios ayudan, Gmail y otros proveedores de email usan algoritmos complejos para clasificar emails. La mejor solución a largo plazo es:
- Configurar un dominio personalizado
- Construir una buena reputación de envío
- Que los usuarios marquen tus emails como importantes

