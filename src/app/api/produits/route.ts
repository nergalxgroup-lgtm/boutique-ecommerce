import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/produits?categorie=ENFANT&sousCategorie=Robe&recherche=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorie = searchParams.get("categorie");
  const sousCategorie = searchParams.get("sousCategorie");
  const recherche = searchParams.get("recherche");

  const produits = await prisma.produit.findMany({
    where: {
      actif: true,
      ...(categorie ? { categorie: categorie as any } : {}),
      ...(sousCategorie ? { sousCategorie } : {}),
      ...(recherche
        ? { nom: { contains: recherche, mode: "insensitive" } }
        : {}),
    },
    include: {
      images: { orderBy: { ordre: "asc" }, take: 1 },
      variantes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(produits);
}

const produitSchema = z.object({
  nom: z.string().min(2),
  slug: z.string().min(2),
  description: z.string(),
  prix: z.number().positive(),
  prixPromo: z.number().positive().optional(),
  categorie: z.enum(["HOMME", "FEMME", "ENFANT", "MIXTE"]),
  sousCategorie: z.string().optional(),
  tailleAge: z.string().optional(),
  variantes: z.array(
    z.object({
      taille: z.string(),
      couleur: z.string(),
      sku: z.string(),
      stock: z.number().int().nonnegative(),
    })
  ),
  images: z.array(z.string().url()).optional(),
});

// POST /api/produits (admin uniquement — protéger avec middleware d'auth en prod)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = produitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { images, variantes, ...data } = parsed.data;

  const produit = await prisma.produit.create({
    data: {
      ...data,
      variantes: { create: variantes },
      images: images
        ? { create: images.map((url, i) => ({ url, ordre: i })) }
        : undefined,
    },
    include: { variantes: true, images: true },
  });

  return NextResponse.json(produit, { status: 201 });
}
