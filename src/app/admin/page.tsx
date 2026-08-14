import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [nbProduits, nbCommandesEnAttente, stockFaible, ventesRecentes] = await Promise.all([
    prisma.produit.count({ where: { actif: true } }),
    prisma.commande.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.variante.count({ where: { stock: { lte: 3 } } }),
    prisma.commande.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-serif mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Carte titre="Produits actifs" valeur={nbProduits} lien="/admin/produits" />
        <Carte titre="Commandes en attente" valeur={nbCommandesEnAttente} lien="/admin/commandes" />
        <Carte titre="Variantes en stock faible (≤3)" valeur={stockFaible} lien="/admin/produits" alerte />
      </div>

      <h2 className="text-lg font-medium mb-4">Commandes récentes</h2>
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="py-2">N°</th>
            <th>Client</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Paiement</th>
          </tr>
        </thead>
        <tbody>
          {ventesRecentes.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{c.numero}</td>
              <td>{c.user.nom}</td>
              <td>{Number(c.total).toFixed(2)} $</td>
              <td>{c.statut}</td>
              <td>{c.modePaiement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Carte({ titre, valeur, lien, alerte }: { titre: string; valeur: number; lien: string; alerte?: boolean }) {
  return (
    <Link href={lien} className={`border rounded-lg p-5 ${alerte && valeur > 0 ? "border-orange-300 bg-orange-50" : ""}`}>
      <p className="text-sm text-gray-500">{titre}</p>
      <p className="text-3xl font-semibold mt-1">{valeur}</p>
    </Link>
  );
}
