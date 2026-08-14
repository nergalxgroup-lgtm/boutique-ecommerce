import Link from "next/link";

const univers = [
  { categorie: "FEMME", titre: "Femme", image: "/images/hero-femme.jpg" },
  { categorie: "HOMME", titre: "Homme", image: "/images/hero-homme.jpg" },
  { categorie: "ENFANT", titre: "Enfant", image: "/images/hero-enfant.jpg" },
];

export default function HomePage() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-4xl md:text-5xl mb-4">
          Mode pour toute la famille
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Découvrez nos collections homme, femme et enfant. Livraison partout
          au Maroc, paiement sécurisé ou à la livraison.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">
        {univers.map((u) => (
          <Link
            key={u.categorie}
            href={`/produits?categorie=${u.categorie}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100"
          >
            <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/50 to-transparent">
              <span className="text-white font-serif text-2xl">{u.titre}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
