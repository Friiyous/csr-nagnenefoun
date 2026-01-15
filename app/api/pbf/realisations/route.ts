import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Réalisations PBF
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId");
    const periode = searchParams.get("periode");

    if (!epsId) {
      return NextResponse.json(
        { error: "EPS ID requis" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { epsId };

    if (periode) {
      const periodeDate = new Date(periode);
      const debutMois = new Date(periodeDate.getFullYear(), periodeDate.getMonth(), 1);
      const finMois = new Date(periodeDate.getFullYear(), periodeDate.getMonth() + 1, 0);
      
      where.periode = {
        gte: debutMois,
        lte: finMois,
      };
    }

    const realisations = await prisma.realisationPBF.findMany({
      where,
      include: {
        indicateur: true,
      },
      orderBy: { periode: "desc" },
    });

    return NextResponse.json(realisations);
  } catch (error) {
    console.error("Erreur lors de la récupération des réalisations PBF:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer une réalisation PBF
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { epsId, indicateurId, periode, quantite, montantCalcule } = body;

    // Vérifier si une réalisation existe déjà pour cette période
    const existing = await prisma.realisationPBF.findFirst({
      where: {
        epsId,
        indicateurId,
        periode: {
          gte: new Date(new Date(periode).getFullYear(), new Date(periode).getMonth(), 1),
          lte: new Date(new Date(periode).getFullYear(), new Date(periode).getMonth() + 1, 0),
        },
      },
    });

    if (existing) {
      // Mettre à jour l'existante
      const realisation = await prisma.realisationPBF.update({
        where: { id: existing.id },
        data: {
          quantite,
          montantCalcule,
        },
      });
      return NextResponse.json(realisation);
    }

    const realisation = await prisma.realisationPBF.create({
      data: {
        epsId,
        indicateurId,
        periode: new Date(periode),
        quantite,
        montantCalcule,
      },
    });

    return NextResponse.json(realisation, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la réalisation PBF:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}