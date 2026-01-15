// Schémas de validation Zod pour les formulaires EPS Manager
import { z } from 'zod';

export const personnelSchema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  fonction: z.string().min(1, 'La fonction est requise'),
  categorie: z.enum(['A', 'B', 'C', 'D']),
  specialite: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  statut: z.enum(['ACTIF', 'CONGE', 'MISSION', 'SUSPENDU', 'RETRAITE']),
  dateRecrutement: z.string().optional(),
});

export const congeSchema = z.object({
  personnelId: z.string().min(1, 'Le personnel est requis'),
  type: z.enum(['ANNUEL', 'MALADIE', 'MATERNITE', 'PATERNITE', 'SANS_SOLDE', 'AUTRE']),
  dateDebut: z.string().min(1, 'La date de début est requise'),
  dateFin: z.string().min(1, 'La date de fin est requise'),
  motif: z.string().optional(),
});

export const transactionSchema = z.object({
  type: z.enum(['RECETTE', 'DEPENSE', 'TRANSFERT']),
  categorie: z.string().min(1, 'La catégorie est requise'),
  montant: z.number().min(0, 'Le montant doit être positif'),
  description: z.string().optional(),
  date: z.string().optional(),
  reference: z.string().optional(),
});

export const produitSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  categorie: z.string().min(1, 'La catégorie est requise'),
  unite: z.string().min(1, 'L\'unité est requise'),
  seuilAlerte: z.number().min(0),
  prixUnitaire: z.number().optional(),
  stockage: z.string().optional(),
});

export const checklistSchema = z.object({
  lieu: z.string().min(1, 'Le lieu est requis'),
  items: z.array(z.boolean()),
  realiseePar: z.string().optional(),
  observations: z.string().optional(),
});

export const gardeSchema = z.object({
  personnelId: z.string().min(1, 'Le personnel est requis'),
  date: z.string().min(1, 'La date est requise'),
  type: z.enum(['JOUR', 'NUIT', 'WEEKEND', 'FERIE']),
  service: z.string().optional(),
});

// Type exports
export type PersonnelFormData = z.infer<typeof personnelSchema>;
export type CongeFormData = z.infer<typeof congeSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type ProduitFormData = z.infer<typeof produitSchema>;
export type ChecklistFormData = z.infer<typeof checklistSchema>;
export type GardeFormData = z.infer<typeof gardeSchema>;