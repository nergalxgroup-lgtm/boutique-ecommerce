"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

type Variante = {
  id: string;
  taille: string;
  couleur: string;
  stock: number;
};

type Props = {
  produitId: string;
  nom: string;
  prix: number;
  prixPromo: number | null;
  image: string;
  variantes: Variante[];
};

export default function ProduitDetail({ produitId, nom, prix, prixPromo, image, variantes }: Props) {
  const tailles = Array.from(new Set(variantes.map((v) => v.taille)));
  const [tailleChoisie, setTailleChoisie] = useState(tailles[0] ?? "");
  const couleurs = variantes.filter((v) => v.taille === tailleChoisie);
  const [couleurChoisie, setCouleurChoisie] = useState(couleurs[0]?.couleur ?? "");

  const ajouter = useCart((s) => s.ajouter);
  const router = useRouter();

  const varianteActuelle = variantes.find(
    (v) => v.taille === tailleChoisie && v.couleur === couleurChoisie
  );

  const handleAjouter = () => {
    if (!varianteActuelle || varianteActuelle.stock === 0) return;
    ajouter({
      produitId,
      varianteId: varianteActuelle.id,
      nom,
      image,
      taille: varianteActuelle.taille,
      couleur: varianteActuelle.couleur,
      prix: prixPromo ?? prix,
      quantite: 1,
      stockDisponible: varianteActuelle.stock,
    });
    router.push("/panier");
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Taille</p>
        <div className="flex gap-2">
          {tailles.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTailleChoisie(t);
                const premiereCouleur = variantes.find((v) => v.taille === t);
                setCouleurChoisie(premiereCouleur?.couleur ?? "");
              }}
              className={`px-3 py-1.5 text-sm border rounded ${
                tailleChoisie === t ? "border-black bg-black text-white" : "border-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Couleur</p>
        <div className="flex gap-2">
          {couleurs.map((v) => (
            <button
              key={v.id}
              onClick={() => setCouleurChoisie(v.couleur)}
              className={`px-3 py-1.5 text-sm border rounded ${
                couleurChoisie === v.couleur ? "border-black bg-black text-white" : "border-gray-300"
              }`}
            >
              {v.couleur}
            </button>
          ))}
        </div>
      </div>

      {varianteActuelle && varianteActuelle.stock === 0 ? (
        <p className="text-red-500 text-sm mb-4">Rupture de stock pour cette combinaison</p>
      ) : varianteActuelle && varianteActuelle.stock <= 3 ? (
        <p className="text-orange-500 text-sm mb-4">
          Plus que {varianteActuelle.stock} en stock
        </p>
      ) : null}

      <button
        onClick={handleAjouter}
        disabled={!varianteActuelle || varianteActuelle.stock === 0}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
