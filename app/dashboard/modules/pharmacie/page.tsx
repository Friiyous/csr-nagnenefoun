'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Users,
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Thermometer,
  Droplets,
  Activity,
  Wrench,
  MapPin,
  AlertCircle,
  Clock,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  AlertOctagon,
  CheckCircle,
  XCircle,
  ClipboardCheck
} from 'lucide-react';

// Types pour le module Pharmacie EPSC
interface Produit {
  id: string;
  nom: string;
  forme: 'COMPRIME' | 'SIROP' | 'INJECTABLE' | 'POMMADE' | 'GELULE' | 'SOLUTION' | 'CREME' | 'COLLYRE';
  dosage: string;
  unite: string;
  categorie: 'ANTALGIQUE' | 'ANTIBIOTIQUE' | 'ANTIPALUDEEN' | 'VITAMINE' | 'HYPOGLYCEMIANT' | 'ANTIHYPERTENSIF' | 'ANTISEPTIQUE' | 'DIVERS';
  prix_achat: number;
  prix_vente: number;
  seuil_alerte: number;
  quantite_stock: number;
  date_peremption: string;
  fournisseur: string;
}

interface EntreeStock {
  id: string;
  date: string;
  produit: string;
  quantite: number;
  prix_unitaire: number;
  total: number;
  fournisseur: string;
  numero_lot: string;
  date_peremption: string;
  bon_commande: string;
}

interface SortieStock {
  id: string;
  date: string;
  produit: string;
  quantite: number;
  beneficiaire: string;
  motif: 'VENTE' | 'GRATUIT' | 'PRELEVEMENT' | 'PERIME' | 'DETOURNE';
  service: string;
  numero_ticket: string;
}

interface Inventaire {
  id: string;
  date: string;
  type: 'COMPLET' | 'PARTIEL' | 'ALEA';
  statut: 'EN_COURS' | 'TERMINE' | 'VALIDATION';
  produits_comptes: number;
  produits_ecart: number;
  valeur_stock: number;
  realisateur: string;
}

interface AlerteStock {
  id: string;
  date: string;
  type: 'RUPTURE' | 'RUPTURE_IMMINENTE' | 'PEREMPTION_PROCHE' | 'SURSTOCK';
  produit: string;
  quantite: number;
  message: string;
  statut: 'ACTIVE' | 'TRAITEE' | 'IGNOREE';
}

// Formatage des montants
const formatMontant = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Formatage des dates
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR');
};

export default function PharmaciePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produits' | 'entrees' | 'sorties' | 'inventaire' | 'alertes'>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Données EPSC
  const produits: Produit[] = [
    { id: '1', nom: 'Paracetamol 500mg', forme: 'COMPRIME', dosage: '500mg', unite: 'cp', categorie: 'ANTALGIQUE', prix_achat: 50, prix_vente: 75, seuil_alerte: 100, quantite_stock: 2500, date_peremption: '2026-06-15', fournisseur: 'PharmaCI' },
    { id: '2', nom: 'Amoxicilline 1g', forme: 'COMPRIME', dosage: '1g', unite: 'cp', categorie: 'ANTIBIOTIQUE', prix_achat: 150, prix_vente: 200, seuil_alerte: 50, quantite_stock: 45, date_peremption: '2025-12-20', fournisseur: 'Sophilabo' },
    { id: '3', nom: 'Artémether+Luméfantrine', forme: 'COMPRIME', dosage: '20/120mg', unite: 'cp', categorie: 'ANTIPALUDEEN', prix_achat: 800, prix_vente: 1000, seuil_alerte: 20, quantite_stock: 150, date_peremption: '2025-09-10', fournisseur: 'PharmaCI' },
    { id: '4', nom: 'Insuline Glargine', forme: 'INJECTABLE', dosage: '100UI/ml', unite: 'flacon', categorie: 'HYPOGLYCEMIANT', prix_achat: 3500, prix_vente: 4200, seuil_alerte: 10, quantite_stock: 8, date_peremption: '2025-08-25', fournisseur: 'MédiDist' },
    { id: '5', nom: 'Metformine 500mg', forme: 'COMPRIME', dosage: '500mg', unite: 'cp', categorie: 'HYPOGLYCEMIANT', prix_achat: 80, prix_vente: 120, seuil_alerte: 200, quantite_stock: 3200, date_peremption: '2026-03-15', fournisseur: 'PharmaCI' },
    { id: '6', nom: 'Chloroquine 100mg', forme: 'COMPRIME', dosage: '100mg', unite: 'cp', categorie: 'ANTIPALUDEEN', prix_achat: 30, prix_vente: 50, seuil_alerte: 100, quantite_stock: 0, date_peremption: '2025-07-01', fournisseur: 'Sophilabo' },
    { id: '7', nom: 'Doxycycline 100mg', forme: 'COMPRIME', dosage: '100mg', unite: 'cp', categorie: 'ANTIBIOTIQUE', prix_achat: 100, prix_vente: 150, seuil_alerte: 50, quantite_stock: 35, date_peremption: '2025-11-30', fournisseur: 'PharmaCI' },
    { id: '8', nom: 'Vérapamil 80mg', forme: 'COMPRIME', dosage: '80mg', unite: 'cp', categorie: 'ANTIHYPERTENSIF', prix_achat: 120, prix_vente: 180, seuil_alerte: 30, quantite_stock: 22, date_peremption: '2025-10-15', fournisseur: 'CardioPharma' },
  ];

  const entrees: EntreeStock[] = [
    { id: '1', date: '2025-01-15', produit: 'Paracetamol 500mg', quantite: 3000, prix_unitaire: 50, total: 150000, fournisseur: 'PharmaCI', numero_lot: 'LT-2024-001', date_peremption: '2026-06-15', bon_commande: 'BC-2025-001' },
    { id: '2', date: '2025-01-10', produit: 'Artémether+Luméfantrine', quantite: 500, prix_unitaire: 800, total: 400000, fournisseur: 'PharmaCI', numero_lot: 'LT-2024-045', date_peremption: '2025-09-10', bon_commande: 'BC-2025-002' },
    { id: '3', date: '2025-01-05', produit: 'Insuline Glargine', quantite: 20, prix_unitaire: 3500, total: 70000, fournisseur: 'MédiDist', numero_lot: 'IN-2024-012', date_peremption: '2025-08-25', bon_commande: 'BC-2025-003' },
    { id: '4', date: '2024-12-20', produit: 'Metformine 500mg', quantite: 5000, prix_unitaire: 80, total: 400000, fournisseur: 'PharmaCI', numero_lot: 'MT-2024-089', date_peremption: '2026-03-15', bon_commande: 'BC-2024-156' },
  ];

  const sorties: SortieStock[] = [
    { id: '1', date: '2025-01-15', produit: 'Paracetamol 500mg', quantite: 500, beneficiaire: 'Patient externe', motif: 'VENTE', service: 'Pharmacie', numero_ticket: 'TK-2025-001' },
    { id: '2', date: '2025-01-15', produit: 'Artémether+Luméfantrine', quantite: 6, beneficiaire: 'Service CPN', motif: 'GRATUIT', service: 'CPN', numero_ticket: '' },
    { id: '3', date: '2025-01-14', produit: 'Metformine 500mg', quantite: 1800, beneficiaire: 'Patient externe', motif: 'VENTE', service: 'Pharmacie', numero_ticket: 'TK-2025-002' },
    { id: '4', date: '2025-01-14', produit: 'Amoxicilline 1g', quantite: 30, beneficiaire: 'Service urgences', motif: 'PRELEVEMENT', service: 'Urgences', numero_ticket: '' },
    { id: '5', date: '2025-01-13', produit: 'Vérapamil 80mg', quantite: 8, beneficiaire: 'Patient externe', motif: 'VENTE', service: 'Pharmacie', numero_ticket: 'TK-2025-003' },
  ];

  const alertes: AlerteStock[] = [
    { id: '1', date: '2025-01-15', type: 'RUPTURE', produit: 'Chloroquine 100mg', quantite: 0, message: 'Stock épuisé - Commande urgente', statut: 'ACTIVE' },
    { id: '2', date: '2025-01-15', type: 'RUPTURE_IMMINENTE', produit: 'Insuline Glargine', quantite: 8, message: 'Seuil d\'alerte atteint (8 < 10)', statut: 'ACTIVE' },
    { id: '3', date: '2025-01-14', type: 'PEREMPTION_PROCHE', produit: 'Amoxicilline 1g', quantite: 45, message: 'Péremption dans moins de 2 mois', statut: 'ACTIVE' },
    { id: '4', date: '2025-01-10', type: 'SURSTOCK', produit: 'Metformine 500mg', quantite: 3200, message: 'Stock important - Vérifier rotation', statut: 'TRAITEE' },
  ];

  const inventaires: Inventaire[] = [
    { id: '1', date: '2025-01-01', type: 'COMPLET', statut: 'TERMINE', produits_comptes: 156, produits_ecart: 3, valeur_stock: 12500000, realisateur: 'Dr. Koffi Marie' },
    { id: '2', date: '2024-10-01', type: 'COMPLET', statut: 'TERMINE', produits_comptes: 142, produits_ecart: 5, valeur_stock: 11800000, realisateur: 'Dr. Koffi Marie' },
  ];

  // Calculs des stats
  const totalProduits = produits.length;
  const produitsEnRupture = produits.filter(p => p.quantite_stock === 0).length;
  const produitsAlerte = produits.filter(p => p.quantite_stock <= p.seuil_alerte && p.quantite_stock > 0).length;
  const produitsPerimes = produits.filter(p => new Date(p.date_peremption) < new Date()).length;
  
  const valeurStock = produits.reduce((sum, p) => sum + (p.quantite_stock * p.prix_achat), 0);
  const entreesTotal = entrees.reduce((sum, e) => sum + e.total, 0);
  const sortiesTotal = sorties.filter(s => s.motif === 'VENTE').reduce((sum, s) => {
    const produit = produits.find(p => p.nom === s.produit);
    return sum + (s.quantite * (produit?.prix_vente || 0));
  }, 0);
  const alertesActives = alertes.filter(a => a.statut === 'ACTIVE').length;

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ACTIVE':
      case 'EN_COURS': return 'red';
      case 'TERMINE':
      case 'VALIDATION':
      case 'TRAITEE': return 'green';
      case 'IGNOREE': return 'gray';
      default: return 'gray';
    }
  };

  const getAlerteColor = (type: string) => {
    switch (type) {
      case 'RUPTURE': return 'red';
      case 'RUPTURE_IMMINENTE': return 'orange';
      case 'PEREMPTION_PROCHE': return 'yellow';
      case 'SURSTOCK': return 'blue';
      default: return 'gray';
    }
  };

  const getFormeIcon = (forme: string) => {
    switch (forme) {
      case 'COMPRIME': return <Pill className="h-5 w-5 text-blue-600" />;
      case 'SIROP': return <Droplets className="h-5 w-5 text-green-600" />;
      case 'INJECTABLE': return <Activity className="h-5 w-5 text-red-600" />;
      case 'POMMADE':
      case 'CREME': return <Package className="h-5 w-5 text-purple-600" />;
      default: return <Pill className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStockStatus = (produit: Produit) => {
    if (produit.quantite_stock === 0) return { color: 'red', label: 'Rupture' };
    if (produit.quantite_stock <= produit.seuil_alerte) return { color: 'orange', label: 'Alerte' };
    if (new Date(produit.date_peremption) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) return { color: 'yellow', label: 'Peremption' };
    return { color: 'green', label: 'OK' };
  };

  const handleOpenModal = (type: string, item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion de la Pharmacie</h1>
          <p className="text-gray-500">Établissement Public de Santé de Contrôle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Inventaire
          </Button>
          <Button onClick={() => handleOpenModal('produit')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {[
          { key: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
          { key: 'produits', icon: Package, label: 'Produits' },
          { key: 'entrees', icon: Plus, label: 'Entrées' },
          { key: 'sorties', icon: TrendingDown, label: 'Sorties' },
          { key: 'inventaire', icon: ClipboardCheck, label: 'Inventaire' },
          { key: 'alertes', icon: AlertTriangle, label: 'Alertes' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Alertes actives */}
          {alertesActives > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">{alertesActives} alerte(s) active(s)</p>
                    <p className="text-sm text-red-600">Action requise sur le stock</p>
                  </div>
                  <Button variant="destructive" size="sm" className="ml-auto" onClick={() => setActiveTab('alertes')}>
                    Voir les alertes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Produits référencés</p>
                  <p className="text-2xl font-bold">{totalProduits}</p>
                  <p className="text-xs text-gray-500">En stock</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En rupture</p>
                  <p className="text-2xl font-bold text-red-600">{produitsEnRupture}</p>
                  <p className="text-xs text-gray-500">Produits épuisés</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seuil atteint</p>
                  <p className="text-2xl font-bold text-yellow-600">{produitsAlerte}</p>
                  <p className="text-xs text-gray-500">À commander</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valeur stock</p>
                  <p className="text-2xl font-bold">{formatMontant(valeurStock)} F</p>
                  <p className="text-xs text-gray-500">Coût d'achat</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tableau des produits critiques */}
          <Card>
            <CardHeader>
              <CardTitle>Produits à surveiller</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Seuil</TableHead>
                    <TableHead>Péremption</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produits.filter(p => p.quantite_stock <= p.seuil_alerte || new Date(p.date_peremption) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).map((produit) => {
                    const status = getStockStatus(produit);
                    return (
                      <TableRow key={produit.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormeIcon(produit.forme)}
                            <div>
                              <p className="font-medium">{produit.nom}</p>
                              <p className="text-xs text-gray-500">{produit.dosage}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{produit.categorie.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          <span className={status.color === 'red' ? 'font-bold text-red-600' : status.color === 'orange' ? 'font-bold text-orange-600' : ''}>
                            {produit.quantite_stock} {produit.unite}
                          </span>
                        </TableCell>
                        <TableCell>{produit.seuil_alerte} {produit.unite}</TableCell>
                        <TableCell>{formatDate(produit.date_peremption)}</TableCell>
                        <TableCell>
                          <Badge color={status.color === 'red' ? 'red' : status.color === 'orange' ? 'yellow' : 'green'}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Résumé financier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Valeur du stock</p>
                  <p className="text-xl font-bold text-blue-700">{formatMontant(valeurStock)} F</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Entrées (Janvier)</p>
                  <p className="text-xl font-bold text-green-700">{formatMontant(entreesTotal)} F</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700">Ventes (Janvier)</p>
                  <p className="text-xl font-bold text-purple-700">{formatMontant(sortiesTotal)} F</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Produits */}
      {activeTab === 'produits' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Produits pharmaceutiques</h2>
              <p className="text-sm text-gray-500">Référentiel des médicaments et consommables</p>
            </div>
            <Button onClick={() => handleOpenModal('produit')}>
              <Plus className="h-4 w-4 mr-2" />Nouveau produit
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex gap-4">
            <Select
              options={[
                { value: 'all', label: 'Toutes les catégories' },
                { value: 'ANTALGIQUE', label: 'Antalgiques' },
                { value: 'ANTIBIOTIQUE', label: 'Antibiotiques' },
                { value: 'ANTIPALUDEEN', label: 'Antipaludéens' },
                { value: 'ANTIHYPERTENSIF', label: 'Antihypertenseurs' },
                { value: 'HYPOGLYCEMIANT', label: 'Antidiabétiques' },
              ]}
              onChange={() => {}}
            />
            <Select
              options={[
                { value: 'all', label: 'Toutes les formes' },
                { value: 'COMPRIME', label: 'Comprimés' },
                { value: 'SIROP', label: 'Sirop' },
                { value: 'INJECTABLE', label: 'Injectable' },
                { value: 'POMMADE', label: 'Pommade' },
              ]}
              onChange={() => {}}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Forme</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix (A/V)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Seuil</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produits.map((produit) => {
                    const status = getStockStatus(produit);
                    return (
                      <TableRow key={produit.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormeIcon(produit.forme)}
                            <div>
                              <p className="font-medium">{produit.nom}</p>
                              <p className="text-xs text-gray-500">{produit.dosage}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{produit.forme}</TableCell>
                        <TableCell>{produit.categorie.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          <span className="text-sm">{formatMontant(produit.prix_achat)} / {formatMontant(produit.prix_vente)} F</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${status.color === 'red' ? 'text-red-600' : status.color === 'orange' ? 'text-orange-600' : ''}`}>
                            {produit.quantite_stock} {produit.unite}
                          </span>
                        </TableCell>
                        <TableCell>{produit.seuil_alerte} {produit.unite}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal('produit', produit)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal('entree', produit)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Entrées */}
      {activeTab === 'entrees' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Entrées en stock</h2>
              <p className="text-sm text-gray-500">Historique des réceptions de médicaments</p>
            </div>
            <Button onClick={() => handleOpenModal('entree')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle entrée
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Entrées (2025)</p>
              <p className="text-2xl font-bold">{formatMontant(entreesTotal)} F</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Nombre d'entrées</p>
              <p className="text-2xl font-bold">{entrees.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Fournisseurs actifs</p>
              <p className="text-2xl font-bold">{[...new Set(entrees.map(e => e.fournisseur))].length}</p>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Lot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entrees.map((entree) => (
                    <TableRow key={entree.id}>
                      <TableCell>{formatDate(entree.date)}</TableCell>
                      <TableCell className="font-medium">{entree.produit}</TableCell>
                      <TableCell>{entree.quantite}</TableCell>
                      <TableCell>{formatMontant(entree.prix_unitaire)} F</TableCell>
                      <TableCell className="font-bold">{formatMontant(entree.total)} F</TableCell>
                      <TableCell>{entree.fournisseur}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entree.numero_lot}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sorties */}
      {activeTab === 'sorties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Sorties de stock</h2>
              <p className="text-sm text-gray-500">Distribution et ventes de médicaments</p>
            </div>
            <Button onClick={() => handleOpenModal('sortie')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle sortie
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Ventes (2025)</p>
              <p className="text-2xl font-bold text-green-600">{formatMontant(sortiesTotal)} F</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Gratuits</p>
              <p className="text-2xl font-bold">{sorties.filter(s => s.motif === 'GRATUIT').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Prélèvements</p>
              <p className="text-2xl font-bold">{sorties.filter(s => s.motif === 'PRELEVEMENT').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Périmés</p>
              <p className="text-2xl font-bold text-red-600">{sorties.filter(s => s.motif === 'PERIME').length}</p>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Bénéficiaire</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorties.map((sortie) => (
                    <TableRow key={sortie.id}>
                      <TableCell>{formatDate(sortie.date)}</TableCell>
                      <TableCell className="font-medium">{sortie.produit}</TableCell>
                      <TableCell>{sortie.quantite}</TableCell>
                      <TableCell>{sortie.beneficiaire}</TableCell>
                      <TableCell>
                        <Badge color={
                          sortie.motif === 'VENTE' ? 'green' :
                          sortie.motif === 'GRATUIT' ? 'blue' :
                          sortie.motif === 'PERIME' ? 'red' : 'gray'
                        }>
                          {sortie.motif}
                        </Badge>
                      </TableCell>
                      <TableCell>{sortie.service}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventaire */}
      {activeTab === 'inventaire' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Inventaires</h2>
              <p className="text-sm text-gray-500">Contrôles et concordances de stock</p>
            </div>
            <Button onClick={() => handleOpenModal('inventaire')}>
              <Plus className="h-4 w-4 mr-2" />Nouvel inventaire
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total inventaires</p>
              <p className="text-2xl font-bold">{inventaires.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Dernier inventaire</p>
              <p className="text-2xl font-bold">{formatDate(inventaires[0]?.date || '')}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Écarts totaux</p>
              <p className="text-2xl font-bold text-yellow-600">{inventaires.reduce((sum, i) => sum + i.produits_ecart, 0)}</p>
            </Card>
          </div>

          <div className="space-y-4">
            {inventaires.map((inv) => (
              <Card key={inv.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ClipboardCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Inventaire {inv.type}</p>
                      <p className="text-sm text-gray-500">{formatDate(inv.date)} - {inv.realisateur}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge color={getStatutColor(inv.statut)}>{inv.statut}</Badge>
                    <p className="text-sm mt-1">{inv.produits_comptes} produits comptés</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{inv.produits_comptes}</p>
                    <p className="text-xs text-gray-500">Comptés</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{inv.produits_ecart}</p>
                    <p className="text-xs text-gray-500">Écarts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatMontant(inv.valeur_stock)}</p>
                    <p className="text-xs text-gray-500">Valeur</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Alertes */}
      {activeTab === 'alertes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Alertes de stock</h2>
              <p className="text-sm text-gray-500">Gestion des ruptures et périmptions</p>
            </div>
            <Button onClick={() => handleOpenModal('alerte')}>
              <Plus className="h-4 w-4 mr-2" />Créer alerte
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="text-sm text-red-700">Ruptures</p>
                  <p className="text-2xl font-bold text-red-700">{alertes.filter(a => a.type === 'RUPTURE').length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-700">Imminentes</p>
                  <p className="text-2xl font-bold text-orange-700">{alertes.filter(a => a.type === 'RUPTURE_IMMINENTE').length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-700">Péremption</p>
                  <p className="text-2xl font-bold text-yellow-700">{alertes.filter(a => a.type === 'PEREMPTION_PROCHE').length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Surstock</p>
                  <p className="text-2xl font-bold text-blue-700">{alertes.filter(a => a.type === 'SURSTOCK').length}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {alertes.map((alerte) => (
              <Card key={alerte.id} className={`p-4 ${alerte.statut === 'ACTIVE' ? 'border-l-4 border-l-red-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getAlerteColor(alerte.type) === 'red' ? 'bg-red-100' : getAlerteColor(alerte.type) === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                      <AlertTriangle className={`h-5 w-5 ${getAlerteColor(alerte.type) === 'red' ? 'text-red-600' : getAlerteColor(alerte.type) === 'orange' ? 'text-orange-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{alerte.produit}</p>
                        <Badge color={getAlerteColor(alerte.type)}>{alerte.type.replace(/_/g, ' ')}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alerte.message}</p>
                      {alerte.quantite > 0 && (
                        <p className="text-sm text-gray-500 mt-1">Stock actuel: {alerte.quantite}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Signalé le {formatDate(alerte.date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge color={getStatutColor(alerte.statut)}>{alerte.statut}</Badge>
                    {alerte.statut === 'ACTIVE' && (
                      <Button variant="outline" size="sm">Traiter</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal générique */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={
        modalType === 'produit' ? 'Nouveau produit' :
        modalType === 'entree' ? 'Nouvelle entrée' :
        modalType === 'sortie' ? 'Nouvelle sortie' :
        modalType === 'inventaire' ? 'Nouvel inventaire' :
        modalType === 'alerte' ? 'Créer une alerte' :
        'Nouveau'
      } size="lg">
        <div className="space-y-4">
          {modalType === 'produit' && (
            <>
              <Input label="Nom du produit" placeholder="Ex: Paracetamol 500mg" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Dosage" placeholder="500mg" />
                <Select label="Forme" options={[
                  { value: 'COMPRIME', label: 'Comprimé' },
                  { value: 'SIROP', label: 'Sirop' },
                  { value: 'INJECTABLE', label: 'Injectable' },
                  { value: 'POMMADE', label: 'Pommade' },
                ]} onChange={() => {}} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prix d'achat" type="number" placeholder="0" />
                <Input label="Prix de vente" type="number" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Seuil d'alerte" type="number" placeholder="100" />
                <Input label="Quantité initiale" type="number" placeholder="0" />
              </div>
              <Input label="Fournisseur" placeholder="Nom du fournisseur" />
            </>
          )}
          {modalType === 'entree' && (
            <>
              <Select label="Produit" options={produits.map(p => ({ value: p.id, label: p.nom }))} onChange={() => {}} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantité" type="number" placeholder="0" />
                <Input label="Prix unitaire" type="number" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Numéro de lot" placeholder="LT-2025-001" />
                <Input label="Date de péremption" type="date" />
              </div>
              <Input label="Bon de commande" placeholder="BC-2025-XXX" />
            </>
          )}
          {modalType === 'sortie' && (
            <>
              <Select label="Produit" options={produits.map(p => ({ value: p.id, label: p.nom }))} onChange={() => {}} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantité" type="number" placeholder="0" />
                <Select label="Motif" options={[
                  { value: 'VENTE', label: 'Vente' },
                  { value: 'GRATUIT', label: 'Gratuit' },
                  { value: 'PRELEVEMENT', label: 'Prélèvement service' },
                  { value: 'PERIME', label: 'Périmé' },
                ]} onChange={() => {}} />
              </div>
              <Input label="Bénéficiaire" placeholder="Patient ou service" />
              <Input label="Numéro de ticket (vente)" placeholder="TK-2025-XXX" />
            </>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={() => setShowModal(false)}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}