import { NextRequest, NextResponse } from 'next/server';

const gardes = [
  {
    id: '1',
    personnelId: 'P001',
    personnel: { nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin Chef' },
    date: '2025-01-15',
    type: 'NUIT',
    service: 'Urgences',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const garde = gardes.find((g) => g.id === params.id);
  
  if (!garde) {
    return NextResponse.json({
      success: false,
      error: 'Garde non trouvée',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: garde,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = gardes.findIndex((g) => g.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Garde non trouvée',
    }, { status: 404 });
  }
  
  gardes.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Garde supprimée avec succès',
  });
}