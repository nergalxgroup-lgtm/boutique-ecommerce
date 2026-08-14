import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Compte admin par défaut
  const motDePasseHash = await bcrypt.hash("changeMoi123", 10);
  await prisma.user.upsert({
    where: { email: "admin@boutique.ma" },
    update: {},
    create: {
      email: "admin@boutique.ma",
      password: motDePasseHash,
      nom: "Admin Boutique",
      role: "ADMIN",
    },
  });

  await prisma.produit.upsert({
    where: { slug: "robe-ete-femme" },
    update: {},
    create: {
      nom: "Robe d'été fluide",
      slug: "robe-ete-femme",
      description: "Robe légère en viscose, coupe évasée, idéale pour la saison chaude.",
      prix: 349,
      categorie: "FEMME",
      sousCategorie: "Robe",
      images: { create: [{ url: "/images/placeholder.jpg", ordre: 0 }] },
      variantes: {
        create: [
          { taille: "S", couleur: "Beige", sku: "ROBE-ETE-S-BEIGE", stock: 8 },
          { taille: "M", couleur: "Beige", sku: "ROBE-ETE-M-BEIGE", stock: 5 },
          { taille: "M", couleur: "Bleu", sku: "ROBE-ETE-M-BLEU", stock: 3 },
        ],
      },
    },
  });

  await prisma.produit.upsert({
    where: { slug: "ensemble-bebe-coton" },
    update: {},
    create: {
      nom: "Ensemble bébé en coton bio",
      slug: "ensemble-bebe-coton",
      description: "Ensemble deux pièces tout doux, respectueux de la peau sensible des tout-petits.",
      prix: 189,
      categorie: "ENFANT",
      sousCategorie: "Ensemble",
      tailleAge: "6-12 mois",
      images: { create: [{ url: "/images/placeholder.jpg", ordre: 0 }] },
      variantes: {
        create: [
          { taille: "6-12 mois", couleur: "Blanc", sku: "ENS-BB-612-BLANC", stock: 12 },
          { taille: "12-18 mois", couleur: "Rose", sku: "ENS-BB-1218-ROSE", stock: 7 },
        ],
      },
    },
  });

  console.log("Seed terminé — compte admin: admin@boutique.ma / changeMoi123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
