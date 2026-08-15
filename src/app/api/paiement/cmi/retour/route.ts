import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifierRetourCMI } from "@/lib/cmi";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => (params[key] = value.toString()));

  const valide = verifierRetourCMI(params);
  const succes = valide && params.Response === "Approved";

  const commande = await prisma.commande.findUnique({
    where: { numero: params.oid },
  });

  if (!commande) {
    return NextResponse.redirect(new URL("/checkout?erreur=commande_introuvable", req.url));
  }

  if (succes) {
    await prisma.commande.update({
      where: { id: commande.id },
      data: { statut: "PAYEE", referencePaiement: params.TransId },
    });
    return NextResponse.redirect(
      new URL(`/commande/${commande.id}/confirmation`, req.url)
    );
  }

  // Échec : on remet le stock (la réservation avait été faite à la création)
  const lignes = await prisma.ligneCommande.findMany({ where: { commandeId: commande.id } });
  await Promise.all(
    lignes.map((l: (typeof lignes)[number]) =>
      prisma.variante.update({
        where: { id: l.varianteId },
        data: { stock: { increment: l.quantite } },
      })
    )
  );
  await prisma.commande.update({ where: { id: commande.id }, data: { statut: "ANNULEE" } });

  return NextResponse.redirect(new URL("/checkout?erreur=paiement_echoue", req.url));
}
