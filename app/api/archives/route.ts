import { NextRequest, NextResponse } from 'next/server';

// Données mockées pour les archives
let archives = [
  {
    id: '1',
    titre: 'Rapport PBF T4 2024',
    type: 'RAPPORT',
    categorie: 'PBF',
    date: '2025-01-10',
    taille: '2.5 MB',
    format: 'PDF',
    author: 'Dr. Kouamé',
    epsId: 'demo-eps-id',
  },
  {
    id: '2',
    titre: 'Procès-verbal Conseil d\'Administration',
    type: 'DOCUMENT',
    categorie: 'ADMINISTRATION',
    date: '2024-12-15',
    taille: '1.2 MB',
    format: 'PDF',
    author: 'Secrétaire',
    epsId: 'demo-eps-id',
  },
  {
    id: '3',
    titre: 'Inventaire Pharmacie 2024',
    type: 'INVENTAIRE',
    categorie: 'PHARMACIE',
    date: '2024-12-31',
    taille: '800 KB',
    format: 'XLSX',
    author: 'Dr. Diallo',
    epsId: 'demo-eps-id',
  },
  {
    id: '4',
    titre: 'Protocole d\'hygiène',
    type: 'PROTOCOLE',
    categorie: 'HYGIENE',
    date: '2024-11-20',
    taille: '500 KB',
    format: 'PDF',
    author: 'Dr. Kouamé',
    epsId: 'demo-eps-id',
  },
  {
    id: '5',
    titre: 'Liste du personnel 2025',
    type: 'LISTE',
    categorie: 'RH',
    date: '2025-01-05',
    taille: '300 KB',
    format: 'XLSX',
    author: 'Agent Administratif',
    epsId: 'demo-eps-id',
  },
];

export async function GET(request: NextRequest) {
  const epsId = request.nextUrl.searchParams.get('epsId');
  const type = request.nextUrl.searchParams.get('type');
  const categorie = request.nextUrl.searchParams.get('categorie');
  const search = request.nextUrl.searchParams.get('search');
  
  let filteredArchives = [...archives];
  
  if (type) {
    filteredArchives = filteredArchives.filter((a) => a.type === type);
  }
  
  if (categorie) {
    filteredArchives = filteredArchives.filter((a) => a.categorie === categorie);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredArchives = filteredArchives.filter(
      (a) =>
        a.titre.toLowerCase().includes(searchLower) ||
        a.categorie.toLowerCase().includes(searchLower)
    );
  }
  
  return NextResponse.json({
    success: true,
    data: filteredArchives,
    total: filteredArchives.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newArchive = {
      id: String(archives.length + 1),
      ...body,
      epsId: 'demo-eps-id',
      taille: '0 KB',
      format: body.format || 'PDF',
    };
    
    archives.push(newArchive);
    
    return NextResponse.json({
      success: true,
      data: newArchive,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de l\'archive',
    }, { status: 400 });
  }
}