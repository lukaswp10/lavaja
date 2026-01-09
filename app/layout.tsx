import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { ConfigsProvider } from "@/lib/ConfigsContext";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "LavaJa - Sistema para Lava-Carros",
  description: "Gerencie seu lava-car de qualquer lugar. Fila em tempo real, promocoes automaticas e muito mais.",
  keywords: ["lava rapido", "lava car", "sistema", "gestao", "fila"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ConfigsProvider>
          {children}
        </ConfigsProvider>
      </body>
    </html>
  );
}
