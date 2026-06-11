// Footer del Directorio Digital de la Huasteca Hidalguense

'use client';

import { Heart, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-emerald-gradient text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Huasteca Digital</h3>
                <p className="text-emerald-200 text-sm">Directorio de Negocios</p>
              </div>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Tu guía comercial y de servicios de la Huasteca Hidalguense. 
              Encuentra los mejores negocios y profesionales de la región.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-base mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-emerald-200">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Huejutla de Reyes, Hidalgo
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-300" />
                contacto@huastecadigital.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-300" />
                789 123 4567
              </li>
            </ul>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold text-base mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Inicio
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Categorías
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Registrar mi Negocio
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Aviso de Privacidad
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-700/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-emerald-300">
            © {new Date().getFullYear()} Huasteca Digital. Todos los derechos reservados.
          </p>
          <p className="text-sm text-emerald-300 flex items-center gap-1">
            Hecho con <Heart className="h-3 w-3 text-red-400 fill-red-400" /> en la Huasteca
          </p>
        </div>
      </div>
    </footer>
  );
}
