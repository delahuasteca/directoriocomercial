// Esquemas de validación con Zod para el Directorio Digital
// Protección contra datos inválidos y ataques de inyección

import { z } from 'zod';

// ============================
// Categorías
// ============================
export const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  icon: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  order: z.number().int().min(0).optional(),
});

export const categoryUpdateSchema = categorySchema.partial();

// ============================
// Negocios
// ============================
export const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  logo: z.string().url('URL de logo inválida').optional().nullable().or(z.literal('')),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').max(300),
  city: z.string().max(100).optional().nullable(),
  phone: z.string().min(7, 'Teléfono inválido').max(20),
  whatsapp: z.string().max(100).optional().nullable(),
  facebook: z.string().url('URL de Facebook inválida').optional().nullable().or(z.literal('')),
  instagram: z.string().max(100).optional().nullable(),
  website: z.string().url('URL del sitio web inválida').optional().nullable().or(z.literal('')),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  featured: z.boolean().optional(),
});

export const businessUpdateSchema = businessSchema.partial().extend({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).max(1000).optional(),
  address: z.string().min(5).max(300).optional(),
  phone: z.string().min(7).max(20).optional(),
});

// ============================
// Autenticación Admin
// ============================
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// ============================
// Búsqueda y filtros
// ============================
export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
