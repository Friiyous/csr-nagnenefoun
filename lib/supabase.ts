import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour Supabase (alignés avec schema Prisma + tables existantes)
export interface EPS {
  id: string;
  name: string;
  code: string;
  type: 'CSR' | 'CSU' | 'CSRURAL' | 'HOPITAL' | 'DISPENSAIRE';
  region: string;
  district: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface User {
  id: string;
  eps_id?: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DIRECTEUR' | 'CHEF_SERVICE' | 'MEDECIN' | 'INFIRMIER' | 'PHARMACIEN' | 'AGENT_ADMIN' | 'AGENT_HYGIENE' | 'AGENT';
  avatar?: string;
}

export interface Personnel {
  id: string;
  eps_id: string;
  matricule: string;
  nom: string;
  prenom: string;
  fonction: string;
  categorie: 'A' | 'B' | 'C' | 'D';
  specialite?: string;
  telephone?: string;
  email?: string;
  statut: 'ACTIF' | 'CONGE' | 'MISSION' | 'SUSPENDU' | 'RETRAITE';
}

export interface Conge {
  id: string;
  personnel_id: string;
  type: 'ANNUEL' | 'MALADIE' | 'MATERNITE' | 'PATERNITE' | 'SANS_SOLDE' | 'AUTRE';
  date_debut: string;
  date_fin: string;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';
  motif?: string;
}

export interface Garde {
  id: string;
  personnel_id: string;
  date: string;
  type: 'JOUR' | 'NUIT' | 'WEEKEND' | 'FERIE';
  service?: string;
}

export interface Patient {
  id: string;
  eps_id: string;
  numero: string;
  nom: string;
  prenom: string;
  date_naiss: string;
  lieu_naiss?: string;
  genre: 'MASCULIN' | 'FEMININ';
  telephone?: string;
  adresse?: string;
  personne_contact?: string;
  telephone_contact?: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  date: string;
  motif: string;
  diagnostic?: string;
  traitement?: string;
  compte_rendu?: string;
}

export interface Transaction {
  id: string;
  eps_id: string;
  type: 'RECETTE' | 'DEPENSE' | 'TRANSFERT';
  categorie: string;
  montant: number;
  description?: string;
  date: string;
  reference?: string;
}

export interface Produit {
  id: string;
  eps_id: string;
  code: string;
  nom: string;
  categorie: string;
  unite: string;
  seuil_alerte: number;
  prix_unitaire?: number;
  stockage?: string;
  total_stock: number;
}

export interface MouvementStock {
  id: string;
  produit_id: string;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'PEREMPTION';
  quantite: number;
  motif?: string;
  date: string;
}

export interface ChecklistHygiene {
  id: string;
  eps_id: string;
  date: string;
  lieu: string;
  score?: number;
  items: any;
  realisee_par?: string;
  observations?: string;
}

export interface Archive {
  id: string;
  eps_id: string;
  titre: string;
  type: 'RAPPORT' | 'DOCUMENT' | 'INVENTAIRE' | 'PROTOCOLE' | 'LISTE';
  categorie: 'PBF' | 'ADMINISTRATION' | 'PHARMACIE' | 'HYGIENE' | 'RH';
  date: string;
  format: string;
  auteur: string;
  fichier_url?: string;
}

export interface IndicateurPBF {
  id: string;
  code: string;
  nom: string;
  description?: string;
  ponderation: number;
  unite: string;
  prix_unitaire: number;
  actif: boolean;
}

export interface RealisationPBF {
  id: string;
  eps_id: string;
  indicateur_id: string;
  periode: string;
  quantite: number;
  montant_calcule: number;
  valide: boolean;
}

export interface Region {
  id: string;
  nom: string;
  code: string;
}

export interface District {
  id: string;
  region_id: string;
  nom: string;
  code: string;
}

export default supabase;