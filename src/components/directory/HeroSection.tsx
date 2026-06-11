// Hero Section - Sección principal del directorio
// Diseño atractivo con gradiente esmeralda

'use client';

import { Search, TrendingUp, Users, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export function HeroSection() {
  const { setSearchQuery, totalBusinesses, categories } = useAppStore();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    setSearchQuery(query || '');
  };

  return (
    <section className="relative overflow-hidden bg-emerald-gradient">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Descubre los Negocios de la
            <span className="block text-emerald-200">Huasteca Hidalguense</span>
          </h2>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Tu directorio digital completo. Encuentra restaurantes, servicios, tiendas y más 
            en toda la región huasteca.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-emerald-400" />
              <input
                name="search"
                type="text"
                placeholder="¿Qué negocio o servicio buscas?"
                className="w-full pl-12 pr-32 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-base text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-xl shadow-emerald-900/20"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-emerald-100">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{totalBusinesses}+</p>
                <p className="text-xs text-emerald-200">Negocios</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{categories.length}</p>
                <p className="text-xs text-emerald-200">Categorías</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">8+</p>
                <p className="text-xs text-emerald-200">Municipios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
