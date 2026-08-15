import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.id },
    include: { lignes: { include: { produit: true, variante: true } } },
  });

  if (!commande) notFound();

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="font-serif text-2xl mb-2">Commande confirmée ✅</h1>
      <p className="text-gray-500 mb-8">N° {commande.numero}</p>

      <div className="text-left border rounded-lg p-5 mb-8">
        {commande.lignes.map((l: (typeof commande.lignes)[number]) => (
          <div key={l.id} className="flex justify-between text-sm py-1">
            <span>{l.produit.nom} ({l.variante.taille}/{l.variante.couleur}) × {l.quantite}</span>
            <span>{(Number(l.prixUnitaire) * l.quantite).toFixed(2)} $</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-3 mt-3 border-t">
          <span>Total</span>
          <span>{Number(commande.total).toFixed(2)} $</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8">
        Mode de paiement : paiement à la livraison. Vous serez contacté(e) pour confirmer la livraison.
      </p>

      <Link href="/produits" className="underline text-sm">Continuer mes achats</Link>
    </div>
  );
}
