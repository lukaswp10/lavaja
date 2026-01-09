'use client';

import Link from 'next/link';
import { Car, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Lava-car nao encontrado
        </h1>
        <p className="text-gray-400 mb-8">
          O lava-car que voce procura nao existe ou esta inativo.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--cor-primaria)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}

