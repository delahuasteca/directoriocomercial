// AdminDashboard - Panel de administración completo
// CRUD de negocios, categorías, mensajes de contacto y gestión del directorio

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, LogOut, CheckCircle, XCircle, Clock,
  Search, LayoutDashboard, Building2, Tags, RefreshCw, Star,
  ChevronLeft, ChevronRight, ArrowLeft, Mail, Eye, MessageSquare,
  ArrowRight, Filter, MailOpen, Reply
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/app-store';
import { BusinessForm } from './BusinessForm';
import type { Business, Category, BusinessStatus, ContactMessage, ContactStatus } from '@/types';

export function AdminDashboard() {
  const { admin, logout, setIsAdminAuthenticated, setIsAdminModalOpen, setCurrentView } = useAppStore();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | 'ALL'>('ALL');
  const [contactStatusFilter, setContactStatusFilter] = useState<ContactStatus | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set('q', searchQ);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', '10');
      
      const res = await fetch(`/api/businesses?${params}`);
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQ, statusFilter, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchContactMessages = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (contactStatusFilter !== 'ALL') params.set('status', contactStatusFilter);
      
      const res = await fetch(`/api/contact?${params}`);
      const data = await res.json();
      if (data.success) setContactMessages(data.data);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    }
  }, [contactStatusFilter]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchContactMessages();
  }, [fetchContactMessages]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este negocio?')) return;
    try {
      await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
      fetchBusinesses();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleStatusChange = async (id: string, status: BusinessStatus) => {
    try {
      await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchBusinesses();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleContactStatusChange = async (id: string, status: ContactStatus) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchContactMessages();
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchContactMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    logout();
    setIsAdminAuthenticated(false);
    setIsAdminModalOpen(false);
  };

  const handleCreateBusinessFromMessage = (msg: ContactMessage) => {
    // Pre-fill the BusinessForm with data from the contact message
    setEditingBusiness({
      id: '',
      name: msg.business || msg.name,
      categoryId: '',
      logo: null,
      description: msg.message,
      address: '',
      city: '',
      phone: msg.phone || '',
      whatsapp: msg.phone || '',
      facebook: null,
      instagram: null,
      website: null,
      latitude: null,
      longitude: null,
      status: 'PENDING',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Business);
    setShowForm(true);
    // Mark message as read
    if (msg.status === 'NEW') {
      handleContactStatusChange(msg.id, 'READ');
    }
  };

  const statusBadge = (status: BusinessStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>;
    }
  };

  const contactStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Mail className="h-3 w-3 mr-1" />Nuevo</Badge>;
      case 'READ':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><MailOpen className="h-3 w-3 mr-1" />Leído</Badge>;
      case 'REPLIED':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><Reply className="h-3 w-3 mr-1" />Respondido</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const newMessagesCount = contactMessages.filter(m => m.status === 'NEW').length;

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* Admin Header */}
      <div className="bg-emerald-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-bold">Panel de Administración</h1>
              <p className="text-emerald-200 text-xs">Bienvenido, {admin?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('directory')}
              className="text-emerald-100 hover:text-white hover:bg-emerald-700/50"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Directorio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-emerald-100 hover:text-white hover:bg-emerald-700/50"
            >
              <LogOut className="h-4 w-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
            <Building2 className="h-5 w-5 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{total}</p>
            <p className="text-xs text-gray-500">Total Negocios</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {businesses.filter(b => b.status === 'APPROVED').length}
            </p>
            <p className="text-xs text-gray-500">Aprobados</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm">
            <Clock className="h-5 w-5 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-900">
              {businesses.filter(b => b.status === 'PENDING').length}
            </p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
            <Tags className="h-5 w-5 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{categories.length}</p>
            <p className="text-xs text-gray-500">Categorías</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <Mail className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-900">{newMessagesCount}</p>
            <p className="text-xs text-gray-500">Mensajes Nuevos</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="businesses">
          <TabsList className="bg-white border border-emerald-100">
            <TabsTrigger value="businesses" className="gap-1">
              <Building2 className="h-4 w-4" /> Negocios
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1 relative">
              <Mail className="h-4 w-4" /> Mensajes
              {newMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {newMessagesCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-1">
              <Tags className="h-4 w-4" /> Categorías
            </TabsTrigger>
          </TabsList>

          <TabsContent value="businesses" className="mt-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <Input
                  value={searchQ}
                  onChange={(e) => { setSearchQ(e.target.value); setPage(1); }}
                  placeholder="Buscar negocios..."
                  className="pl-10 border-emerald-200"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as BusinessStatus | 'ALL'); setPage(1); }}
                  className="px-3 py-2 border border-emerald-200 rounded-xl text-sm bg-white"
                >
                  <option value="ALL">Todos</option>
                  <option value="APPROVED">Aprobados</option>
                  <option value="PENDING">Pendientes</option>
                  <option value="REJECTED">Rechazados</option>
                </select>
                <Button
                  onClick={() => fetchBusinesses()}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => { setEditingBusiness(null); setShowForm(true); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <Plus className="h-4 w-4" /> Nuevo
                </Button>
              </div>
            </div>

            {/* Business list */}
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center text-emerald-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Cargando...
                </div>
              ) : businesses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron negocios
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-emerald-50/50 border-b border-emerald-100">
                        <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3">Negocio</th>
                        <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden md:table-cell">Categoría</th>
                        <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden sm:table-cell">Estado</th>
                        <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden lg:table-cell">Destacado</th>
                        <th className="text-right text-xs font-semibold text-emerald-900 px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((b) => (
                        <tr key={b.id} className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: b.category?.color || '#059669' }}
                              >
                                {b.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-emerald-900 line-clamp-1">{b.name}</p>
                                <p className="text-xs text-gray-500">{b.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-600">{b.category?.name}</span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {statusBadge(b.status)}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {b.featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {b.status === 'PENDING' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(b.id, 'APPROVED')}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                                  title="Aprobar"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {b.status === 'APPROVED' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(b.id, 'REJECTED')}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                  title="Rechazar"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditingBusiness(b); setShowForm(true); }}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8 p-0"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(b.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="border-emerald-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-emerald-700">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="border-emerald-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1" />
              <div className="flex gap-2">
                <select
                  value={contactStatusFilter}
                  onChange={(e) => setContactStatusFilter(e.target.value as ContactStatus | 'ALL')}
                  className="px-3 py-2 border border-emerald-200 rounded-xl text-sm bg-white"
                >
                  <option value="ALL">Todos</option>
                  <option value="NEW">Nuevos</option>
                  <option value="READ">Leídos</option>
                  <option value="REPLIED">Respondidos</option>
                </select>
                <Button
                  onClick={() => fetchContactMessages()}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Message list */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-emerald-100 overflow-hidden">
                <div className="p-3 bg-emerald-50/50 border-b border-emerald-100">
                  <h3 className="font-semibold text-sm text-emerald-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mensajes ({contactMessages.length})
                  </h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {contactMessages.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      <Mail className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      No hay mensajes
                    </div>
                  ) : (
                    contactMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (msg.status === 'NEW') {
                            handleContactStatusChange(msg.id, 'READ');
                          }
                        }}
                        className={`w-full text-left p-3 border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors ${
                          selectedMessage?.id === msg.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                        } ${msg.status === 'NEW' ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm truncate ${msg.status === 'NEW' ? 'font-bold text-emerald-900' : 'font-medium text-gray-800'}`}>
                              {msg.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                            {msg.business && (
                              <p className="text-xs text-emerald-600 truncate mt-0.5">
                                🏪 {msg.business}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {contactStatusBadge(msg.status)}
                            <span className="text-[10px] text-gray-400">
                              {new Date(msg.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Message detail */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-emerald-100 overflow-hidden">
                {selectedMessage ? (
                  <div>
                    <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-emerald-900">{selectedMessage.subject}</h3>
                        <p className="text-xs text-gray-500">{formatDate(selectedMessage.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {contactStatusBadge(selectedMessage.status)}
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Sender info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-emerald-700">
                              {selectedMessage.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-emerald-900">{selectedMessage.name}</p>
                            <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                          </div>
                        </div>
                        {selectedMessage.phone && (
                          <div className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-emerald-900">{selectedMessage.phone}</p>
                              <p className="text-xs text-gray-500">Teléfono</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedMessage.business && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                          <Building2 className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-amber-900">Negocio: {selectedMessage.business}</p>
                            {selectedMessage.plan && (
                              <p className="text-xs text-amber-600">Plan de interés: {selectedMessage.plan}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message content */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {selectedMessage.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          onClick={() => handleCreateBusinessFromMessage(selectedMessage)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Crear Negocio desde Mensaje
                        </Button>
                        {selectedMessage.phone && (
                          <a
                            href={`https://wa.me/${selectedMessage.phone.replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              className="border-green-200 text-green-700 hover:bg-green-50 gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              WhatsApp
                            </Button>
                          </a>
                        )}
                        <a href={`mailto:${selectedMessage.email}`}>
                          <Button
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Responder por Email
                          </Button>
                        </a>
                        {selectedMessage.status !== 'REPLIED' && (
                          <Button
                            variant="outline"
                            onClick={() => handleContactStatusChange(selectedMessage.id, 'REPLIED')}
                            className="border-green-200 text-green-700 hover:bg-green-50 gap-2"
                          >
                            <Reply className="h-4 w-4" />
                            Marcar Respondido
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium text-gray-400">Selecciona un mensaje</p>
                    <p className="text-sm text-gray-400">Haz clic en un mensaje de la lista para ver los detalles</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-50/50 border-b border-emerald-100">
                      <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3">Categoría</th>
                      <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden sm:table-cell">Slug</th>
                      <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden md:table-cell">Negocios</th>
                      <th className="text-left text-xs font-semibold text-emerald-900 px-4 py-3 hidden lg:table-cell">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-emerald-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#059669' }} />
                            </div>
                            <span className="font-medium text-sm text-emerald-900">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-500">{cat.slug}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {cat._count?.businesses || 0}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color || '#059669' }} />
                            <span className="text-xs text-gray-500">{cat.color}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Business Form Modal */}
      <BusinessForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingBusiness(null); }}
        business={editingBusiness}
        categories={categories}
        onSaved={() => {
          fetchBusinesses();
          fetchContactMessages();
        }}
      />
    </div>
  );
}
