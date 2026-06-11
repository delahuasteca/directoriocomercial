// AdminLogin - Formulario de login para administradores
// Diseño seguro y profesional

'use client';

import { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';

interface AdminLoginProps {
  open: boolean;
  onClose: () => void;
}

export function AdminLogin({ open, onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAdmin, setIsAdminAuthenticated, setIsAdminModalOpen } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      setAdmin(data.data);
      setIsAdminAuthenticated(true);
      setIsAdminModalOpen(false);
      setEmail('');
      setPassword('');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">Iniciar Sesión - Administrador</DialogTitle>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200/50">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900">Panel de Administración</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-emerald-900 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@huastecadigital.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-emerald-900 mb-1.5 block">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Acceso exclusivo para administradores autorizados
        </p>
      </DialogContent>
    </Dialog>
  );
}
