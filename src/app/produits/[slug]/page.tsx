import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProduitDetail from "./ProduitDetail";

export default async function ProduitPage({ params }: { params: { slug: string } }) {
  const produit = await prisma.produit.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { ordre: "asc" } },
      variantes: true,
    },
  });

  if (!produit || !produit.actif) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12">
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative">
        {produit.images[0] && (
          <Image src={produit.images[0].url} alt={produit.nom} fill className="object-cover" />
        )}
      </div>

      <div>
        <h1 className="font-serif text-3xl mb-2">{produit.nom}</h1>
        <div className="flex gap-2 mb-6">
          {produit.prixPromo ? (
            <>
              <span className="text-xl text-brand-500 font-semibold">
                {Number(produit.prixPromo)} $
              </span>
              <span className="text-gray-400 line-through">{Number(produit.prix)} $</span>
            </>
          ) : (
            <span className="text-xl">{Number(produit.prix)} $</span>
          )}
        </div>

        <p className="text-gray-600 mb-8">{produit.description}</p>

        <ProduitDetail
          produitId={produit.id}
          nom={produit.nom}
          prix={Number(produit.prix)}
          prixPromo={produit.prixPromo ? Number(produit.prixPromo) : null}
          image={produit.images[0]?.url ?? ""}
          variantes={produit.variantes}
        />
      </div>
    </div>
  );
}
