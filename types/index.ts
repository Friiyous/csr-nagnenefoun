// Types TypeScript pour EPS Manager

// Rôles utilisateurs (legacy)
export type Role = 
  | 'ADMIN'
  | 'DIRECTEUR'
  | 'CHEF_SERVICE'
  | 'MEDECIN'
  | 'INFIRMIER'
  | 'PHARMACIEN'
  | 'AGENT_ADMIN'
  | 'AGENT_HYGIENE'
  | 'AGENT';

// Nouveaux rôles avec permissions granulaires (importés depuis roles.ts)
export type { UserRole, RolePermissions } from './roles';
export { ROLE_PERMISSIONS, ROLE_LABELS, ROLE_COLORS } from './roles';

// Types d'EPS
export type EPSType = 
  | 'CSR'      // Centre de Santé de Référence
  | 'CSU'      // Centre de Santé Urbain
  | 'CSRURAL'  // Centre de Santé Rural
  | 'HOPITAL'  // Hôpital
  | 'DISPENSAIRE'; // Dispensaire

// Statut du personnel
export type StatutPersonnel = 
  | 'ACTIF'
  | 'CONGE'
  | 'MISSION'
  | 'SUSPENDU'
  | 'RETRAITE';

// Types de congés
export type TypeConge = 
  | 'ANNUEL'
  | 'MALADIE'
  | 'MATERNITE'
  | 'PATERNITE'
  | 'SANS_SOLDE'
  | 'AUTRE';

// Statut de congé
export type StatutConge = 
  | 'EN_ATTENTE'
  | 'APPROUVE'
  | 'REFUSE';

// Types de gardes
export type TypeGarde = 
  | 'JOUR'
  | 'NUIT'
  | 'WEEKEND'
  | 'FERIE';

// Genre
export type Genre = 'MASCULIN' | 'FEMININ';

// Types de transactions
export type TypeTransaction = 'RECETTE' | 'DEPENSE' | 'TRANSFERT';

// Types de mouvements de stock
export type TypeMouvement = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'PEREMPTION';

// Catégories (Fonction publique)
export type CategoriePersonnel = 'A' | 'B' | 'C' | 'D';

// Régions de Côte d'Ivoire
export type RegionCI = 
  | 'Abidjan'
  | 'Bas-Sassandra'
  | 'Comoe'
  | 'Denguélé'
  | 'Gôh-Djiboua'
  | 'Lacs'
  | 'Lagunes'
  | 'Montagnes'
  | 'Sassandra-Marahoué'
  | 'Savanes'
  | 'Vallée du Bandama'
  | 'Woroba'
  | 'Yamoussoukro'
  | 'Zanzan';

// Interfaces du domaine

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  epsId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EPS {
  id: string;
  name: string;
  code: string;
  type: EPSType;
  region: string;
  district: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Personnel {
  id: string;
  epsId: string;
  matricule: string;
  nom: string;
  prenom: string;
  fonction: string;
  categorie: CategoriePersonnel;
  specialite?: string;
  telephone?: string;
  email?: string;
  statut: StatutPersonnel;
  dateRecrutement?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  epsId: string;
  numero: string;
  nom: string;
  prenom: string;
  dateNaiss: Date;
  lieuNaiss?: string;
  genre: Genre;
  telephone?: string;
  adresse?: string;
  personneContact?: string;
  telephoneContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: Date;
  motif: string;
  diagnostic?: string;
  traitement?: string;
  compteRendu?: string;
  medecinId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndicateurPBF {
  id: string;
  epsId?: string;
  code: string;
  nom: string;
  description?: string;
  ponderation: number;
  unite: string;
  prixUnitaire: number;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RealisationPBF {
  id: string;
  epsId: string;
  indicateurId: string;
  periode: Date;
  quantite: number;
  montantCalcule: number;
  valide: boolean;
  validePar?: string;
  dateValidation?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  epsId: string;
  type: TypeTransaction;
  categorie: string;
  montant: number;
  description?: string;
  date: Date;
  reference?: string;
  createdAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  id: string;
  produitId: string;
  quantite: number;
  datePeremption?: Date;
  lot?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistHygiene {
  id: string;
  epsId: string;
  date: Date;
  lieu: string;
  score?: number;
  items: string;
  realiseePar?: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les statistiques
export interface KPI {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Types pour les formulaires
export interface LoginForm {
  email: string;
  password: string;
}

export interface PersonnelForm {
  matricule: string;
  nom: string;
  prenom: string;
  fonction: string;
  categorie: CategoriePersonnel;
  specialite?: string;
  telephone?: string;
  email?: string;
}

export interface PatientForm {
  numero: string;
  nom: string;
  prenom: string;
  dateNaiss: Date;
  lieuNaiss?: string;
  genre: Genre;
  telephone?: string;
  adresse?: string;
  personneContact?: string;
  telephoneContact?: string;
}

// Types pour l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}