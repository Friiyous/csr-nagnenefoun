import { PrismaClient, Role, EPSType, StatutPersonnel, StatutConge, TypeConge, TypeGarde, TypeTransaction, Genre } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed EPS Manager...');

  // Créer les régions de Côte d'Ivoire
  const regions = [
    { nom: 'Abidjan', code: 'ABJ' },
    { nom: 'Bas-Sassandra', code: 'BS' },
    { nom: 'Comoé', code: 'COM' },
    { nom: 'Denguélé', code: 'DEN' },
    { nom: 'Gôh-Djiboua', code: 'GD' },
    { nom: 'Lacs', code: 'LA' },
    { nom: 'Lagunes', code: 'LAG' },
    { nom: 'Montagnes', code: 'MONT' },
    { nom: 'Sassandra-Marahoué', code: 'SM' },
    { nom: 'Savanes', code: 'SAV' },
    { nom: 'Sud-Bandama', code: 'SB' },
    { nom: 'Sud-Comoé', code: 'SC' },
    { nom: 'Vallée du Bandama', code: 'VB' },
    { nom: 'Woroba', code: 'WOR' },
    { nom: 'Zanzan', code: 'ZAN' },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: {},
      create: region,
    });
  }

  console.log('✅ Régions créées');

  // Créer un EPS de démonstration
  const eps = await prisma.ePS.upsert({
    where: { code: 'CSR-ABJ-001' },
    update: {},
    create: {
      name: 'Centre de Santé de Référence d\'Abidjan',
      code: 'CSR-ABJ-001',
      type: EPSType.CSR,
      region: 'Abidjan',
      district: 'Abidjan',
      adresse: 'Plateau, Abidjan',
      telephone: '+225 27 20 00 00 00',
      email: 'contact@csr-abidjan.ci',
    },
  });

  console.log('✅ EPS créé');

  // Créer des utilisateurs
  await prisma.user.upsert({
    where: { email: 'admin@eps-manager.ci' },
    update: {},
    create: {
      email: 'admin@eps-manager.ci',
      password: 'admin123',
      name: 'Administrateur',
      role: Role.ADMIN,
      epsId: eps.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'directeur@eps-manager.ci' },
    update: {},
    create: {
      email: 'directeur@eps-manager.ci',
      password: 'admin123',
      name: 'Dr. Kouamé',
      role: Role.DIRECTEUR,
      epsId: eps.id,
    },
  });

  console.log('✅ Utilisateurs créés');

  // Créer du personnel
  const personnelData = [
    { matricule: 'P001', nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin Chef', categorie: 'A' },
    { matricule: 'P002', nom: 'Traoré', prenom: 'Fatou', fonction: 'Infirmière', categorie: 'B' },
    { matricule: 'P003', nom: 'Diallo', prenom: 'Ali', fonction: 'Pharmacien', categorie: 'A' },
    { matricule: 'P004', nom: 'Bamba', prenom: 'Marie', fonction: 'Agent Administratif', categorie: 'C' },
    { matricule: 'P005', nom: 'Ouattara', prenom: 'Paul', fonction: 'Agent d\'Hygiène', categorie: 'D' },
  ];

  for (const p of personnelData) {
    await prisma.personnel.upsert({
      where: { epsId_matricule: { epsId: eps.id, matricule: p.matricule } },
      update: {},
      create: {
        epsId: eps.id,
        ...p,
        telephone: '+225 07 0000 0000',
        email: `${p.matricule.toLowerCase()}@csr-abidjan.ci`,
        statut: StatutPersonnel.ACTIF,
      },
    });
  }

  console.log('✅ Personnel créé');

  // Créer des indicateurs PBF
  const indicateurs = [
    { code: 'PBF-CONS', nom: 'Consultation curative', ponderation: 1, unite: 'consultation', prixUnitaire: 500 },
    { code: 'PBF-PREPA', nom: 'Prise en charge des enfants de 0-5 ans', ponderation: 1, unite: 'enfant', prixUnitaire: 1000 },
    { code: 'PBF-CPN', nom: 'Consultation Prénatale', ponderation: 1, unite: 'consultation', prixUnitaire: 800 },
    { code: 'PBF-ACCOU', nom: 'Accouchements eutociques', ponderation: 1, unite: 'accouchement', prixUnitaire: 5000 },
    { code: 'PBF-VACC', nom: 'Vaccination', ponderation: 1, unite: 'dose', prixUnitaire: 200 },
  ];

  for (const ind of indicateurs) {
    await prisma.indicateurPBF.upsert({
      where: { code: ind.code },
      update: {},
      create: ind,
    });
  }

  console.log('✅ Indicateurs PBF créés');

  // Créer des produits pharmaceutiques
  const produits = [
    { code: 'PARA-500', nom: 'Paracétamol 500mg', categorie: 'Analgésiques', unite: 'comprimé', seuilAlerte: 100 },
    { code: 'AMOX-250', nom: 'Amoxicilline 250mg', categorie: 'Antibiotiques', unite: 'gélule', seuilAlerte: 50 },
    { code: 'SEROUM', nom: 'Sérum physiologique', categorie: 'Solutés', unite: 'flacon', seuilAlerte: 20 },
    { code: 'DIAZEP', nom: 'Diazépam 10mg', categorie: 'Psychotropes', unite: 'comprimé', seuilAlerte: 30 },
    { code: 'OXYG', nom: 'Oxygène médical', categorie: 'Gaz médicaux', unite: 'm3', seuilAlerte: 5 },
  ];

  for (const prod of produits) {
    await prisma.produit.upsert({
      where: { epsId_code: { epsId: eps.id, code: prod.code } },
      update: {},
      create: {
        epsId: eps.id,
        ...prod,
        prixUnitaire: Math.random() * 5000 + 500,
        stockage: 'Armoire A',
        totalStock: Math.floor(Math.random() * 200) + 50,
      },
    });
  }

  console.log('✅ Produits créés');

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });