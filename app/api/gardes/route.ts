import { NextRequest, NextResponse } from 'next/server';

// Données mockées pour les gardes
let gardes = [
  {
    id: '1',
    personnelId: 'P001',
    personnel: { nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin Chef' },
    date: '2025-01-15',
    type: 'NUIT',
    service: 'Urgences',
  },
  {
    id: '2',
    personnelId: 'P002',
    personnel: { nom: 'Traoré', prenom: 'Fatou', fonction: 'Infirmière' },
    date: '2025-01-15',
    type: 'JOUR',
    service: 'Maternité',
  },
  {
    id: '3',
    personnelId: 'P003',
    personnel: { nom: 'Diallo', prenom: 'Ali', fonction: 'Pharmacien' },
    date: '2025-01-16',
    type: 'NUIT',
    service: 'Pharmacie',
  },
];

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const type = request.nextUrl.searchParams.get('type');
  
  let filteredGardes = [...gardes];
  
  if (date) {
    filteredGardes = filteredGardes.filter((g) => g.date === date);
  }
  
  if (type) {
    filteredGardes = filteredGardes.filter((g) => g.type === type);
  }
  
  return NextResponse.json({
    success: true,
    data: filteredGardes,
    total: filteredGardes.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newGarde = {
      id: String(gardes.length + 1),
      ...body,
    };
    
    gardes.push(newGarde);
    
    return NextResponse.json({
      success: true,
      data: newGarde,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de la garde',
    }, { status: 400 });
  }
}