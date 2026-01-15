import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId") || "eps-001";

    const personnel = mockStore.getPersonnel(epsId);
    return NextResponse.json(personnel);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const personnel = mockStore.createPersonnel(body);
    return NextResponse.json(personnel, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}