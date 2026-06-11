// BusinessDetail - Vista detalle de un negocio (modal)
// Diseño profesional con toda la información del negocio + mapa de ubicación

'use client';

import { useState } from 'react';
import {
  X, MapPin, Phone, MessageCircle, Facebook, Instagram,
  Globe, Star, Clock, Share2, Navigation, ExternalLink, Expand
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Business } from '@/types';

interface BusinessDetailProps {
  business: Business | null;
  open: boolean;
  onClose: () => void;
}

export function BusinessDetail({ business, open, onClose }: BusinessDetailProps) {
  const [mapExpanded, setMapExpanded] = useState(false);

  if (!business) return null;

  const categoryColor = business.category?.color || '#059669';
  const hasCoordinates = business.latitude !== null && business.longitude !== null;

  const whatsappLink = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  // Google Maps directions link
  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address + (business.city ? ', ' + business.city + ', Hidalgo, México' : ', Hidalgo, México'))}`;

  // OpenStreetMap embed URL
  const osmEmbedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${business.longitude! - 0.008}%2C${business.latitude! - 0.006}%2C${business.longitude! + 0.008}%2C${business.latitude! + 0.006}&layer=mapnik&marker=${business.latitude}%2C${business.longitude}`
    : null;

  // Google Maps search by address (fallback for no coordinates)
  const addressSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(business.address + (business.city ? ', ' + business.city + ', Hidalgo, México' : ', Hidalgo, México'))}`;

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 custom-scrollbar">
        <DialogTitle className="sr-only">{business.name}</DialogTitle>
        
        {/* Header with gradient */}
        <div className="relative" style={{ backgroundColor: categoryColor }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="relative p-6 pb-8">
            <div className="flex items-end gap-4">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl font-bold border-4 border-white"
                style={{ color: categoryColor }}>
                {business.logo ? (
                  <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  business.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  {business.featured && (
                    <Badge className="bg-amber-500 text-white text-xs border-0">
                      <Star className="h-3 w-3 mr-1 fill-white" /> Destacado
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white truncate">{business.name}</h2>
                <Badge
                  className="mt-1 text-xs bg-white/20 text-white border-0"
                >
                  {business.category?.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-700 leading-relaxed">{business.description}</p>
          </div>

          <Separator className="bg-emerald-100" />

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Contacto y Ubicación
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Address */}
              <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                <MapPin className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">{business.address}</p>
                  {business.city && <p className="text-xs text-emerald-600">{business.city}, Hidalgo</p>}
                </div>
              </div>

              {/* Phone */}
              <a
                href={`tel:${business.phone}`}
                className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-100/50 transition-colors"
              >
                <Phone className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">{business.phone}</p>
                  <p className="text-xs text-emerald-600">Llamar ahora</p>
                </div>
              </a>
            </div>
          </div>

          {/* ===== MAPA DE UBICACIÓN ===== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación en el Mapa
              </h3>
              {hasCoordinates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMapExpanded(!mapExpanded)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 h-7 text-xs"
                >
                  <Expand className="h-3 w-3" />
                  {mapExpanded ? 'Reducir' : 'Ampliar'}
                </Button>
              )}
            </div>

            {hasCoordinates ? (
              <div className="rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
                {/* Embedded OpenStreetMap */}
                <div className={`relative transition-all duration-300 ${mapExpanded ? 'h-80' : 'h-48'}`}>
                  <iframe
                    src={osmEmbedUrl!}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    title={`Mapa de ${business.name}`}
                    loading="lazy"
                    className="w-full h-full"
                  />
                  {/* Overlay gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                </div>

                {/* Map action bar */}
                <div className="bg-emerald-50/50 px-4 py-2.5 flex items-center justify-between gap-2 border-t border-emerald-100">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {business.latitude!.toFixed(4)}, {business.longitude!.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=16/${business.latitude}/${business.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      OpenStreetMap
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* No coordinates fallback */
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-6 text-center">
                <MapPin className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">
                  Ubicación exacta no disponible
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Este negocio aún no tiene coordenadas precisas registradas
                </p>
                <a
                  href={addressSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Buscar en Google Maps
                  </Button>
                </a>
              </div>
            )}

            {/* Cómo llegar button */}
            <Button
              onClick={handleGetDirections}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-200/50"
            >
              <Navigation className="h-4 w-4" />
              Cómo Llegar
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px]"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            )}
            <a href={`tel:${business.phone}`} className="flex-1 min-w-[140px]">
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2">
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
            </a>
          </div>

          {/* Social links */}
          {(business.facebook || business.instagram || business.website) && (
            <>
              <Separator className="bg-emerald-100" />
              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Redes Sociales y Web
                </h3>
                <div className="flex flex-wrap gap-3">
                  {business.facebook && (
                    <a
                      href={business.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                  )}
                  {business.instagram && (
                    <a
                      href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-pink-50 hover:bg-pink-100 rounded-xl text-pink-700 transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-700 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">Sitio Web</span>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-gray-400 pt-2">
            <Clock className="h-3 w-3" />
            Registrado el {new Date(business.createdAt).toLocaleDateString('es-MX', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
