import { NextRequest, NextResponse } from 'next/server';

// Données mockées personnel
let personnel = [
  { id: '1', matricule: 'EMP001', nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin', categorie: 'A', statut: 'ACTIF', createdAt: '2024-01-15' },
  { id: '2', matricule: 'EMP002', nom: 'Koné', prenom: 'Marie', fonction: 'Infirmier', categorie: 'B', statut: 'ACTIF', createdAt: '2024-02-20' },
  { id: '3', matricule: 'EMP003', nom: 'Traoré', prenom: 'Paul', fonction: 'Pharmacien', categorie: 'A', statut: 'CONGE', createdAt: '2024-03-10' },
];

// GET - Lister personnel
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const statut = searchParams.get('statut') || '';
  
  let filtered = personnel;
  if (search) {
    filtered = filtered.filter(p => 
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.fonction.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (statut) {
    filtered = filtered.filter(p => p.statut === statut);
  }
  
  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

// POST - Créer personnel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPersonnel = {
      id: String(Date.now()),
      matricule: `EMP${String(personnel.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    personnel.push(newPersonnel);
    
    return NextResponse.json({
      success: true,
      data: newPersonnel,
      message: 'Personnel créé',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}

// PUT - Modifier personnel
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const index = personnel.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
    }
    
    personnel[index] = { ...personnel[index], ...updates };
    
    return NextResponse.json({ success: true, data: personnel[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}

// DELETE - Supprimer personnel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    }
    
    personnel = personnel.filter(p => p.id !== id);
    
    return NextResponse.json({ success: true, message: 'Supprimé' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}