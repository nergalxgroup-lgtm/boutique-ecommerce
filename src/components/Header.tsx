"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/store/cart";

export default function Header() {
  const nombreArticles = useCart((s) => s.nombreArticles());

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          Boutique
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/produits?categorie=FEMME" className="hover:text-brand-500">Femme</Link>
          <Link href="/produits?categorie=HOMME" className="hover:text-brand-500">Homme</Link>
          <Link href="/produits?categorie=ENFANT" className="hover:text-brand-500">Enfant</Link>
          <Link href="/produits" className="hover:text-brand-500">Tout voir</Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/compte" aria-label="Mon compte">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/panier" className="relative" aria-label="Panier">
            <ShoppingBag className="w-5 h-5" />
            {nombreArticles > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {nombreArticles}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
