// Types partagés pour l'application EPS Manager

export type Role = 'ADMIN' | 'DIRECTEUR' | 'CHEF_SERVICE' | 'MEDECIN' | 'INFIRMIER' | 'PHARMACIEN' | 'AGENT_ADMIN' | 'AGENT_HYGIENE' | 'AGENT';

export type EPSType = 'CSR' | 'CSU' | 'CSRURAL' | 'HOPITAL' | 'DISPENSAIRE';

export type StatutPersonnel = 'ACTIF' | 'CONGE' | 'MISSION' | 'SUSPENDU' | 'RETRAITE';

export type TypeConge = 'ANNUEL' | 'MALADIE' | 'MATERNITE' | 'PATERNITE' | 'SANS_SOLDE' | 'AUTRE';

export type StatutConge = 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';

export type TypeGarde = 'JOUR' | 'NUIT' | 'WEEKEND' | 'FERIE';

export type Genre = 'MASCULIN' | 'FEMININ';

export type TypeTransaction = 'RECETTE' | 'DEPENSE' | 'TRANSFERT';

export type TypeMouvement = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'PEREMPTION';

export type CategoriePersonnel = 'A' | 'B' | 'C' | 'D';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  epsId: string;
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
  dateRecrutement?: string;
}

export interface Conge {
  id: string;
  personnelId: string;
  type: TypeConge;
  dateDebut: string;
  dateFin: string;
  statut: StatutConge;
  motif?: string;
}

export interface Garde {
  id: string;
  personnelId: string;
  date: string;
  type: TypeGarde;
  service?: string;
}

export interface Transaction {
  id: string;
  epsId: string;
  type: TypeTransaction;
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
  alertStock: boolean;
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

export interface RegionCI {
  id: string;
  nom: string;
  code: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}