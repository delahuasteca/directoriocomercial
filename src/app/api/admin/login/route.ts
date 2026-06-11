// API: Login de Administrador
// POST - Autenticar admin y crear sesión

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, generateSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Datos inválidos: ${errors}` },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find admin by email
    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.active) {
      return NextResponse.json(
        { success: false, error: 'Cuenta desactivada' },
        { status: 403 }
      );
    }

    // Create session token
    const token = generateSessionToken();
    const sessionValue = `${admin.id}:${token}`;

    // Set session cookie
    await setSessionCookie(sessionValue);

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
