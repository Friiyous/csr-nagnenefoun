import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction pour merger les classes CSS avec Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater une date en français
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Formater un montant en francs CFA
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formater un nombre
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// Calculer l'âge à partir de la date de naissance
export function calculateAge(dateNaiss: Date | string): number {
  const today = new Date();
  const birthDate = new Date(dateNaiss);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Générer un numéro de dossier patient
export function generatePatientNumber(epsCode: string, sequential: number): string {
  const year = new Date().getFullYear();
  const seq = String(sequential).padStart(5, '0');
  return `${epsCode}-${year}-${seq}`;
}

// Valider un email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Obtenir les initiales d'un nom
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Tronquer un texte
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Sleep function pour les delays
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Copier dans le presse-papier
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Téléchargement de fichier
export function downloadFile(content: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Exporter en CSV
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = String(value ?? '');
        // Échapper les virgules et guillemets
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    ),
  ].join('\n');
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

// Couleur selon le statut
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Statuts de personnel
    ACTIF: 'bg-green-100 text-green-800',
    CONGE: 'bg-yellow-100 text-yellow-800',
    MISSION: 'bg-blue-100 text-blue-800',
    SUSPENDU: 'bg-red-100 text-red-800',
    RETRAITE: 'bg-gray-100 text-gray-800',
    
    // Statuts de congé
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    APPROUVE: 'bg-green-100 text-green-800',
    REFUSE: 'bg-red-100 text-red-800',
    
    // Types de transactions
    RECETTE: 'bg-green-100 text-green-800',
    DEPENSE: 'bg-red-100 text-red-800',
    TRANSFERT: 'bg-blue-100 text-blue-800',
    
    // Validation PBF
    true: 'bg-green-100 text-green-800',
    false: 'bg-yellow-100 text-yellow-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Formater la période (mois/année)
export function formatPeriode(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
}

// Obtenir le mois précédent
export function getPreviousMonth(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
}

// Vérifier si une date est périmée
export function isExpired(datePeremption: Date | string): boolean {
  return new Date(datePeremption) < new Date();
}

// Jours restants avant péremption
export function daysUntilExpiration(datePeremption: Date | string): number {
  const expiration = new Date(datePeremption);
  const today = new Date();
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}