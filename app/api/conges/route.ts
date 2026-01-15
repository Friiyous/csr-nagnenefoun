import { NextRequest, NextResponse } from 'next/server';

// Données mockées pour les congés
let conges = [
  {
    id: '1',
    personnelId: 'P001',
    personnel: { nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin Chef' },
    type: 'ANNUEL',
    dateDebut: '2025-02-01',
    dateFin: '2025-02-15',
    statut: 'APPROUVE',
    motif: 'Congé annuel',
  },
  {
    id: '2',
    personnelId: 'P002',
    personnel: { nom: 'Traoré', prenom: 'Fatou', fonction: 'Infirmière' },
    type: 'MALADIE',
    dateDebut: '2025-01-20',
    dateFin: '2025-01-25',
    statut: 'EN_ATTENTE',
    motif: 'Maladie',
  },
];

export async function GET(request: NextRequest) {
  const epsId = request.nextUrl.searchParams.get('epsId');
  
  return NextResponse.json({
    success: true,
    data: conges,
    total: conges.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newConge = {
      id: String(conges.length + 1),
      ...body,
      statut: 'EN_ATTENTE',
    };
    
    conges.push(newConge);
    
    return NextResponse.json({
      success: true,
      data: newConge,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du congé',
    }, { status: 400 });
  }
}