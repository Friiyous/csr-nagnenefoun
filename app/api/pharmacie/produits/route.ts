import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId") || "eps-001";
    const produits = mockStore.getProduits(epsId);
    return NextResponse.json(produits);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const produit = mockStore.createProduit(body);
    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}