import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function POST(
  request: Request,
  { params }: { params: { produitId: string } }
) {
  try {
    const body = await request.json();
    const { quantite, type } = body;
    const produit = mockStore.updateStock(params.produitId, quantite, type);
    if (!produit) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}