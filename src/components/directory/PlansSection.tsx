// PlansSection - Sección de planes/precios
// Diseño atractivo con 4 planes: Gratuito, Landing Page, Chatbot, Menú Digital

'use client';

import { useState, useEffect } from 'react';
import { Check, Star, Package, Layout, Bot, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Plan {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: number;
  description: string;
  features: string;
  icon: string | null;
  color: string | null;
  popular: boolean;
  order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Package, Layout, Bot, UtensilsCrossed,
};

interface PlansSectionProps {
  onSelectPlan?: (planSlug: string) => void;
}

export function PlansSection({ onSelectPlan }: PlansSectionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlans(data.data);
      })
      .catch(() => {});
  }, []);

  if (plans.length === 0) return null;

  return (
    <section className="py-16 bg-emerald-gradient relative overflow-hidden" id="planes">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-emerald-400/20 text-emerald-100 border-emerald-400/30 mb-4">
            Planes para tu Negocio
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Haz Crecer tu Negocio en la Huasteca
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu negocio. 
            Desde presencia básica hasta atención automática con IA.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const IconComponent = iconMap[plan.icon || ''] || Package;
            const features = plan.features.split('|');
            const isPopular = plan.popular;
            const planColor = plan.color || '#059669';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isPopular
                    ? 'bg-white shadow-2xl shadow-emerald-900/30 ring-2 ring-emerald-300'
                    : 'bg-white/95 backdrop-blur-sm shadow-xl'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white border-0 shadow-lg px-3 py-1">
                      <Star className="h-3 w-3 mr-1 fill-white" /> Más Popular
                    </Badge>
                  </div>
                )}

                {/* Plan icon & name */}
                <div className="text-center mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"
                    style={{ backgroundColor: `${planColor}15` }}
                  >
                    <IconComponent className="h-7 w-7" style={{ color: planColor }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  {plan.price === 0 ? (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">Gratis</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm text-gray-500">Desde</span>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-gray-500">$</span>
                        <span className="text-4xl font-bold" style={{ color: planColor }}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-gray-500">MXN/mes</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center mb-5 leading-relaxed">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check
                        className="h-4 w-4 mt-0.5 flex-shrink-0"
                        style={{ color: planColor }}
                      />
                      <span className="text-sm text-gray-700">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <Button
                  onClick={() => onSelectPlan?.(plan.slug)}
                  className={`w-full gap-2 font-semibold ${
                    isPopular
                      ? 'text-white shadow-lg'
                      : 'border-2'
                  }`}
                  style={isPopular 
                    ? { backgroundColor: planColor, boxShadow: `0 4px 14px ${planColor}40` } 
                    : { borderColor: planColor, color: planColor }
                  }
                  variant={isPopular ? 'default' : 'outline'}
                >
                  {plan.price === 0 ? 'Registrarse Gratis' : 'Elegir Plan'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center text-emerald-200 text-sm mt-8">
          Todos los planes incluyen soporte técnico. Precios en MXN + IVA. 
          <br className="hidden sm:block" />
          Puedes cambiar o cancelar tu plan en cualquier momento.
        </p>
      </div>
    </section>
  );
}
