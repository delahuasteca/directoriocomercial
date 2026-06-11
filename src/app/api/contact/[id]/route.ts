// API: Mensaje de Contacto individual
// PUT - Actualizar estado del mensaje (solo admin)
// DELETE - Eliminar mensaje (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['NEW', 'READ', 'REPLIED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Estado inválido. Use: NEW, READ, REPLIED' },
        { status: 400 }
      );
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar mensaje' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    await db.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar mensaje' },
      { status: 500 }
    );
  }
}
