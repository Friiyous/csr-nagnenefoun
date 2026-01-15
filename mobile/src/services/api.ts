import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// === EPS ===
export const getEPS = async () => {
  const { data } = await api.get('/eps');
  return data;
};

// === USERS ===
export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// === PERSONNEL ===
export const getPersonnel = async (params?: { search?: string; statut?: string }) => {
  const { data } = await api.get('/personnel', { params });
  return data;
};

// === PATIENTS ===
export const getPatients = async (params?: { page?: number; search?: string }) => {
  const { data } = await api.get('/patients', { params });
  return data;
};

export const createPatient = async (patient: {
  numero: string;
  nom: string;
  prenom: string;
  date_naiss: string;
  genre: string;
  telephone?: string;
  adresse?: string;
}) => {
  const { data } = await api.post('/patients', patient);
  return data;
};

// === TRANSACTIONS ===
export const getTransactions = async (params?: { type?: string; start_date?: string }) => {
  const { data } = await api.get('/transactions', { params });
  return data;
};

export const createTransaction = async (transaction: {
  type: 'RECETTE' | 'DEPENSE' | 'TRANSFERT';
  categorie: string;
  montant: number;
  description?: string;
  date: string;
}) => {
  const { data } = await api.post('/transactions', transaction);
  return data;
};

// === FINANCE STATS ===
export const getFinanceStats = async () => {
  const { data } = await api.get('/finance/stats');
  return data;
};

// === PRODUITS ===
export const getProduits = async (params?: { categorie?: string; search?: string }) => {
  const { data } = await api.get('/produits', { params });
  return data;
};

export const createMouvement = async (mouvement: {
  produit_id: string;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'PEREMPTION';
  quantite: number;
  motif?: string;
}) => {
  const { data } = await api.post('/mouvements', mouvement);
  return data;
};

// === HYGIENE ===
export const getChecklists = async (params?: { eps_id?: string }) => {
  const { data } = await api.get('/checklists', { params });
  return data;
};

export const createChecklist = async (checklist: {
  eps_id: string;
  lieu: string;
  items: any;
  score?: number;
}) => {
  const { data } = await api.post('/checklists', checklist);
  return data;
};

// === PBF ===
export const getIndicateurs = async () => {
  const { data } = await api.get('/indicateurs');
  return data;
};

export const getRealisations = async (params?: { eps_id?: string; periode?: string }) => {
  const { data } = await api.get('/realisations', { params });
  return data;
};

export const createRealisation = async (realisation: {
  eps_id: string;
  indicateur_id: string;
  periode: string;
  quantite: number;
}) => {
  const { data } = await api.post('/realisations', realisation);
  return data;
};

// === AUTH ===
export const signIn = async (email: string, password: string) => {
  const { data } = await api.post('/auth/signin', { email, password });
  return data;
};

export const signUp = async (userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  eps_id?: string;
}) => {
  const { data } = await api.post('/auth/signup', userData);
  return data;
};

export default api;