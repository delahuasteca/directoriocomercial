// ContactForm - Formulario de contacto para el directorio
// Con opciones de plan de interés y validación

'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactFormProps {
  selectedPlan?: string;
}

export function ContactForm({ selectedPlan }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    subject: '',
    message: '',
    plan: selectedPlan || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update plan field when selectedPlan prop changes
  useEffect(() => {
    if (selectedPlan) {
      setForm(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al enviar');
        return;
      }

      setIsSuccess(true);
      setForm({ name: '', email: '', phone: '', business: '', subject: '', message: '', plan: '' });
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">¡Mensaje Enviado!</h3>
        <p className="text-gray-600 mb-4">
          Gracias por contactarnos. Te responderemos lo antes posible.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="border-emerald-200 text-emerald-700"
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            ¿Quieres registrar tu negocio o tienes alguna pregunta? 
            Escríbenos y te ayudamos a crecer en la Huasteca.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-6">
              Información de Contacto
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900">Teléfono</h4>
                  <p className="text-gray-600">789 123 4567</p>
                  <p className="text-sm text-gray-400">Lunes a Viernes, 9:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900">Email</h4>
                  <p className="text-gray-600">contacto@huastecadigital.com</p>
                  <p className="text-sm text-gray-400">Respondemos en menos de 24 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900">WhatsApp</h4>
                  <a
                    href="https://wa.me/527891234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    789 123 4567
                  </a>
                  <p className="text-sm text-gray-400">Respuesta inmediata</p>
                </div>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <div className="mt-8">
              <a
                href="https://wa.me/527891234567?text=Hola%2C%20me%20interesa%20registrar%20mi%20negocio%20en%20Huasteca%20Digital"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-200">
                  <MessageSquare className="h-4 w-4" />
                  Escríbenos por WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-emerald-50/50 rounded-2xl p-6 md:p-8 border border-emerald-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-emerald-900">Nombre *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    className="border-emerald-200 focus:ring-emerald-500 bg-white"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Label className="text-emerald-900">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    className="border-emerald-200 focus:ring-emerald-500 bg-white"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-emerald-900">Teléfono</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-500 bg-white"
                    placeholder="789 123 4567"
                  />
                </div>
                <div>
                  <Label className="text-emerald-900">Negocio</Label>
                  <Input
                    value={form.business}
                    onChange={(e) => updateField('business', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-500 bg-white"
                    placeholder="Nombre de tu negocio"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-emerald-900">Asunto *</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    required
                    className="border-emerald-200 focus:ring-emerald-500 bg-white"
                    placeholder="¿En qué te podemos ayudar?"
                  />
                </div>
                <div>
                  <Label className="text-emerald-900">Plan de interés</Label>
                  <Select value={form.plan} onValueChange={(v) => updateField('plan', v)}>
                    <SelectTrigger className="border-emerald-200 bg-white">
                      <SelectValue placeholder="Seleccionar plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gratuito">Gratuito</SelectItem>
                      <SelectItem value="landing-page">Landing Page - $299/mes</SelectItem>
                      <SelectItem value="chatbot">Chatbot IA - $499/mes</SelectItem>
                      <SelectItem value="menu-digital">Menú Digital - $399/mes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-emerald-900">Mensaje *</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  required
                  rows={4}
                  className="border-emerald-200 focus:ring-emerald-500 bg-white"
                  placeholder="Cuéntanos más sobre lo que necesitas..."
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
