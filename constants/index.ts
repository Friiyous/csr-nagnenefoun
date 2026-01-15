// Constantes pour EPS Manager

// Régions de Côte d'Ivoire
export const REGIONS_CI = [
  'Abidjan',
  'Bas-Sassandra',
  'Comoé',
  'Denguélé',
  'Gôh-Djiboua',
  'Lacs',
  'Lagunes',
  'Montagnes',
  'Poro',
  'Sassandra-Marahoué',
  'Savanes',
  'Vallée du Bandama',
  'Woroba',
  'Zanzan',
] as const;

// Districts par région (exemples)
export const DISTRICTS: Record<string, string[]> = {
  'Abidjan': ['Abidjan 1', 'Abidjan 2', 'Abidjan 3', 'Abidjan 4'],
  'Bas-Sassandra': ['Sassandra', 'San-Pedro', 'Soubr'],
  'Comoe': ['Abengourou', 'Bouna', 'Bondoukou'],
  'Denguélé': ['Odienné'],
  'Gôh-Djiboua': ['Gagnoa', 'Daloa'],
  'Lacs': ['Dimbokro', 'Toumodi', 'Yamoussoukro'],
  'Lagunes': ['Agboville', 'Dabou', 'Grand-Lahou'],
  'Montagnes': ['Man', 'Duékoué', 'Bangolo'],
  'Poro': ['Korhogo', 'M'Bengué', 'Sinématiali', 'Koumporodougou'],
  'Sassandra-Marahoué': ['Bouaflé', 'Sinfra', 'Zuénoula'],
  'Savanes': ['Korhogo', 'Boundiali', 'Ferkessédougou'],
  'Vallée du Bandama': ['Bouaké', 'Séguéla', 'Mankono'],
  'Woroba': ['Sikensi', 'Touba', 'Minignan'],
  'Yamoussoukro': ['Yamoussoukro'],
  'Zanzan': ['Bouna', 'Tanda', 'Bongouanou'],
};

// Types d'EPS
export const TYPES_EPS = [
  { value: 'CSR', label: 'Centre de Santé de Référence' },
  { value: 'CSU', label: 'Centre de Santé Urbain' },
  { value: 'CSRURAL', label: 'Centre de Santé Rural' },
  { value: 'HOPITAL', label: 'Hôpital' },
  { value: 'DISPENSAIRE', label: 'Dispensaire' },
];

// Catégories (Fonction publique)
export const CATEGORIES = [
  { value: 'A', label: 'A - Cadres supérieurs' },
  { value: 'B', label: 'B - Cadres moyens' },
  { value: 'C', label: 'C - Employés' },
  { value: 'D', label: 'D - Ouvriers' },
];

// Rôles
export const ROLES = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'DIRECTEUR', label: 'Directeur d\'EPS' },
  { value: 'CHEF_SERVICE', label: 'Chef de service' },
  { value: 'MEDECIN', label: 'Médecin' },
  { value: 'INFIRMIER', label: 'Infirmier/ère' },
  { value: 'PHARMACIEN', label: 'Pharmacien' },
  { value: 'AGENT_ADMIN', label: 'Agent administratif' },
  { value: 'AGENT_HYGIENE', label: 'Agent d\'hygiène' },
  { value: 'AGENT', label: 'Agent' },
];

// Types de congés
export const TYPES_CONGE = [
  { value: 'ANNUEL', label: 'Congé annuel' },
  { value: 'MALADIE', label: 'Congé maladie' },
  { value: 'MATERNITE', label: 'Congé maternité' },
  { value: 'PATERNITE', label: 'Congé paternité' },
  { value: 'SANS_SOLDE', label: 'Congé sans solde' },
  { value: 'AUTRE', label: 'Autre' },
];

// Statuts de personnel
export const STATUTS_PERSONNEL = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'CONGE', label: 'En congé' },
  { value: 'MISSION', label: 'En mission' },
  { value: 'SUSPENDU', label: 'Suspendu' },
  { value: 'RETRAITE', label: 'Retraité' },
];

// Statuts de congé
export const STATUTS_CONGE = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'APPROUVE', label: 'Approuvé' },
  { value: 'REFUSE', label: 'Refusé' },
];

// Types de transactions
export const TYPES_TRANSACTION = [
  { value: 'RECETTE', label: 'Recette' },
  { value: 'DEPENSE', label: 'Dépense' },
  { value: 'TRANSFERT', label: 'Transfert' },
];

// Catégories de transactions financières
export const CATEGORIES_TRANSACTION = {
  RECETTE: ['Subvention PBF', 'Consultations', 'Médicaments', 'Autres'],
  DEPENSE: ['Salaires', 'Médicaments', 'Matériel', 'Fonctionnement', 'Autres'],
  TRANSFERT: ['Versement', 'Remboursement', 'Avance'],
};

// Indicateurs PBF standards
export const INDICATEURS_PBF_STANDARDS = [
  { code: 'PBF001', nom: 'Consultation curative enfant < 5 ans', ponderation: 1.5, unite: 'consultation', prixUnitaire: 1500 },
  { code: 'PBF002', nom: 'Consultation prénatale', ponderation: 1.0, unite: 'consultation', prixUnitaire: 2000 },
  { code: 'PBF003', nom: 'Accouchement assisté', ponderation: 3.0, unite: 'accouchement', prixUnitaire: 15000 },
  { code: 'PBF004', nom: 'Vaccination complète', ponderation: 1.0, unite: 'enfant', prixUnitaire: 5000 },
  { code: 'PBF005', nom: 'Planification familiale', ponderation: 1.0, unite: 'consultation', prixUnitaire: 2500 },
  { code: 'PBF006', nom: 'Consultation curative adulte', ponderation: 0.8, unite: 'consultation', prixUnitaire: 1000 },
  { code: 'PBF007', nom: 'Hospitalisation', ponderation: 2.0, unite: 'journée', prixUnitaire: 5000 },
  { code: 'PBF008', nom: 'Chirurgie mineure', ponderation: 2.5, unite: 'intervention', prixUnitaire: 10000 },
];

// Catégories de produits pharmaceutiques
export const CATEGORIES_PRODUIT = [
  { value: 'MEDICAMENT', label: 'Médicament' },
  { value: 'CONSOMMABLE', label: 'Consommable médical' },
  { value: 'MATERIEL', label: 'Matériel médical' },
  { value: 'PRODUIT_HYGIENE', label: 'Produit d\'hygiène' },
  { value: 'REACTIF', label: 'Réactif de laboratoire' },
];

// Items de checklist d'hygiène
export const HYGIENE_CHECKLIST_ITEMS = [
  'Lavage des mains effectué',
  'Surfaces nettoyées et désinfectées',
  'Équipements stérilisés',
  'Déchets éliminés correctement',
  'Stockage adapté des produits',
  'Port des EPI respecté',
  'Circuits propres/sales respectés',
  'Température des réfrigérateur contrôlée',
];

// Navigation - Items du menu
export const NAV_ITEMS = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: 'LayoutDashboard',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'MEDECIN', 'INFIRMIER', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Ressources Humaines', 
    href: '/dashboard/modules/rh', 
    icon: 'Users',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Congés', 
    href: '/dashboard/modules/conges', 
    icon: 'Calendar',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Gardes', 
    href: '/dashboard/modules/gardes', 
    icon: 'Clock',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'MEDECIN', 'INFIRMIER', 'AGENT_HYGIENE'] 
  },
  { 
    label: 'Finance & PBF', 
    href: '/dashboard/modules/finance', 
    icon: 'DollarSign',
    roles: ['ADMIN', 'DIRECTEUR', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Pharmacie', 
    href: '/dashboard/modules/pharmacie', 
    icon: 'Pill',
    roles: ['ADMIN', 'DIRECTEUR', 'PHARMACIEN', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Hygiène', 
    href: '/dashboard/modules/hygiene', 
    icon: 'Sparkles',
    roles: ['ADMIN', 'DIRECTEUR', 'AGENT_HYGIENE', 'CHEF_SERVICE'] 
  },
  { 
    label: 'Archives', 
    href: '/dashboard/modules/archives', 
    icon: 'Archive',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Statistiques', 
    href: '/dashboard/modules/stats', 
    icon: 'BarChart3',
    roles: ['ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'AGENT_ADMIN'] 
  },
  { 
    label: 'Annuaire', 
    href: '/dashboard/modules/annuaire', 
    icon: 'PhoneBook',
    roles: ['ADMIN', 'DIRECTEUR', 'MEDECIN', 'INFIRMIER', 'PHARMACIEN', 'AGENT_HYGIENE', 'AGENT_ADMIN', 'AGENT'] 
  },
];

// Messages d'erreur
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_EMAIL: 'Email invalide',
  INVALID_PASSWORD: 'Mot de passe incorrect',
  UNAUTHORIZED: 'Non autorisé',
  SERVER_ERROR: 'Erreur serveur',
  NOT_FOUND: 'Ressource non trouvée',
  CONFLICT: 'Conflit de données',
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  CREATED: 'Créé avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
  SAVED: 'Sauvegardé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
};