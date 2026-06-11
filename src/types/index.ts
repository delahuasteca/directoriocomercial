// Tipos TypeScript para el Directorio Digital de la Huasteca Hidalguense

export type BusinessStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AdminRole = 'ADMIN' | 'SUPER_ADMIN';
export type ContactStatus = 'NEW' | 'READ' | 'REPLIED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  color: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  logo: string | null;
  description: string;
  address: string;
  city: string | null;
  phone: string;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  status: BusinessStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business: string | null;
  subject: string;
  message: string;
  plan: string | null;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  status?: BusinessStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Estado de la aplicación
export type AppView = 'directory' | 'detail' | 'admin' | 'admin-login';
