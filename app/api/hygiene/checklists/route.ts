import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId") || "eps-001";
    const checklists = mockStore.getChecklists(epsId);
    return NextResponse.json(checklists);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const checklist = mockStore.createChecklist(body);
    return NextResponse.json(checklist, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}