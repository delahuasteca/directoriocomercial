// Store principal del Directorio Digital de la Huasteca Hidalguense
// Gestión de estado con Zustand

import { create } from 'zustand';
import type { AppView, Business, Category, Admin } from '@/types';

interface AppState {
  // Navigation
  currentView: AppView;
  selectedBusinessId: string | null;
  
  // Data
  businesses: Business[];
  categories: Category[];
  totalBusinesses: number;
  currentPage: number;
  totalPages: number;
  
  // Search & Filters
  searchQuery: string;
  selectedCategory: string | null;
  
  // Admin
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  
  // UI State
  isLoading: boolean;
  isDetailOpen: boolean;
  isAdminModalOpen: boolean;
  
  // Actions
  setCurrentView: (view: AppView) => void;
  setSelectedBusinessId: (id: string | null) => void;
  setBusinesses: (businesses: Business[]) => void;
  setCategories: (categories: Category[]) => void;
  setTotalBusinesses: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setAdmin: (admin: Admin | null) => void;
  setIsAdminAuthenticated: (value: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsDetailOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  
  // Complex actions
  openDetail: (businessId: string) => void;
  closeDetail: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentView: 'directory',
  selectedBusinessId: null,
  businesses: [],
  categories: [],
  totalBusinesses: 0,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  selectedCategory: null,
  admin: null,
  isAdminAuthenticated: false,
  isLoading: false,
  isDetailOpen: false,
  isAdminModalOpen: false,
  
  // Simple setters
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedBusinessId: (id) => set({ selectedBusinessId: id }),
  setBusinesses: (businesses) => set({ businesses }),
  setCategories: (categories) => set({ categories }),
  setTotalBusinesses: (total) => set({ totalBusinesses: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setAdmin: (admin) => set({ admin }),
  setIsAdminAuthenticated: (value) => set({ isAdminAuthenticated: value }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsDetailOpen: (open) => set({ isDetailOpen: open }),
  setIsAdminModalOpen: (open) => set({ isAdminModalOpen: open }),
  
  // Complex actions
  openDetail: (businessId) => set({
    selectedBusinessId: businessId,
    isDetailOpen: true,
    currentView: 'detail',
  }),
  closeDetail: () => set({
    selectedBusinessId: null,
    isDetailOpen: false,
    currentView: 'directory',
  }),
  logout: () => set({
    admin: null,
    isAdminAuthenticated: false,
    currentView: 'directory',
    isAdminModalOpen: false,
  }),
}));
