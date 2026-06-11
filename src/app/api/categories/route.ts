// API: Categorías del Directorio
// GET - Listar todas las categorías (público)
// POST - Crear nueva categoría (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categorySchema } from '@/lib/validations';
import { requireAuth, sanitizeString } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { businesses: { where: { status: 'APPROVED' } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Datos inválidos: ${errors}` },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if slug already exists
    const existing = await db.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una categoría con ese slug' },
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: {
        name: sanitizeString(data.name),
        slug: data.slug,
        icon: data.icon || null,
        description: data.description ? sanitizeString(data.description) : null,
        color: data.color || null,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
}
