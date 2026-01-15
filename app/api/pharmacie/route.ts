import { NextRequest, NextResponse } from 'next/server';

// Données mockées pharmacie
let produits = [
  { id: '1', code: 'MED001', nom: 'Paracetamol 500mg', categorie: 'Médicament', unite: 'Boîte', seuilAlerte: 50, prixUnitaire: 1500, createdAt: '2024-01-15' },
  { id: '2', code: 'MED002', nom: 'Amoxicilline 1g', categorie: 'Médicament', unite: 'Boîte', seuilAlerte: 30, prixUnitaire: 2500, createdAt: '2024-02-20' },
  { id: '3', code: 'MAT001', nom: 'Cotons', categorie: 'Matériel', unite: 'Paquet', seuilAlerte: 100, prixUnitaire: 500, createdAt: '2024-03-10' },
];

let stocks = [
  { id: '1', produitId: '1', quantite: 150, datePeremption: '2025-12-31', lot: 'LOT001' },
  { id: '2', produitId: '2', quantite: 45, datePeremption: '2025-06-30', lot: 'LOT002' },
  { id: '3', produitId: '3', quantite: 200, lot: 'LOT003' },
];

// GET - Lister produits
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  
  let filtered = produits;
  if (type === 'alerte') {
    const alertIds = stocks
      .filter(s => {
        const produit = produits.find(p => p.id === s.produitId);
        return produit && s.quantite < produit.seuilAlerte;
      })
      .map(s => s.produitId);
    filtered = filtered.filter(p => alertIds.includes(p.id));
  }
  
  return NextResponse.json({
    success: true,
    data: filtered,
    stocks: stocks,
    total: filtered.length,
  });
}

// POST - Créer produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduit = {
      id: String(Date.now()),
      code: `MED${String(produits.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    produits.push(newProduit);
    
    // Ajouter au stock
    stocks.push({
      id: String(Date.now()),
      produitId: newProduit.id,
      quantite: 0,
      lot: `LOT${String(Date.now()).slice(-6)}`,
      datePeremption: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 an
    });
    
    return NextResponse.json({
      success: true,
      data: newProduit,
      message: 'Produit créé',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}

// PUT - Modifier produit
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const index = produits.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
    }
    
    produits[index] = { ...produits[index], ...updates };
    
    return NextResponse.json({ success: true, data: produits[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}

// POST - Mouvement de stock
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { produitId, type, quantite, lot } = body;
    
    const stockIndex = stocks.findIndex(s => s.produitId === produitId);
    if (stockIndex === -1) {
      return NextResponse.json({ success: false, error: 'Stock non trouvé' }, { status: 404 });
    }
    
    if (type === 'ENTREE') {
      stocks[stockIndex].quantite += quantite;
    } else if (type === 'SORTIE') {
      stocks[stockIndex].quantite = Math.max(0, stocks[stockIndex].quantite - quantite);
    }
    
    return NextResponse.json({
      success: true,
      data: stocks[stockIndex],
      message: 'Mouvement enregistré',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 400 });
  }
}