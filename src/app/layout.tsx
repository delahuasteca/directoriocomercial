import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huasteca Digital - Directorio de Negocios y Servicios",
  description: "Directorio digital de negocios, comercios y servicios de la Huasteca Hidalguense. Encuentra restaurantes, tiendas, profesionales y más en la región.",
  keywords: ["Huasteca", "Hidalgo", "directorio", "negocios", "servicios", "Huejutla", "comercio", "Huasteca Hidalguense"],
  authors: [{ name: "Huasteca Digital" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Huasteca Digital - Directorio de Negocios",
    description: "Tu guía comercial y de servicios de la Huasteca Hidalguense",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
