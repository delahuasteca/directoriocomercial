// API: Mensajes de Contacto
// GET - Listar mensajes (solo admin)
// POST - Enviar mensaje de contacto (público)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, sanitizeString } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, string> = {};
    if (status) where.status = status;

    const messages = await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, business, subject, message, plan } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos (nombre, email, asunto, mensaje)' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const contactMessage = await db.contactMessage.create({
      data: {
        name: sanitizeString(name).slice(0, 200),
        email: sanitizeString(email).slice(0, 200),
        phone: phone ? sanitizeString(phone).slice(0, 30) : null,
        business: business ? sanitizeString(business).slice(0, 200) : null,
        subject: sanitizeString(subject).slice(0, 300),
        message: sanitizeString(message).slice(0, 2000),
        plan: plan ? sanitizeString(plan).slice(0, 100) : null,
      },
    });

    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
