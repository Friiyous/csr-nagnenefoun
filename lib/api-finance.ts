// API Finance et PBF pour Supabase
import { supabase } from './supabase';

const EPS_ID = 'demo-eps-id'; // À remplacer par l'ID réel

// Indicateurs PBF standards
export const INDICATEURS_PBF = [
  { code: 'PBF-CONS-C', libelle: 'Consultation curative', unite: 'consultation', prix: 500, cible: 500 },
  { code: 'PBF-CPN1', libelle: 'CPN1 - 1ère visite', unite: 'consultation', prix: 2000, cible: 100 },
  { code: 'PBF-CPN2', libelle: 'CPN2 - 2ème visite', unite: 'consultation', prix: 1500, cible: 100 },
  { code: 'PBF-CPN3', libelle: 'CPN3 - 3ème visite et plus', unite: 'consultation', prix: 1500, cible: 100 },
  { code: 'PBF-ACCOU-E', libelle: 'Accouchement eutocique', unite: 'accouchement', prix: 5000, cible: 30 },
  { code: 'PBF-ACCOU-C', libelle: 'Accouchement par Césarienne', unite: 'accouchement', prix: 15000, cible: 10 },
  { code: 'PBF-PREPA', libelle: 'Prise en charge enfant 0-11 mois', unite: 'enfant', prix: 1000, cible: 200 },
  { code: 'PBF-PREP11', libelle: 'Prise en charge enfant 12-59 mois', unite: 'enfant', prix: 500, cible: 200 },
  { code: 'PBF-VACC-C', libelle: 'Vaccination complète (0-11 mois)', unite: 'enfant', prix: 3000, cible: 100 },
  { code: 'PBF-CSO', libelle: 'Consultation externe', unite: 'consultation', prix: 500, cible: 300 },
  { code: 'PBF-URG', libelle: 'Urgence', unite: 'consultation', prix: 1000, cible: 50 },
  { code: 'PBF-LABO', libelle: 'Examen de laboratoire', unite: 'examen', prix: 800, cible: 100 },
];

// === INDICATEURS PBF ===
export const indicateursApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('indicateurs_pbf')
      .select('*')
      .eq('actif', true)
      .order('code');
    
    if (error) throw error;
    return data || [];
  },
};

// === REALISATIONS PBF ===
export const realisationsApi = {
  async getByPeriode(periode: string) {
    const { data, error } = await supabase
      .from('realisations_pbf')
      .select('*, indicateur:indicateurs_pbf(*)')
      .eq('eps_id', EPS_ID)
      .eq('periode', periode);
    
    if (error) throw error;
    return data || [];
  },

  async create(realisation: {
    indicateur_id: string;
    quantite: number;
    montant_calcule: number;
    periode: string;
  }) {
    const { data, error } = await supabase
      .from('realisations_pbf')
      .insert({
        ...realisation,
        eps_id: EPS_ID,
        valide: false,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async validate(id: string, niveau: 'CS' | 'DIR') {
    const { data, error } = await supabase
      .from('realisations_pbf')
      .update({
        valide: true,
        valide_par: 'user-id', // À remplacer par l'ID de l'utilisateur connecté
        date_validation: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateQuantite(id: string, quantite: number, indicateurCode: string) {
    const indicateur = INDICATEURS_PBF.find(i => i.code === indicateurCode);
    const montant = quantite * (indicateur?.prix || 0);
    
    const { data, error } = await supabase
      .from('realisations_pbf')
      .update({ quantite, montant_calcule: montant })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// === TRANSACTIONS ===
export const transactionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('eps_id', EPS_ID)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(transaction: {
    type: 'RECETTE' | 'DEPENSE' | 'TRANSFERT';
    categorie: string;
    montant: number;
    description?: string;
    date: string;
    reference?: string;
  }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        eps_id: EPS_ID,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStats(periode?: string) {
    let query = supabase
      .from('transactions')
      .select('type, montant')
      .eq('eps_id', EPS_ID);
    
    if (periode) {
      query = query.eq('date', periode);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const recettes = data.filter(t => t.type === 'RECETTE').reduce((sum, t) => sum + t.montant, 0);
    const depenses = data.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.montant, 0);
    
    return {
      recettes,
      depenses,
      solde: recettes - depenses,
    };
  },
};

// === RAPPORTS ===
export const rapportsApi = {
  async generateMensuel(periode: string) {
    const realisations = await realisationsApi.getByPeriode(periode);
    const stats = await transactionsApi.getStats(periode);
    
    const totalPBF = realisations.reduce((sum, r) => sum + (r.montant_calcule || 0), 0);
    
    return {
      periode,
      dateGeneration: new Date().toISOString(),
      totalPBF,
      totalRealisations: realisations.length,
      statsFinancieres: stats,
      indicateurs: INDICATEURS_PBF.map(ind => {
        const real = realisations.find(r => r.indicateur?.code === ind.code);
        return {
          ...ind,
          quantite: real?.quantite || 0,
          montant: real?.montant_calcule || 0,
          tauxRealisation: ind.cible > 0 ? ((real?.quantite || 0) / ind.cible) * 100 : 0,
        };
      }),
    };
  },

  async exportPDF(periode: string) {
    const rapport = await rapportsApi.generateMensuel(periode);
    // Ici on pourrait générer un PDF avec une bibliothèque comme jspdf
    console.log('Export PDF pour:', rapport);
    return rapport;
  },
};