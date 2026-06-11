// Header del Directorio Digital de la Huasteca Hidalguense
// Diseño con colores esmeralda y navegación principal

'use client';

import { useState } from 'react';
import { Search, Menu, X, Shield, MapPin, LayoutDashboard, Home, Grid3X3, CreditCard, Mail, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';

const navLinks = [
  { label: 'Inicio', href: '#inicio', icon: Home },
  { label: 'Categorías', href: '#categorias', icon: Grid3X3 },
  { label: 'Planes', href: '#planes', icon: CreditCard },
  { label: 'Contacto', href: '#contacto', icon: Mail },
  { label: 'Registrar Negocio', href: '#contacto', icon: PlusCircle, highlight: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    setCurrentView,
    currentView,
  } = useAppStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by the parent component watching searchQuery
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar with gradient */}
      <div className="bg-emerald-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-200" />
            <span className="text-sm text-emerald-100 hidden sm:inline">
              Huasteca Hidalguense, México
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-200 hidden md:inline">
              Directorio Digital
            </span>
            {isAdminAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-100 hover:text-white hover:bg-emerald-700/50"
                onClick={() => setCurrentView(currentView === 'admin' ? 'directory' : 'admin')}
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                {currentView === 'admin' ? 'Directorio' : 'Panel Admin'}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-100 hover:text-white hover:bg-emerald-700/50"
                onClick={() => setIsAdminModalOpen(true)}
              >
                <Shield className="h-4 w-4 mr-1" />
                Acceso
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <span className="text-white font-bold text-lg md:text-xl">H</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-emerald-900 leading-tight">
                  Huasteca Digital
                </h1>
                <p className="text-xs text-emerald-600 leading-tight">
                  Directorio de Negocios
                </p>
              </div>
            </div>

            {/* Search bar - desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar negocios, servicios, productos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    link.highlight
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{link.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-emerald-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar negocios..."
                    className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-sm text-emerald-900 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Mobile nav links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      link.highlight
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
