// CategoryFilter - Filtros por categoría con diseño de pills
// Diseño interactivo con iconos y colores de categoría

'use client';

import { useAppStore } from '@/store/app-store';
import type { Category } from '@/types';
import {
  UtensilsCrossed, ShoppingBasket, Heart, GraduationCap,
  Briefcase, HardHat, Monitor, Scissors, Car, Palmtree,
  Coffee, Music, LayoutGrid
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed, ShoppingBasket, Heart, GraduationCap,
  Briefcase, HardHat, Monitor, Scissors, Car, Palmtree,
  Coffee, Music,
};

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const { selectedCategory, setSelectedCategory } = useAppStore();

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {/* All categories button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Todos
          </button>

          {/* Category pills */}
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon || ''] || Briefcase;
            const isSelected = selectedCategory === cat.slug;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'text-white shadow-lg'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
                style={isSelected ? { backgroundColor: cat.color || '#059669', boxShadow: `0 4px 14px ${cat.color || '#059669'}40` } : {}}
              >
                <IconComponent className="h-4 w-4" />
                {cat.name}
                {cat._count && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {cat._count.businesses}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
