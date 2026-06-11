// API: Chatbot con IA (LLM)
// POST - Enviar mensaje al chatbot y recibir respuesta de IA

import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// System prompt para el chatbot del Directorio Digital
const SYSTEM_PROMPT = `Eres el asistente virtual de "Huasteca Digital", el directorio de negocios y servicios de la Huasteca Hidalguense, México. 

Tu objetivo es ayudar a los usuarios a:
1. Encontrar negocios y servicios en la región (restaurantes, tiendas, profesionales, etc.)
2. Explicar los planes disponibles para registrar su negocio en el directorio
3. Resolver dudas sobre el directorio y sus funcionalidades
4. Orientar sobre cómo contactar o registrarse

Planes disponibles:
- GRATUITO ($0/mes): Listado básico en el directorio con nombre, categoría, teléfono y dirección
- LANDING PAGE ($299/mes): Página web personalizada + listado destacado + enlace a WhatsApp + redes sociales
- CHATBOT ($499/mes): Todo lo anterior + chatbot de IA para atención automática de clientes 24/7
- MENÚ DIGITAL ($399/mes): Menú digital QR para restaurantes + listado en directorio + actualizaciones ilimitadas

Información sobre la Huasteca Hidalguense:
- Región ubicada en el estado de Hidalgo, México
- Ciudades principales: Huejutla de Reyes, Atlapexco, Calnali, Huazalinguillo, Jaltocán
- Cultura rica con tradiciones huastecas, gastronomía única (zacahuil, enchiladas huastecas, bocoles)
- Para contactar al equipo: contacto@huastecadigital.com o WhatsApp 789 123 4567

Responde SIEMPRE en español, de forma amable y profesional. Sé conciso pero útil.
Si no sabes algo específico, sugiere al usuario usar el buscador del directorio o contactar directamente al equipo.`;

// In-memory conversation store (simple approach)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

let zaiInstance: InstanceType<typeof ZAI> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // Limit message length
    const trimmedMessage = message.trim().slice(0, 500);
    const sid = sessionId || 'default';

    // Get or create conversation
    let history = conversations.get(sid);
    if (!history) {
      history = [{ role: 'assistant', content: SYSTEM_PROMPT }];
      conversations.set(sid, history);
    }

    // Add user message
    history.push({ role: 'user', content: trimmedMessage });

    // Keep only last 20 messages for context management
    if (history.length > 20) {
      history = [history[0], ...history.slice(-19)];
      conversations.set(sid, history);
    }

    // Get AI response
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: history as Array<{ role: 'assistant' | 'user'; content: string }>,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices?.[0]?.message?.content || 
      'Lo siento, no pude procesar tu mensaje. Por favor intenta de nuevo.';

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: sid,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar tu mensaje',
        response: 'Lo siento, hubo un error. Por favor intenta de nuevo más tarde.'
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear conversation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (sessionId) {
      conversations.delete(sessionId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
