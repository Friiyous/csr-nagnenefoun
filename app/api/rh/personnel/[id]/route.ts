import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const personnel = mockStore.getPersonnel("eps-001").find(p => p.id === params.id);
    if (!personnel) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    return NextResponse.json(personnel);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const personnel = mockStore.updatePersonnel(params.id, body);
    if (!personnel) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    return NextResponse.json(personnel);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = mockStore.deletePersonnel(params.id);
    if (!success) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ message: "Supprimé" });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}