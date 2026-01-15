// API EPS Manager avec Supabase
import { supabase, type Personnel, type Conge, type Garde, type Transaction, type Produit, type Archive } from './supabase';

const EPS_ID = 'demo-eps-id'; // À remplacer par l'ID réel de l'EPS

// === PERSONNEL ===
export const personnelApi = {
  async getAll(): Promise<Personnel[]> {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('eps_id', EPS_ID)
      .order('nom');
    
    if (error) throw error;
    return data || [];
  },

  async create(personnel: Omit<Personnel, 'id' | 'eps_id' | 'created_at' | 'updated_at'>): Promise<Personnel> {
    const { data, error } = await supabase
      .from('personnel')
      .insert({ ...personnel, eps_id: EPS_ID })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Personnel>): Promise<Personnel> {
    const { data, error } = await supabase
      .from('personnel')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('personnel')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// === CONGÉS ===
export const congesApi = {
  async getAll(): Promise<Conge[]> {
    const { data, error } = await supabase
      .from('conges')
      .select('*, personnel:personnel_id(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(conge: Omit<Conge, 'id' | 'created_at' | 'updated_at'>): Promise<Conge> {
    const { data, error } = await supabase
      .from('conges')
      .insert(conge)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async approve(id: string): Promise<Conge> {
    const { data, error } = await supabase
      .from('conges')
      .update({ statut: 'APPROUVE' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// === GARDES ===
export const gardesApi = {
  async getByDate(date: string): Promise<Garde[]> {
    const { data, error } = await supabase
      .from('gardes')
      .select('*, personnel:personnel_id(*)')
      .eq('date', date);
    
    if (error) throw error;
    return data || [];
  },

  async create(garde: Omit<Garde, 'id' | 'created_at'>): Promise<Garde> {
    const { data, error } = await supabase
      .from('gardes')
      .insert(garde)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('gardes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// === TRANSACTIONS ===
export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('eps_id', EPS_ID)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(transaction: Omit<Transaction, 'id' | 'eps_id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, eps_id: EPS_ID })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// === PRODUITS ===
export const produitsApi = {
  async getAll(): Promise<Produit[]> {
    const { data, error } = await supabase
      .from('produits')
      .select('*')
      .eq('eps_id', EPS_ID)
      .order('nom');
    
    if (error) throw error;
    return data || [];
  },

  async create(produit: Omit<Produit, 'id' | 'eps_id' | 'created_at' | 'updated_at'>): Promise<Produit> {
    const { data, error } = await supabase
      .from('produits')
      .insert({ ...produit, eps_id: EPS_ID })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStock(id: string, totalStock: number): Promise<Produit> {
    const { data, error } = await supabase
      .from('produits')
      .update({ total_stock: totalStock })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// === ARCHIVES ===
export const archivesApi = {
  async getAll(): Promise<Archive[]> {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('eps_id', EPS_ID)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(archive: Omit<Archive, 'id' | 'eps_id' | 'created_at' | 'updated_at'>): Promise<Archive> {
    const { data, error } = await supabase
      .from('archives')
      .insert({ ...archive, eps_id: EPS_ID })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async uploadFile(file: File): Promise<string> {
    const fileName = `${EPS_ID}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('archives')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: url } = supabase.storage
      .from('archives')
      .getPublicUrl(data.path);
    
    return url.publicUrl;
  },
};

// === STATISTIQUES ===
export const statsApi = {
  async getDashboardStats() {
    const [personnel, transactions, produits] = await Promise.all([
      personnelApi.getAll(),
      transactionsApi.getAll(),
      produitsApi.getAll(),
    ]);

    const totalPersonnel = personnel.length;
    const totalPatients = 128; // À implémenter avec table patients
    const totalRevenus = transactions
      .filter(t => t.type === 'RECETTE')
      .reduce((sum, t) => sum + t.montant, 0);
    const alertesStock = produits.filter(p => p.total_stock <= p.seuil_alerte).length;

    return {
      personnel: totalPersonnel,
      patients: totalPatients,
      revenus: totalRevenus,
      medicaments: alertesStock,
    };
  },
};