import { NextResponse } from "next/server";
import { mockStore } from "@/store/mockData";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const epsId = searchParams.get("epsId") || "eps-001";
    const data = mockStore.getTransactions(epsId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = mockStore.createTransaction(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}