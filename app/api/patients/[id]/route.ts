import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Un patient
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        consultations: {
          orderBy: { date: "desc" },
        },
        ordonnances: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Modifier un patient
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      numero,
      nom,
      prenom,
      dateNaiss,
      lieuNaiss,
      genre,
      telephone,
      adresse,
      personneContact,
      telephoneContact,
    } = body;

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        numero,
        nom,
        prenom,
        dateNaiss: new Date(dateNaiss),
        lieuNaiss,
        genre,
        telephone,
        adresse,
        personneContact,
        telephoneContact,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erreur lors de la modification du patient:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un patient
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du patient:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}