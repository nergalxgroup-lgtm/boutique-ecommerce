import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const produit = await prisma.produit.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { ordre: "asc" } },
      variantes: true,
    },
  });

  if (!produit) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  return NextResponse.json(produit);
}
