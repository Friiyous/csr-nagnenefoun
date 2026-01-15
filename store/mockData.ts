// Store de données simulées pour le développement
// Ce fichier simule une base de données en mémoire

import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  epsId: string;
}

export interface EPS {
  id: string;
  name: string;
  code: string;
  type: string;
  region: string;
  district: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface Personnel {
  id: string;
  epsId: string;
  matricule: string;
  nom: string;
  prenom: string;
  fonction: string;
  categorie: string;
  specialite?: string;
  telephone?: string;
  email?: string;
  statut: string;
  dateRecrutement?: string;
}

export interface Patient {
  id: string;
  epsId: string;
  numero: string;
  nom: string;
  prenom: string;
  dateNaiss: string;
  lieuNaiss?: string;
  genre: string;
  telephone?: string;
  adresse?: string;
}

export interface Transaction {
  id: string;
  epsId: string;
  type: string;
  categorie: string;
  montant: number;
  description?: string;
  date: string;
  reference?: string;
}

export interface Produit {
  id: string;
  epsId: string;
  code: string;
  nom: string;
  categorie: string;
  unite: string;
  seuilAlerte: number;
  prixUnitaire?: number;
  stockage?: string;
  totalStock: number;
}

export interface Checklist {
  id: string;
  epsId: string;
  date: string;
  lieu: string;
  score?: number;
  items: string;
  realiseePar?: string;
  observations?: string;
}

// Données par défaut
const defaultEPS: EPS = {
  id: 'eps-001',
  name: "Hôpital de Référence d'Abidjan Nord",
  code: 'EPS-ABJ-001',
  type: 'HOPITAL',
  region: 'Abidjan',
  district: 'Abidjan 1',
  adresse: 'Abidjan Nord, Côte d\'Ivoire',
  telephone: '+225 27 22 00 00 00',
  email: 'contact@eps-abidjan-nord.ci',
};

// Store en mémoire
class MockDataStore {
  private users: User[] = [
    { id: 'u1', email: 'admin@eps-manager.ci', password: 'admin123', name: 'Administrateur', role: 'ADMIN', epsId: defaultEPS.id },
    { id: 'u2', email: 'directeur@eps-manager.ci', password: 'admin123', name: 'Dr. Kouamé Jean', role: 'DIRECTEUR', epsId: defaultEPS.id },
  ];

  private eps: EPS[] = [defaultEPS];

  private personnel: Personnel[] = [
    { id: 'p1', epsId: defaultEPS.id, matricule: 'MAT001', nom: 'Kouamé', prenom: 'Jean', fonction: 'Médecin', categorie: 'A', specialite: 'Médecine Générale', telephone: '+225 07 00 00 00 01', email: 'kouame.jean@eps.ci', statut: 'ACTIF' },
    { id: 'p2', epsId: defaultEPS.id, matricule: 'MAT002', nom: 'Kone', prenom: 'Mariam', fonction: 'Infirmier', categorie: 'B', specialite: 'Soins Infirmiers', telephone: '+225 07 00 00 00 02', email: 'kone.mariam@eps.ci', statut: 'ACTIF' },
    { id: 'p3', epsId: defaultEPS.id, matricule: 'MAT003', nom: 'Diallo', prenom: 'Abdoulaye', fonction: 'Pharmacien', categorie: 'A', specialite: 'Pharmacie', telephone: '+225 07 00 00 00 03', email: 'diallo.abdoulaye@eps.ci', statut: 'ACTIF' },
    { id: 'p4', epsId: defaultEPS.id, matricule: 'MAT004', nom: 'Bamba', prenom: 'Aissata', fonction: 'Sage-femme', categorie: 'B', specialite: 'Obstétrique', telephone: '+225 07 00 00 00 04', email: 'bamba.aissata@eps.ci', statut: 'CONGE' },
    { id: 'p5', epsId: defaultEPS.id, matricule: 'MAT005', nom: 'Traoré', prenom: 'Lassina', fonction: 'Agent d\'hygiène', categorie: 'C', telephone: '+225 07 00 00 00 05', email: 'traore.lassina@eps.ci', statut: 'ACTIF' },
  ];

  private patients: Patient[] = [
    { id: 'pat1', epsId: defaultEPS.id, numero: 'EPS-2024-00001', nom: 'Koné', prenom: 'Mariam', dateNaiss: '1990-05-15', genre: 'FEMININ', telephone: '07 00 00 00 01', adresse: 'Abidjan' },
    { id: 'pat2', epsId: defaultEPS.id, numero: 'EPS-2024-00002', nom: 'Diallo', prenom: 'Abdoulaye', dateNaiss: '1985-08-20', genre: 'MASCULIN', telephone: '07 00 00 00 02', adresse: 'Yopougon' },
    { id: 'pat3', epsId: defaultEPS.id, numero: 'EPS-2024-00003', nom: 'Bamba', prenom: 'Aissata', dateNaiss: '2019-03-10', genre: 'FEMININ', telephone: '07 00 00 00 03', adresse: 'Cocody' },
    { id: 'pat4', epsId: defaultEPS.id, numero: 'EPS-2024-00004', nom: 'Traoré', prenom: 'Lassina', dateNaiss: '1975-12-25', genre: 'MASCULIN', telephone: '07 00 00 00 04', adresse: 'Plateau' },
    { id: 'pat5', epsId: defaultEPS.id, numero: 'EPS-2024-00005', nom: 'Koffi', prenom: 'Adélaïde', dateNaiss: '1995-07-08', genre: 'FEMININ', telephone: '07 00 00 00 05', adresse: 'Treichville' },
  ];

  private transactions: Transaction[] = [
    { id: 't1', epsId: defaultEPS.id, type: 'RECETTE', categorie: 'Subvention PBF', montant: 5000000, description: 'Subvention mensuelle PBF', date: new Date().toISOString() },
    { id: 't2', epsId: defaultEPS.id, type: 'RECETTE', categorie: 'Consultations', montant: 750000, description: 'Recettes consultations janvier', date: new Date().toISOString() },
    { id: 't3', epsId: defaultEPS.id, type: 'DEPENSE', categorie: 'Salaires', montant: 3500000, description: 'Salaires du personnel', date: new Date().toISOString() },
    { id: 't4', epsId: defaultEPS.id, type: 'DEPENSE', categorie: 'Médicaments', montant: 1200000, description: 'Achat de médicaments', date: new Date().toISOString() },
  ];

  private produits: Produit[] = [
    { id: 'prod1', epsId: defaultEPS.id, code: 'MED001', nom: 'Paracétamol 500mg', categorie: 'MEDICAMENT', unite: 'comprimé', seuilAlerte: 100, prixUnitaire: 500, totalStock: 250 },
    { id: 'prod2', epsId: defaultEPS.id, code: 'MED002', nom: 'Amoxicilline 1g', categorie: 'MEDICAMENT', unite: 'comprimé', seuilAlerte: 50, prixUnitaire: 1200, totalStock: 35 },
    { id: 'prod3', epsId: defaultEPS.id, code: 'MED003', nom: 'Seringues 5ml', categorie: 'CONSOMMABLE', unite: 'pièce', seuilAlerte: 200, prixUnitaire: 150, totalStock: 450 },
    { id: 'prod4', epsId: defaultEPS.id, code: 'MED004', nom: 'Gants latex M', categorie: 'CONSOMMABLE', unite: 'paire', seuilAlerte: 100, prixUnitaire: 300, totalStock: 75 },
    { id: 'prod5', epsId: defaultEPS.id, code: 'MED005', nom: 'Dextrose 5%', categorie: 'MEDICAMENT', unite: 'flacon', seuilAlerte: 20, prixUnitaire: 2500, totalStock: 8 },
  ];

  private checklists: Checklist[] = [
    { id: 'c1', epsId: defaultEPS.id, date: new Date().toISOString(), lieu: 'Salle de soins', score: 85, items: JSON.stringify([true, true, true, false, true, true, true, true]), realiseePar: 'Traoré Lassina' },
    { id: 'c2', epsId: defaultEPS.id, date: new Date(Date.now() - 86400000).toISOString(), lieu: 'Pharmacie', score: 90, items: JSON.stringify([true, true, true, true, true, true, true, true]), realiseePar: 'Traoré Lassina' },
  ];

  // Méthodes
  getUser(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getEPS(id?: string): EPS[] {
    if (id) return this.eps.filter(e => e.id === id);
    return this.eps;
  }

  getPersonnel(epsId: string): Personnel[] {
    return this.personnel.filter(p => p.epsId === epsId);
  }

  createPersonnel(data: Omit<Personnel, 'id'>): Personnel {
    const personnel: Personnel = { ...data, id: uuidv4() };
    this.personnel.push(personnel);
    return personnel;
  }

  updatePersonnel(id: string, data: Partial<Personnel>): Personnel | undefined {
    const idx = this.personnel.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.personnel[idx] = { ...this.personnel[idx], ...data };
    return this.personnel[idx];
  }

  deletePersonnel(id: string): boolean {
    const idx = this.personnel.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.personnel.splice(idx, 1);
    return true;
  }

  getPatients(epsId: string): Patient[] {
    return this.patients.filter(p => p.epsId === epsId);
  }

  createPatient(data: Omit<Patient, 'id'>): Patient {
    const patient: Patient = { ...data, id: uuidv4() };
    this.patients.push(patient);
    return patient;
  }

  getTransactions(epsId: string): { transactions: Transaction[]; totaux: { recettes: number; depenses: number; solde: number } } {
    const trans = this.transactions.filter(t => t.epsId === epsId);
    const recettes = trans.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
    const depenses = trans.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.montant, 0);
    return { transactions: trans, totaux: { recettes, depenses, solde: recettes - depenses } };
  }

  createTransaction(data: Omit<Transaction, 'id'>): Transaction {
    const transaction: Transaction = { ...data, id: uuidv4() };
    this.transactions.push(transaction);
    return transaction;
  }

  getProduits(epsId: string): Produit[] {
    return this.produits.filter(p => p.epsId === epsId).map(p => ({
      ...p,
      alertStock: p.totalStock <= p.seuilAlerte,
    }));
  }

  createProduit(data: Omit<Produit, 'id' | 'totalStock'>): Produit {
    const produit: Produit = { ...data, id: uuidv4(), totalStock: 0 };
    this.produits.push(produit);
    return { ...produit, alertStock: true };
  }

  updateStock(produitId: string, quantite: number, type: 'ENTREE' | 'SORTIE'): Produit | undefined {
    const idx = this.produits.findIndex(p => p.id === produitId);
    if (idx === -1) return undefined;
    if (type === 'ENTREE') {
      this.produits[idx].totalStock += quantite;
    } else {
      this.produits[idx].totalStock = Math.max(0, this.produits[idx].totalStock - quantite);
    }
    return { ...this.produits[idx], alertStock: this.produits[idx].totalStock <= this.produits[idx].seuilAlerte };
  }

  getChecklists(epsId: string): Checklist[] {
    return this.checklists.filter(c => c.epsId === epsId);
  }

  createChecklist(data: Omit<Checklist, 'id'>): Checklist {
    const checklist: Checklist = { ...data, id: uuidv4() };
    this.checklists.push(checklist);
    return checklist;
  }
}

// Singleton
export const mockStore = new MockDataStore();