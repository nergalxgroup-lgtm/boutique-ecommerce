"use client";

import { useCart } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";

export default function PanierPage() {
  const { articles, retirer, majQuantite, total } = useCart();

  if (articles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 mb-6">Votre panier est vide.</p>
        <Link href="/produits" className="underline">Continuer mes achats</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl mb-8">Mon panier</h1>

      <div className="space-y-6">
        {articles.map((a) => (
          <div key={a.varianteId} className="flex gap-4 border-b pb-6">
            <div className="w-24 h-32 bg-gray-100 rounded relative flex-shrink-0">
              {a.image && <Image src={a.image} alt={a.nom} fill className="object-cover rounded" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{a.nom}</h3>
              <p className="text-sm text-gray-500">{a.taille} · {a.couleur}</p>
              <p className="text-sm mt-1">{a.prix} $</p>

              <div className="flex items-center gap-3 mt-3">
                <select
                  value={a.quantite}
                  onChange={(e) => majQuantite(a.varianteId, Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {Array.from({ length: a.stockDisponible }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button
                  onClick={() => retirer(a.varianteId)}
                  className="text-sm text-gray-400 hover:text-red-500"
                >
                  Retirer
                </button>
              </div>
            </div>
            <p className="font-medium">{(a.prix * a.quantite).toFixed(2)} $</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <span className="text-lg">Total</span>
        <span className="text-lg font-semibold">{total().toFixed(2)} $</span>
      </div>

      <Link
        href="/checkout"
        className="block text-center bg-black text-white py-3 rounded-md font-medium mt-6 hover:bg-gray-800 transition"
      >
        Passer la commande
      </Link>
    </div>
  );
}
