// API: Categoría individual
// PUT - Actualizar categoría (solo admin)
// DELETE - Eliminar categoría (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categoryUpdateSchema } from '@/lib/validations';
import { requireAuth, sanitizeString } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = categoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Datos inválidos: ${errors}` },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const sanitizedData: Record<string, unknown> = {};

    if (data.name !== undefined) sanitizedData.name = sanitizeString(data.name);
    if (data.slug !== undefined) sanitizedData.slug = data.slug;
    if (data.icon !== undefined) sanitizedData.icon = data.icon || null;
    if (data.description !== undefined) sanitizedData.description = data.description ? sanitizeString(data.description) : null;
    if (data.color !== undefined) sanitizedData.color = data.color || null;
    if (data.order !== undefined) sanitizedData.order = data.order;

    const category = await db.category.update({
      where: { id },
      data: sanitizedData,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar categoría' },
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
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { businesses: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    if (existing._count.businesses > 0) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar una categoría con negocios asociados' },
        { status: 409 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
}
