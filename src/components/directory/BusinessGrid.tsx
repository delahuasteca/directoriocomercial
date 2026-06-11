// BusinessGrid - Grid de tarjetas de negocios
// Muestra las tarjetas en un grid responsivo con estados de carga

'use client';

import { BusinessCard } from './BusinessCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Business } from '@/types';
import { Search } from 'lucide-react';

interface BusinessGridProps {
  businesses: Business[];
  isLoading: boolean;
  onBusinessClick: (id: string) => void;
  searchQuery?: string;
}

export function BusinessGrid({ businesses, isLoading, onBusinessClick, searchQuery }: BusinessGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-emerald-100 rounded-xl p-5">
            <div className="h-1.5 bg-emerald-100 rounded-t-xl -mt-5 -mx-5 mb-4" />
            <div className="flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-emerald-300" />
        </div>
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {searchQuery 
            ? `No hay negocios que coincidan con "${searchQuery}". Intenta con otra búsqueda.`
            : 'No hay negocios disponibles en esta categoría por el momento.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          onClick={onBusinessClick}
        />
      ))}
    </div>
  );
}
