import { NextRequest, NextResponse } from 'next/server';

// Données mockées (partagées avec la route principale)
const conges = [
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
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conge = conges.find((c) => c.id === params.id);
  
  if (!conge) {
    return NextResponse.json({
      success: false,
      error: 'Congé non trouvé',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: conge,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = conges.findIndex((c) => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Congé non trouvé',
      }, { status: 404 });
    }
    
    conges[index] = { ...conges[index], ...body };
    
    return NextResponse.json({
      success: true,
      data: conges[index],
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour',
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = conges.findIndex((c) => c.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Congé non trouvé',
    }, { status: 404 });
  }
  
  conges.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Congé supprimé avec succès',
  });
}