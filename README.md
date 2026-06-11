# Huasteca Digital - Directorio de Negocios

Directorio digital de negocios, comercios y servicios de la Huasteca Hidalguense, México.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
bun install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Crear la base de datos y aplicar migraciones
bun run db:push

# 4. (Opcional) Poblar con datos de ejemplo
# Visita en el navegador: http://localhost:3000/api/seed

# 5. Iniciar el servidor de desarrollo
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Acceso Admin

- **Email**: admin@huastecadigital.com
- **Contraseña**: admin123

## 🛠️ Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Base de datos**: SQLite con Prisma ORM
- **Estado**: Zustand

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/          # API Routes
│   ├── globals.css   # Estilos globales
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Página principal
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── directory/    # Componentes del directorio
│   ├── admin/        # Panel de administración
│   ├── Header.tsx    # Navegación
│   └── Footer.tsx    # Pie de página
├── lib/              # Utilidades, DB, auth
├── hooks/            # Custom hooks
├── store/            # Zustand store
└── types/            # Tipos TypeScript
```

## 📄 Licencia

MIT
