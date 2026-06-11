// API: Planes de Negocio
// GET - Listar planes (público)
// POST - Crear plan (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { businesses: true } },
      },
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener planes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, type, price, description, features, icon, color, popular, order } = body;

    if (!name || !slug || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const plan = await db.plan.create({
      data: {
        name,
        slug,
        type,
        price: price || 0,
        description,
        features: features || '',
        icon: icon || null,
        color: color || null,
        popular: popular || false,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear plan' },
      { status: 500 }
    );
  }
}
