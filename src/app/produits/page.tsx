import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const categories = [
  { valeur: "", label: "Tout" },
  { valeur: "FEMME", label: "Femme" },
  { valeur: "HOMME", label: "Homme" },
  { valeur: "ENFANT", label: "Enfant" },
  { valeur: "MIXTE", label: "Mixte" },
];

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: { categorie?: string };
}) {
  const categorie = searchParams.categorie;

  const produits = await prisma.produit.findMany({
    where: {
      actif: true,
      ...(categorie ? { categorie: categorie as any } : {}),
    },
    include: { images: { take: 1, orderBy: { ordre: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex gap-4 mb-8 border-b pb-4">
        {categories.map((c) => (
          <a
            key={c.valeur}
            href={c.valeur ? `/produits?categorie=${c.valeur}` : "/produits"}
            className={`text-sm font-medium pb-1 ${
              (categorie ?? "") === c.valeur
                ? "border-b-2 border-brand-500"
                : "text-gray-500"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {produits.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {produits.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              nom={p.nom}
              prix={Number(p.prix)}
              prixPromo={p.prixPromo ? Number(p.prixPromo) : null}
              image={p.images[0]?.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
