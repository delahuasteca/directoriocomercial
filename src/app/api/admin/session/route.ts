// API: Verificar sesión de administrador
// GET - Obtener información de la sesión actual

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { id: auth.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });

    if (!admin || !admin.active) {
      return NextResponse.json(
        { success: false, error: 'Sesión inválida' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { success: false, error: 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}
