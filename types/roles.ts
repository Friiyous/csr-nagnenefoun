// Types pour la gestion des rôles et permissions

export type UserRole = 
  | 'ADMIN'        // Accès total
  | 'DIRECTEUR'    // Direction EPS
  | 'MEDECIN'      // Médecin
  | 'INFIRMIER'    // Infirmier
  | 'PHARMACIEN'   // Pharmacien
  | 'COMPTABLE'    // Gestion financière
  | 'SECRETAIRE'   // Administration
  | 'RH'           // Ressources humaines
  | 'LOGISTIQUE';  // Logistique

export interface RolePermissions {
  dashboard: boolean;
  patients: boolean;
  pbf: boolean;
  pharmacie: boolean;
  hygiene: boolean;
  finance: boolean;
  rh: boolean;
  conges: boolean;
  gardes: boolean;
  archives: boolean;
  users: boolean;
  settings: boolean;
  export: boolean;
  import: boolean;
  print: boolean;
}

// Définition des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  ADMIN: {
    dashboard: true,
    patients: true,
    pbf: true,
    pharmacie: true,
    hygiene: true,
    finance: true,
    rh: true,
    conges: true,
    gardes: true,
    archives: true,
    users: true,
    settings: true,
    export: true,
    import: true,
    print: true,
  },
  DIRECTEUR: {
    dashboard: true,
    patients: true,
    pbf: true,
    pharmacie: true,
    hygiene: true,
    finance: true,
    rh: true,
    conges: true,
    gardes: true,
    archives: true,
    users: true,
    settings: true,
    export: true,
    import: true,
    print: true,
  },
  MEDECIN: {
    dashboard: true,
    patients: true,
    pbf: true,
    pharmacie: true,
    hygiene: true,
    finance: false,
    rh: false,
    conges: true,
    gardes: true,
    archives: true,
    users: false,
    settings: false,
    export: true,
    import: false,
    print: true,
  },
  INFIRMIER: {
    dashboard: true,
    patients: true,
    pbf: true,
    pharmacie: true,
    hygiene: true,
    finance: false,
    rh: false,
    conges: true,
    gardes: true,
    archives: false,
    users: false,
    settings: false,
    export: true,
    import: false,
    print: true,
  },
  PHARMACIEN: {
    dashboard: true,
    patients: false,
    pbf: false,
    pharmacie: true,
    hygiene: true,
    finance: false,
    rh: false,
    conges: true,
    gardes: true,
    archives: true,
    users: false,
    settings: false,
    export: true,
    import: true,
    print: true,
  },
  COMPTABLE: {
    dashboard: true,
    patients: false,
    pbf: true,
    pharmacie: false,
    hygiene: false,
    finance: true,
    rh: false,
    conges: true,
    gardes: false,
    archives: true,
    users: false,
    settings: false,
    export: true,
    import: true,
    print: true,
  },
  SECRETAIRE: {
    dashboard: true,
    patients: true,
    pbf: true,
    pharmacie: false,
    hygiene: false,
    finance: false,
    rh: false,
    conges: true,
    gardes: true,
    archives: true,
    users: false,
    settings: false,
    export: true,
    import: false,
    print: true,
  },
  RH: {
    dashboard: true,
    patients: false,
    pbf: false,
    pharmacie: false,
    hygiene: false,
    finance: false,
    rh: true,
    conges: true,
    gardes: true,
    archives: true,
    users: true,
    settings: false,
    export: true,
    import: true,
    print: true,
  },
  LOGISTIQUE: {
    dashboard: true,
    patients: false,
    pbf: false,
    pharmacie: true,
    hygiene: true,
    finance: false,
    rh: false,
    conges: true,
    gardes: true,
    archives: true,
    users: false,
    settings: false,
    export: true,
    import: true,
    print: true,
  },
};

// Labels display
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  DIRECTEUR: 'Directeur',
  MEDECIN: 'Médecin',
  INFIRMIER: 'Infirmier',
  PHARMACIEN: 'Pharmacien',
  COMPTABLE: 'Comptable',
  SECRETAIRE: 'Secrétaire',
  RH: 'Ressources Humaines',
  LOGISTIQUE: 'Logistique',
};

// Couleurs par rôle
export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  DIRECTEUR: 'bg-purple-100 text-purple-700',
  MEDECIN: 'bg-blue-100 text-blue-700',
  INFIRMIER: 'bg-green-100 text-green-700',
  PHARMACIEN: 'bg-yellow-100 text-yellow-700',
  COMPTABLE: 'bg-orange-100 text-orange-700',
  SECRETAIRE: 'bg-pink-100 text-pink-700',
  RH: 'bg-indigo-100 text-indigo-700',
  LOGISTIQUE: 'bg-cyan-100 text-cyan-700',
};