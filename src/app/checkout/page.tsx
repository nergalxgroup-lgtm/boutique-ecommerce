"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { articles, total, vider } = useCart();
  const router = useRouter();
  const modePaiement = "PAIEMENT_LIVRAISON" as const; // seule option active pour le test RDC
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [adresse, setAdresse] = useState({
    nom: "",
    telephone: "",
    ville: "",
    quartier: "",
    adresseLigne: "",
  });

  const soumettre = async () => {
    setChargement(true);
    setErreur("");
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lignes: articles.map((a) => ({
            produitId: a.produitId,
            varianteId: a.varianteId,
            quantite: a.quantite,
          })),
          modePaiement,
          adresseLivraison: adresse,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error ?? "Une erreur est survenue");
        return;
      }

      vider();
      router.push(data.redirection);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl mb-8">Finaliser la commande</h1>

      <div className="space-y-3 mb-8">
        <input
          placeholder="Nom complet"
          className="w-full border rounded px-3 py-2 text-sm"
          value={adresse.nom}
          onChange={(e) => setAdresse({ ...adresse, nom: e.target.value })}
        />
        <input
          placeholder="Téléphone"
          className="w-full border rounded px-3 py-2 text-sm"
          value={adresse.telephone}
          onChange={(e) => setAdresse({ ...adresse, telephone: e.target.value })}
        />
        <input
          placeholder="Ville"
          className="w-full border rounded px-3 py-2 text-sm"
          value={adresse.ville}
          onChange={(e) => setAdresse({ ...adresse, ville: e.target.value })}
        />
        <input
          placeholder="Quartier (optionnel)"
          className="w-full border rounded px-3 py-2 text-sm"
          value={adresse.quartier}
          onChange={(e) => setAdresse({ ...adresse, quartier: e.target.value })}
        />
        <textarea
          placeholder="Adresse complète"
          className="w-full border rounded px-3 py-2 text-sm"
          value={adresse.adresseLigne}
          onChange={(e) => setAdresse({ ...adresse, adresseLigne: e.target.value })}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium mb-2">Mode de paiement</p>
        <p className="text-sm text-gray-600 border rounded px-3 py-2 bg-gray-50">
          Paiement à la livraison (Mobile Money / Airtel / Orange Money à ajouter ensuite)
        </p>
      </div>

      <div className="flex justify-between mb-6 text-sm">
        <span>Total à payer</span>
        <span className="font-semibold">{total().toFixed(2)} $</span>
      </div>

      {erreur && <p className="text-red-500 text-sm mb-4">{erreur}</p>}

      <button
        onClick={soumettre}
        disabled={chargement || articles.length === 0}
        className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-40"
      >
        {chargement ? "Traitement..." : "Confirmer la commande"}
      </button>
    </div>
  );
}

