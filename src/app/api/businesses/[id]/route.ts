// API: Negocio individual
// GET - Obtener un negocio por ID
// PUT - Actualizar un negocio (solo admin)
// DELETE - Eliminar un negocio (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businessUpdateSchema } from '@/lib/validations';
import { requireAuth, sanitizeString } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const business = await db.business.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Negocio no encontrado' },
        { status: 404 }
      );
    }

    // Non-admin users can only see APPROVED businesses
    const auth = await requireAuth();
    if (!auth.authorized && business.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Negocio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener negocio' },
      { status: 500 }
    );
  }
}

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
    const parsed = businessUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Datos inválidos: ${errors}` },
        { status: 400 }
      );
    }

    // Check if business exists
    const existing = await db.business.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Negocio no encontrado' },
        { status: 404 }
      );
    }

    // Sanitize string fields
    const data = parsed.data;
    const sanitizedData: Record<string, unknown> = {};
    
    if (data.name !== undefined) sanitizedData.name = sanitizeString(data.name);
    if (data.description !== undefined) sanitizedData.description = sanitizeString(data.description);
    if (data.address !== undefined) sanitizedData.address = sanitizeString(data.address);
    if (data.city !== undefined) sanitizedData.city = data.city ? sanitizeString(data.city) : null;
    if (data.phone !== undefined) sanitizedData.phone = sanitizeString(data.phone);
    if (data.whatsapp !== undefined) sanitizedData.whatsapp = data.whatsapp ? sanitizeString(data.whatsapp) : null;
    if (data.instagram !== undefined) sanitizedData.instagram = data.instagram ? sanitizeString(data.instagram) : null;
    if (data.categoryId !== undefined) sanitizedData.categoryId = data.categoryId;
    if (data.logo !== undefined) sanitizedData.logo = data.logo || null;
    if (data.facebook !== undefined) sanitizedData.facebook = data.facebook || null;
    if (data.website !== undefined) sanitizedData.website = data.website || null;
    if (data.latitude !== undefined) sanitizedData.latitude = data.latitude ?? null;
    if (data.longitude !== undefined) sanitizedData.longitude = data.longitude ?? null;
    if (data.status !== undefined) sanitizedData.status = data.status;
    if (data.featured !== undefined) sanitizedData.featured = data.featured;

    const business = await db.business.update({
      where: { id },
      data: sanitizedData,
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar negocio' },
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

    const existing = await db.business.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Negocio no encontrado' },
        { status: 404 }
      );
    }

    await db.business.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar negocio' },
      { status: 500 }
    );
  }
}
