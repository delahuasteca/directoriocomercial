// BusinessCard - Tarjeta profesional para cada negocio
// Diseño limpio con colores esmeralda y hover effects

'use client';

import { 
  MapPin, Phone, ExternalLink, Star, 
  MessageCircle, Facebook, Instagram, Globe 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Business } from '@/types';

interface BusinessCardProps {
  business: Business;
  onClick: (id: string) => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  const categoryColor = business.category?.color || '#059669';

  return (
    <Card
      className="group cursor-pointer border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden"
      onClick={() => onClick(business.id)}
    >
      {/* Top color bar */}
      <div 
        className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: categoryColor }}
      />
      
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo/Avatar */}
          <div 
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
            style={{ backgroundColor: categoryColor }}
          >
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              business.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {business.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs"
                  style={{ 
                    backgroundColor: `${categoryColor}15`, 
                    color: categoryColor,
                    borderColor: `${categoryColor}30`,
                  }}
                >
                  {business.category?.name}
                </Badge>
              </div>
              {business.featured && (
                <div className="flex-shrink-0">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {business.description}
            </p>

            {/* Info row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {business.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-500" />
                  {business.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-emerald-500" />
                {business.phone}
              </span>
            </div>

            {/* Social links */}
            {(business.whatsapp || business.facebook || business.instagram || business.website) && (
              <div className="mt-3 flex items-center gap-2">
                {business.whatsapp && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                )}
                {business.facebook && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Facebook className="h-3.5 w-3.5" />
                  </span>
                )}
                {business.instagram && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                    <Instagram className="h-3.5 w-3.5" />
                  </span>
                )}
                {business.website && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                  </span>
                )}
                <ExternalLink className="h-3.5 w-3.5 ml-auto text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
