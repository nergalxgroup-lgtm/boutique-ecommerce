import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }
  const { nom, email, password } = parsed.data;

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { nom, email, password: hash, role: "CLIENT" } });

  return NextResponse.json({ ok: true });
}
