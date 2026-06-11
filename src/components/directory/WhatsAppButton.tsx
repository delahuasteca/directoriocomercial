// WhatsAppButton - Botón flotante de WhatsApp
// Enlace directo a WhatsApp para contacto rápido

'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const whatsappNumber = '527891234567';
  const message = encodeURIComponent(
    '¡Hola! Me interesa registrar mi negocio en Huasteca Digital. ¿Me pueden ayudar?'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 sm:left-6 z-40 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
        
        {/* Button */}
        <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)' }}
        >
          <MessageCircle className="h-6 w-6 text-white fill-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Escríbenos por WhatsApp
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      </div>
    </a>
  );
}
