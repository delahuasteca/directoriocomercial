// BusinessForm - Formulario para crear/editar negocios
// Con validación y diseño profesional

'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store/app-store';
import type { Business, Category, BusinessStatus } from '@/types';

interface BusinessFormProps {
  open: boolean;
  onClose: () => void;
  business?: Business | null;
  categories: Category[];
  onSaved: () => void;
}

const emptyForm = {
  name: '',
  categoryId: '',
  logo: '',
  description: '',
  address: '',
  city: '',
  phone: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  website: '',
  latitude: '',
  longitude: '',
  status: 'PENDING' as BusinessStatus,
  featured: false,
};

export function BusinessForm({ open, onClose, business, categories, onSaved }: BusinessFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || '',
        categoryId: business.categoryId || '',
        logo: business.logo || '',
        description: business.description || '',
        address: business.address || '',
        city: business.city || '',
        phone: business.phone || '',
        whatsapp: business.whatsapp || '',
        facebook: business.facebook || '',
        instagram: business.instagram || '',
        website: business.website || '',
        latitude: business.latitude?.toString() || '',
        longitude: business.longitude?.toString() || '',
        status: business.status || 'PENDING',
        featured: business.featured || false,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [business, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        logo: form.logo || undefined,
        facebook: form.facebook || undefined,
        website: form.website || undefined,
        whatsapp: form.whatsapp || undefined,
        instagram: form.instagram || undefined,
        city: form.city || undefined,
      };

      const isEditing = !!business?.id;
      const url = isEditing ? `/api/businesses/${business.id}` : '/api/businesses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al guardar');
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogTitle className="text-lg font-bold text-emerald-900">
          {business?.id ? 'Editar Negocio' : 'Nuevo Negocio'}
        </DialogTitle>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-emerald-900">Nombre del Negocio *</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="border-emerald-200 focus:ring-emerald-500"
                placeholder="Ej: Restaurante La Huasteca"
              />
            </div>
            <div>
              <Label className="text-emerald-900">Categoría *</Label>
              <Select value={form.categoryId} onValueChange={(v) => updateField('categoryId', v)}>
                <SelectTrigger className="border-emerald-200">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-emerald-900">Descripción *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              minLength={10}
              className="border-emerald-200 focus:ring-emerald-500"
              placeholder="Describe el negocio o servicio..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-emerald-900">Dirección *</Label>
              <Input
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                required
                className="border-emerald-200"
                placeholder="Calle, número y colonia"
              />
            </div>
            <div>
              <Label className="text-emerald-900">Ciudad</Label>
              <Input
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="border-emerald-200"
                placeholder="Ej: Huejutla de Reyes"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-emerald-900">Teléfono *</Label>
              <Input
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
                className="border-emerald-200"
                placeholder="789 123 4567"
              />
            </div>
            <div>
              <Label className="text-emerald-900">WhatsApp</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className="border-emerald-200"
                placeholder="527891234567"
              />
            </div>
          </div>

          {/* Social & Web */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-emerald-900">Facebook URL</Label>
              <Input
                value={form.facebook}
                onChange={(e) => updateField('facebook', e.target.value)}
                className="border-emerald-200"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label className="text-emerald-900">Instagram</Label>
              <Input
                value={form.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
                className="border-emerald-200"
                placeholder="@usuario"
              />
            </div>
            <div>
              <Label className="text-emerald-900">Sitio Web</Label>
              <Input
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="border-emerald-200"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-emerald-900">Latitud</Label>
              <Input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => updateField('latitude', e.target.value)}
                className="border-emerald-200"
                placeholder="21.1425"
              />
            </div>
            <div>
              <Label className="text-emerald-900">Longitud</Label>
              <Input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => updateField('longitude', e.target.value)}
                className="border-emerald-200"
                placeholder="-98.4183"
              />
            </div>
          </div>

          {/* Status & Featured */}
          <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50/50 rounded-xl">
            <div className="flex-1">
              <Label className="text-emerald-900">Estado</Label>
              <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger className="border-emerald-200 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="REJECTED">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-emerald-900">Destacado</Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => updateField('featured', v)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-emerald-200">
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
