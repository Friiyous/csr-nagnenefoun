import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Indicateurs PBF
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId");

    const indicateurs = await prisma.indicateurPBF.findMany({
      where: { actif: true },
      orderBy: { nom: "asc" },
    });

    // Si EPS spécifié, récupérer les réalisations
    if (epsId) {
      const periode = searchParams.get("periode");
      
      let realiseationsFilter: Record<string, unknown> = { epsId };
      if (periode) {
        const periodeDate = new Date(periode);
        const debutMois = new Date(periodeDate.getFullYear(), periodeDate.getMonth(), 1);
        const finMois = new Date(periodeDate.getFullYear(), periodeDate.getMonth() + 1, 0);
        
        realiseationsFilter = {
          ...realiseationsFilter,
          periode: {
            gte: debutMois,
            lte: finMois,
          },
        };
      }

      const realisations = await prisma.realisationPBF.findMany({
        where: realiseationsFilter,
      });

      return NextResponse.json({ indicateurs, realisations });
    }

    return NextResponse.json(indicateurs);
  } catch (error) {
    console.error("Erreur lors de la récupération des indicateurs PBF:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un indicateur PBF
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, nom, description, ponderation, unite, prixUnitaire } = body;

    const indicateur = await prisma.indicateurPBF.create({
      data: {
        code,
        nom,
        description,
        ponderation,
        unite,
        prixUnitaire,
      },
    });

    return NextResponse.json(indicateur, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'indicateur PBF:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}