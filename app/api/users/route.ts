import { NextRequest, NextResponse } from 'next/server';

// Données mockées
let users = [
  { id: '1', name: 'Dr. Kouamé', email: 'kouame@eps.ci', role: 'DIRECTEUR', createdAt: '2024-01-15' },
  { id: '2', name: 'Dr. Koné', email: 'kone@eps.ci', role: 'MEDECIN', createdAt: '2024-02-20' },
  { id: '3', name: 'Inf. Diallo', email: 'diallo@eps.ci', role: 'INFIRMIER', createdAt: '2024-03-10' },
];

// GET - Lister tous les utilisateurs
export async function GET() {
  return NextResponse.json({
    success: true,
    data: users,
    total: users.length,
  });
}

// POST - Créer un utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newUser = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    users.push(newUser);
    
    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Utilisateur créé avec succès',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création',
    }, { status: 400 });
  }
}

// PUT - Modifier un utilisateur
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé',
      }, { status: 404 });
    }
    
    users[index] = { ...users[index], ...updates };
    
    return NextResponse.json({
      success: true,
      data: users[index],
      message: 'Utilisateur mis à jour',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour',
    }, { status: 400 });
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID requis',
      }, { status: 400 });
    }
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé',
      }, { status: 404 });
    }
    
    users = users.filter(u => u.id !== id);
    
    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression',
    }, { status: 400 });
  }
}