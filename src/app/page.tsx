// Directorio Digital de la Huasteca Hidalguense
// Página principal - SPA con todas las vistas

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/directory/HeroSection';
import { CategoryFilter } from '@/components/directory/CategoryFilter';
import { BusinessGrid } from '@/components/directory/BusinessGrid';
import { BusinessDetail } from '@/components/directory/BusinessDetail';
import { PlansSection } from '@/components/directory/PlansSection';
import { ContactForm } from '@/components/directory/ContactForm';
import { ChatWidget } from '@/components/directory/ChatWidget';
import { WhatsAppButton } from '@/components/directory/WhatsAppButton';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { Business, Category } from '@/types';

// Category type with count from API
interface CategoryWithCount extends Category {
  _count?: { businesses: number };
}

export default function HomePage() {
  const {
    currentView,
    businesses,
    categories,
    searchQuery,
    selectedCategory,
    isLoading,
    isAdminAuthenticated,
    isAdminModalOpen,
    totalBusinesses,
    currentPage,
    totalPages,
    setBusinesses,
    setCategories,
    setTotalBusinesses,
    setCurrentPage,
    setTotalPages,
    setIsLoading,
    setIsAdminModalOpen,
    setCurrentView,
  } = useAppStore();

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Track first render to skip search effect on mount
  const isFirstRender = useRef(true);

  // Fetch categories - stable callback
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        setTotalBusinesses(
          data.data.reduce((sum: number, cat: CategoryWithCount) => sum + (cat._count?.businesses || 0), 0)
        );
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [setCategories, setTotalBusinesses]);

  // Fetch businesses - stable callback
  const loadBusinesses = useCallback(async (page: number, query: string, category: string | null) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await fetch(`/api/businesses?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setBusinesses(data.data);
        setTotalPages(data.totalPages);
        setTotalBusinesses(data.total);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setBusinesses, setTotalPages, setTotalBusinesses, setIsLoading]);

  // Fetch business detail
  const fetchBusinessDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/businesses/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBusiness(data.data);
        setIsDetailOpen(true);
      }
    } catch (err) {
      console.error('Error fetching business detail:', err);
    }
  }, []);

  // Initial load - runs once on mount
  useEffect(() => {
    fetchCategories();
    loadBusinesses(1, '', null);
    
    fetch('/api/admin/session')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          useAppStore.getState().setAdmin(data.data);
          useAppStore.getState().setIsAdminAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  // React to search/filter changes with debounce (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      loadBusinesses(1, searchQuery, selectedCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, loadBusinesses]);

  // React to page changes
  useEffect(() => {
    if (currentPage > 1) {
      loadBusinesses(currentPage, searchQuery, selectedCategory);
    }
  }, [currentPage, loadBusinesses, searchQuery, selectedCategory]);

  const handleBusinessClick = (id: string) => {
    fetchBusinessDetail(id);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedBusiness(null);
  };

  const handleSelectPlan = (planSlug: string) => {
    setSelectedPlan(planSlug);
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Admin dashboard view
  if (currentView === 'admin' && isAdminAuthenticated) {
    return <AdminDashboard />;
  }

  // Main directory view
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div id="inicio">
          <HeroSection />
        </div>

        {/* Category Filter */}
        <div id="categorias">
          <CategoryFilter categories={categories as CategoryWithCount[]} />
        </div>

        {/* Business Grid */}
        <section className="py-6 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-emerald-900">
                {searchQuery || selectedCategory ? 'Resultados' : 'Negocios Destacados'}
              </h2>
              <span className="text-sm text-gray-500">
                {totalBusinesses} {totalBusinesses === 1 ? 'negocio' : 'negocios'}
              </span>
            </div>

            <BusinessGrid
              businesses={businesses}
              isLoading={isLoading}
              onBusinessClick={handleBusinessClick}
              searchQuery={searchQuery}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 border border-emerald-200 rounded-xl text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-emerald-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 border border-emerald-200 rounded-xl text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Plans Section */}
        <PlansSection onSelectPlan={handleSelectPlan} />

        {/* Contact Form */}
        <ContactForm selectedPlan={selectedPlan || undefined} />
      </main>

      <Footer />

      {/* Business Detail Modal - key resets state when switching businesses */}
      <BusinessDetail
        key={selectedBusiness?.id ?? 'none'}
        business={selectedBusiness}
        open={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        open={isAdminModalOpen && !isAdminAuthenticated}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Floating Widgets */}
      <ChatWidget />
      <WhatsAppButton />
    </div>
  );
}
