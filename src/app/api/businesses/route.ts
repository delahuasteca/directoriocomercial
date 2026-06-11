// API: Negocios del Directorio
// GET - Listar/buscar/filtrar negocios (público: solo APPROVED, admin: todos)
// POST - Crear nuevo negocio (solo admin)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { searchSchema, businessSchema } from '@/lib/validations';
import { requireAuth, sanitizeString } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const parsed = searchSchema.safeParse({
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      featured: searchParams.get('featured') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros de búsqueda inválidos' },
        { status: 400 }
      );
    }

    const { q, category, status, featured, page, limit } = parsed.data;
    
    // Check if admin is authenticated to show all statuses
    const auth = await requireAuth();
    const isAdmin = auth.authorized;

    // Build where clause
    const where: Prisma.BusinessWhereInput = {};

    // Public users only see APPROVED businesses
    if (!isAdmin) {
      where.status = 'APPROVED';
    } else if (status) {
      where.status = status;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (q) {
      const sanitized = sanitizeString(q);
      where.OR = [
        { name: { contains: sanitized } },
        { description: { contains: sanitized } },
        { city: { contains: sanitized } },
        { address: { contains: sanitized } },
      ];
    }

    const [data, total] = await Promise.all([
      db.business.findMany({
        where,
        include: { category: true },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.business.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener negocios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin auth
    const auth = await requireAuth();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = businessSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => {
        const field = i.path.join('.');
        return `${field ? field + ': ' : ''}${i.message}`;
      }).join(', ');
      return NextResponse.json(
        { success: false, error: `Datos inválidos: ${errors}` },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify category exists
    const categoryExists = await db.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'La categoría no existe' },
        { status: 400 }
      );
    }

    // Sanitize string fields
    const business = await db.business.create({
      data: {
        name: sanitizeString(data.name),
        categoryId: data.categoryId,
        logo: data.logo || null,
        description: sanitizeString(data.description),
        address: sanitizeString(data.address),
        city: data.city ? sanitizeString(data.city) : null,
        phone: sanitizeString(data.phone),
        whatsapp: data.whatsapp ? sanitizeString(data.whatsapp) : null,
        facebook: data.facebook || null,
        instagram: data.instagram ? sanitizeString(data.instagram) : null,
        website: data.website || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        status: data.status || 'PENDING',
        featured: data.featured ?? false,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear negocio' },
      { status: 500 }
    );
  }
}
