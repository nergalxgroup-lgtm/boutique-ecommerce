import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  nom: string;
  prix: number;
  prixPromo?: number | null;
  image?: string;
};

export default function ProductCard({ slug, nom, prix, prixPromo, image }: Props) {
  return (
    <Link href={`/produits/${slug}`} className="group block">
      <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden mb-3 relative">
        {image ? (
          <Image
            src={image}
            alt={nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Pas d'image
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium">{nom}</h3>
      <div className="flex gap-2 text-sm">
        {prixPromo ? (
          <>
            <span className="text-brand-500 font-semibold">{prixPromo} $</span>
            <span className="text-gray-400 line-through">{prix} $</span>
          </>
        ) : (
          <span>{prix} $</span>
        )}
      </div>
    </Link>
  );
}
