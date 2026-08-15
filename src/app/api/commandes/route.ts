import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { genererFormulaireCMI } from "@/lib/cmi";

const commandeSchema = z.object({
  lignes: z.array(
    z.object({
      produitId: z.string(),
      varianteId: z.string(),
      quantite: z.number().int().positive(),
    })
  ),
  modePaiement: z.enum(["CMI", "PAIEMENT_LIVRAISON", "STRIPE"]),
  adresseLivraison: z.object({
    nom: z.string(),
    telephone: z.string(),
    ville: z.string(),
    quartier: z.string().optional(),
    adresseLigne: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = commandeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { lignes, modePaiement, adresseLivraison } = parsed.data;

  // Vérifier le stock et calculer les prix côté serveur (jamais faire confiance au client)
  const variantes = await prisma.variante.findMany({
    where: { id: { in: lignes.map((l) => l.varianteId) } },
    include: { produit: true },
  });

  for (const ligne of lignes) {
    const variante = variantes.find((v: (typeof variantes)[number]) => v.id === ligne.varianteId);
    if (!variante) {
      return NextResponse.json({ error: "Variante introuvable" }, { status: 400 });
    }
    if (variante.stock < ligne.quantite) {
      return NextResponse.json(
        { error: `Stock insuffisant pour ${variante.produit.nom} (${variante.taille}/${variante.couleur})` },
        { status: 409 }
      );
    }
  }

  const sousTotal = lignes.reduce((sum, l) => {
    const v = variantes.find((x: (typeof variantes)[number]) => x.id === l.varianteId)!;
    const prix = Number(v.produit.prixPromo ?? v.produit.prix);
    return sum + prix * l.quantite;
  }, 0);

  const fraisLivraisonDefaut = Number(process.env.FRAIS_LIVRAISON_DEFAUT ?? 35);
  const seuilGratuit = Number(process.env.LIVRAISON_GRATUITE_DES ?? 500);
  const fraisLivraison = sousTotal >= seuilGratuit ? 0 : fraisLivraisonDefaut;
  const total = sousTotal + fraisLivraison;

  const numero = `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const commande = await prisma.commande.create({
    data: {
      numero,
      userId: (session.user as any).id as string,
      sousTotal,
      fraisLivraison,
      total,
      modePaiement,
      statut: modePaiement === "PAIEMENT_LIVRAISON" ? "EN_ATTENTE" : "EN_ATTENTE",
      adresseLivraison,
      lignes: {
        create: lignes.map((l) => {
          const v = variantes.find((x: (typeof variantes)[number]) => x.id === l.varianteId)!;
          return {
            produitId: l.produitId,
            varianteId: l.varianteId,
            quantite: l.quantite,
            prixUnitaire: v.produit.prixPromo ?? v.produit.prix,
          };
        }),
      },
    },
  });

  // Décrémenter le stock immédiatement pour éviter la survente
  // (à libérer via un job si le paiement échoue / expire)
  await Promise.all(
    lignes.map((l) =>
      prisma.variante.update({
        where: { id: l.varianteId },
        data: { stock: { decrement: l.quantite } },
      })
    )
  );

  if (modePaiement === "PAIEMENT_LIVRAISON") {
    return NextResponse.json({ commande, redirection: `/commande/${commande.id}/confirmation` });
  }

  if (modePaiement === "CMI") {
    const formulaireCMI = genererFormulaireCMI({
      orderId: commande.numero,
      montant: total,
      email: session.user.email!,
    });
    return NextResponse.json({ commande, formulaireCMI });
  }

  return NextResponse.json({ commande });
}
