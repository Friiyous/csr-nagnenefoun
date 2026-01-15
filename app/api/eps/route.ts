import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET() {
  try {
    const eps = mockStore.getEPS();
    return NextResponse.json(eps);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}