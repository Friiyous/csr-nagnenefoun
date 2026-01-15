import { NextRequest, NextResponse } from 'next/server';

// Données mockées finance
let transactions = [
  { id: '1', type: 'RECETTE', categorie: 'Consultation', montant: 15000, description: 'Consultations du jour', date: '2024-12-01', reference: 'R001' },
  { id: '2', type: 'DEPENSE', categorie: 'Pharmacie', montant: 5000, description: 'Achat médicaments', date: '2024-12-01', reference: 'D001' },
  { id: '3', type: 'RECETTE', categorie: 'Hospitalisation', montant: 45000, description: ' Chambre 3', date: '2024-12-02', reference: 'R002' },
  { id: '4', type: 'DEPENSE', categorie: 'Salaires', montant: 500000, description: 'Salaires décembre', date: '2024-12-05', reference: 'D002' },
];

// GET - Lister transactions avec statistiques
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  
  let filtered = transactions;
  if (type) filtered = filtered.filter(t => t.type === type);
  if (startDate) filtered = filtered.filter(t => t.date >= startDate);
  if (endDate) filtered = filtered.filter(t => t.date <= endDate);
  
  const totalRecettes = filtered.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
  const totalDepenses = filtered.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.montant, 0);
  const solde = totalRecettes - totalDepenses;
  
  return NextResponse.json({
    success: true,
    data: filtered,
    stats: {
      totalRecettes,
      totalDepenses,
      solde,
      nombreTransactions: filtered.length,
    },
  });
}

// POST - Créer transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTransaction = {
      id: String(Date.now()),
      reference: `${body.type === 'RECETTE' ? 'R' : 'D'}${String(transactions.length + 1).padStart(3, '0')}`,
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
    };
    
    transactions.push(newTransaction);
    
    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transaction enregistrée',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}

// GET /api/finance/stats - Statistiques rapides
export async function PATCH(request: NextRequest) {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.slice(0, 7) + '-01';
  
  const todayTx = transactions.filter(t => t.date === today);
  const monthTx = transactions.filter(t => t.date >= monthStart);
  
  const todayRecettes = todayTx.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
  const monthRecettes = monthTx.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
  const monthDepenses = monthTx.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.montant, 0);
  
  return NextResponse.json({
    success: true,
    stats: {
      todayRecettes,
      monthRecettes,
      monthDepenses,
      monthSolde: monthRecettes - monthDepenses,
    },
  });
}