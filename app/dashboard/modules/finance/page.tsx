'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { 
  FileText, 
  Users, 
  Calendar, 
  Target, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  ClipboardList,
  Archive,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Send
} from 'lucide-react';

// Types pour le module PBF refondu
interface PlanAction {
  id: string;
  annee: number;
  trimestre: number;
  objectif: string;
  activite: string;
  budget_prevu: number;
  budget_consomme: number;
  responsable: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'REALISE' | 'EVALUE';
}

interface Reunion {
  id: string;
  date: string;
  type: 'MENSUELLE' | 'TRIMESTRIELLE' | 'COGES' | 'ASSEMBLEE';
  theme: string;
  participants: number;
  pv_url?: string;
  liste_presence_url?: string;
  observations?: string;
}

interface Evaluation {
  id: string;
  trimestre: number;
  annee: number;
  date_evaluation: string;
  note?: number;
  observations?: string;
  documents_requis: string[];
  documents_fournis: string[];
  statut: 'EN_PREPARATION' | 'SOUMIS' | 'EVALUE';
}

interface Budget {
  id: string;
  libelle: string;
  categorie: 'PRIME_PERSONNEL' | 'ACHAT_MATERIEL' | 'FONCTIONNEMENT' | 'INVESTISSEMENT';
  budget_initial: number;
  consomme: number;
  reste: number;
}

interface DocumentPBF {
  id: string;
  nom: string;
  type: 'PLAN' | 'PV' | 'LISTE' | 'RAPPORT' | 'DOSSIER' | 'BORDEREAU' | 'FACTURE';
  categorie: 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3' | 'TRIMESTRE_4' | 'ANNUEL';
  date_upload: string;
  url?: string;
  statut: 'COMPLET' | 'INCOMPLET' | 'MANQUANT';
}

// Formatage cohérent des montants
const formatMontant = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plan' | 'reunions' | 'evaluations' | 'budget' | 'archives'>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Données mockées complètes
  const [plansAction, setPlansAction] = useState<PlanAction[]>([
    { id: '1', annee: 2025, trimestre: 1, objectif: 'Améliorer la CPN1', activite: 'Campagne de sensibilisation dans les villages', budget_prevu: 150000, budget_consomme: 120000, responsable: 'Dr. Kouamé Jean', statut: 'EVALUE' },
    { id: '2', annee: 2025, trimestre: 1, objectif: 'Renforcer le plateau technique', activite: 'Achat de matériel médical et équipements', budget_prevu: 500000, budget_consomme: 450000, responsable: 'Mr. Bamba Paul', statut: 'REALISE' },
    { id: '3', annee: 2025, trimestre: 2, objectif: 'Formation du personnel', activite: 'Atelier sur les nouveaux protocoles de soins', budget_prevu: 200000, budget_consomme: 0, responsable: 'Mme. Traoré Fatou', statut: 'PLANIFIE' },
    { id: '4', annee: 2025, trimestre: 2, objectif: 'Améliorer la prise en charge des urgences', activite: 'Réorganisation du service urgences', budget_prevu: 300000, budget_consomme: 50000, responsable: 'Dr. Diallo Ali', statut: 'EN_COURS' },
    { id: '5', annee: 2025, trimestre: 3, objectif: 'Renforcement de la pharmacie', activite: 'Achat de médicaments essentiels', budget_prevu: 400000, budget_consomme: 0, responsable: 'Dr. Koffi Marie', statut: 'PLANIFIE' },
  ]);

  const [reunions, setReunions] = useState<Reunion[]>([
    { id: '1', date: '2025-01-15', type: 'MENSUELLE', theme: 'Analyse des indicateurs PBF janvier - Revue des objectifs', participants: 12, pv_url: '/docs/pbf/t1/pv-jan-2025.pdf', liste_presence_url: '/docs/pbf/t1/presence-jan-2025.pdf', observations: 'Tous les objectifs sont en bonne voie' },
    { id: '2', date: '2025-02-10', type: 'MENSUELLE', theme: 'Suivi des objectifs qualité et plan d\'action', participants: 14, pv_url: '/docs/pbf/t1/pv-fev-2025.pdf', liste_presence_url: '/docs/pbf/t1/presence-fev-2025.pdf', observations: 'HAUSSE de 15% sur les CPN' },
    { id: '3', date: '2025-03-20', type: 'TRIMESTRIELLE', theme: 'Évaluation T1 et planification T2 - Bilan et perspectives', participants: 18, pv_url: '/docs/pbf/t1/pv-trim1-2025.pdf', liste_presence_url: '/docs/pbf/t1/presence-trim1-2025.pdf', observations: 'Note obtenus: 78/100 - Très satisfaisant' },
    { id: '4', date: '2025-01-25', type: 'COGES', theme: 'Approbation du budget 2025 et plan d\'action', participants: 8, pv_url: '/docs/pbf/t1/pv-coges-2025.pdf', liste_presence_url: '/docs/pbf/t1/presence-coges-2025.pdf', observations: 'Budget adopté à l\'unanimité' },
    { id: '5', date: '2025-04-15', type: 'MENSUELLE', theme: 'Lancement du T2 et révision des indicateurs', participants: 13, observations: 'Nouveaux objectifs définis' },
  ]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { 
      id: '1', trimestre: 1, annee: 2025, date_evaluation: '2025-04-10', note: 78, observations: 'Forte amélioration sur les CPN (+20%). Services de maternité performants.', 
      documents_requis: ['Plan action T1', 'PV réunions mensuelles', 'PV COGES', 'Liste présence', 'Rapport financier T1', 'Dossier évaluation'], 
      documents_fournis: ['Plan action T1', 'PV réunions mensuelles', 'PV COGES', 'Liste présence', 'Rapport financier T1'], 
      statut: 'EVALUE' 
    },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', libelle: 'Prime du personnel (PBF)', categorie: 'PRIME_PERSONNEL', budget_initial: 1200000, consomme: 900000, reste: 300000 },
    { id: '2', libelle: 'Achat médicaments et consommables', categorie: 'ACHAT_MATERIEL', budget_initial: 800000, consomme: 650000, reste: 150000 },
    { id: '3', libelle: 'Matériel médical et équipements', categorie: 'INVESTISSEMENT', budget_initial: 1500000, consomme: 1200000, reste: 300000 },
    { id: '4', libelle: 'Fonctionnement (électricité, eau, etc.)', categorie: 'FONCTIONNEMENT', budget_initial: 400000, consomme: 350000, reste: 50000 },
  ]);

  const [documents, setDocuments] = useState<DocumentPBF[]>([
    { id: '1', nom: 'Plan action 2025 T1', type: 'PLAN', categorie: 'TRIMESTRE_1', date_upload: '2025-01-05', statut: 'COMPLET' },
    { id: '2', nom: 'PV Réunion COGES T1', type: 'PV', categorie: 'TRIMESTRE_1', date_upload: '2025-01-25', statut: 'COMPLET' },
    { id: '3', nom: 'Liste présence COGES T1', type: 'LISTE', categorie: 'TRIMESTRE_1', date_upload: '2025-01-25', statut: 'COMPLET' },
    { id: '4', nom: 'PV Réunion mensuelle janvier', type: 'PV', categorie: 'TRIMESTRE_1', date_upload: '2025-01-15', statut: 'COMPLET' },
    { id: '5', nom: 'Rapport financier T1', type: 'RAPPORT', categorie: 'TRIMESTRE_1', date_upload: '2025-03-30', statut: 'COMPLET' },
    { id: '6', nom: 'Dossier évaluation T1', type: 'DOSSIER', categorie: 'TRIMESTRE_1', date_upload: '2025-04-05', statut: 'COMPLET' },
    { id: '7', nom: 'Plan action 2025 T2', type: 'PLAN', categorie: 'TRIMESTRE_2', date_upload: '2025-04-01', statut: 'COMPLET' },
    { id: '8', nom: 'Bordereau de demande de fonds T3', type: 'BORDEREAU', categorie: 'TRIMESTRE_3', date_upload: '', statut: 'MANQUANT' },
  ]);

  // Calculs des stats
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget_initial, 0);
  const totalConsomme = budgets.reduce((sum, b) => sum + b.consomme, 0);
  const totalReste = budgets.reduce((sum, b) => sum + b.reste, 0);
  const tauxExecution = totalBudget > 0 ? (totalConsomme / totalBudget) * 100 : 0;

  // Stats pour le dashboard
  const objectifsRealises = plansAction.filter(p => p.statut === 'EVALUE' || p.statut === 'REALISE').length;
  const totalObjectifs = plansAction.length;
  const tauxObjectifs = totalObjectifs > 0 ? (objectifsRealises / totalObjectifs) * 100 : 0;

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EVALUE': return 'green';
      case 'REALISE': return 'blue';
      case 'EN_COURS': return 'yellow';
      case 'SOUMIS': return 'purple';
      case 'EN_PREPARATION': return 'yellow';
      case 'COMPLET': return 'green';
      case 'INCOMPLET': return 'yellow';
      case 'MANQUANT': return 'red';
      default: return 'gray';
    }
  };

  const getTypeReunionIcon = (type: string) => {
    switch (type) {
      case 'MENSUELLE': return <Calendar className="h-4 w-4" />;
      case 'TRIMESTRIELLE': return <Target className="h-4 w-4" />;
      case 'COGES': return <Users className="h-4 w-4" />;
      case 'ASSEMBLEE': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getBudgetColor = (categorie: string) => {
    switch (categorie) {
      case 'PRIME_PERSONNEL': return 'bg-green-500';
      case 'ACHAT_MATERIEL': return 'bg-blue-500';
      case 'INVESTISSEMENT': return 'bg-purple-500';
      case 'FONCTIONNEMENT': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
          <h1 className="text-2xl font-bold">Gestion PBF</h1>
          <p className="text-gray-500">Établissement Public de Santé de Contrôle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Exporter dossier
          </Button>
          <Button onClick={() => handleOpenModal('activite')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle activité
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {[
          { key: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
          { key: 'plan', icon: ClipboardList, label: "Plan d'action" },
          { key: 'reunions', icon: Users, label: 'Réunions' },
          { key: 'evaluations', icon: CheckCircle, label: 'Évaluations' },
          { key: 'budget', icon: DollarSign, label: 'Budget' },
          { key: 'archives', icon: Archive, label: 'Archives' },
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Objectifs réalisés</p>
                  <p className="text-2xl font-bold">{objectifsRealises}/{totalObjectifs}</p>
                  <p className="text-xs text-green-600">{tauxObjectifs.toFixed(0)}% atteints</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget consommé</p>
                  <p className="text-2xl font-bold">{formatMontant(totalConsomme)} F</p>
                  <p className="text-xs text-gray-500">{tauxExecution.toFixed(1)}% du budget</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Réunions T1</p>
                  <p className="text-2xl font-bold">{reunions.filter(r => r.date.startsWith('2025-01') || r.date.startsWith('2025-02') || r.date.startsWith('2025-03')).length}</p>
                  <p className="text-xs text-gray-500">3 planned</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note évaluation T1</p>
                  <p className="text-2xl font-bold">78/100</p>
                  <p className="text-xs text-green-600">T1 validé ✅</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Résumé du budget */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total budget disponible</p>
                  <p className="text-3xl font-bold text-blue-700">{formatMontant(totalBudget)} F</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Consommé</p>
                  <p className="text-xl font-bold text-green-600">{formatMontant(totalConsomme)} F</p>
                  <p className="text-sm text-gray-500">Reste: {formatMontant(totalReste)} F</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${tauxExecution}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">{tauxExecution.toFixed(1)}% du budget consommé</p>
            </CardContent>
          </Card>

          {/* Tableau des activités récentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Activités récentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('plan')}>Voir tout</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trimestre</TableHead>
                    <TableHead>Objectif</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plansAction.slice(0, 5).map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell><Badge>T{plan.trimestre}</Badge></TableCell>
                      <TableCell className="font-medium">{plan.objectif}</TableCell>
                      <TableCell>{plan.responsable}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span>{formatMontant(plan.budget_consomme)}</span>
                          <span className="text-gray-400"> / {formatMontant(plan.budget_prevu)}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge color={getStatutColor(plan.statut)}>{plan.statut}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan d'Action */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Plan d'action annuel</h2>
              <p className="text-sm text-gray-500">Objectifs, activités et suivi budgétaire</p>
            </div>
            <Button onClick={() => handleOpenModal('activite')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle activité
            </Button>
          </div>
          
          {/* Filtres */}
          <div className="flex gap-4">
            <Select
              options={[
                { value: 'all', label: 'Tous les trimestres' },
                { value: '1', label: 'Trimestre 1' },
                { value: '2', label: 'Trimestre 2' },
                { value: '3', label: 'Trimestre 3' },
                { value: '4', label: 'Trimestre 4' },
              ]}
              onChange={() => {}}
            />
            <Select
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'PLANIFIE', label: 'Planifié' },
                { value: 'EN_COURS', label: 'En cours' },
                { value: 'REALISE', label: 'Réalisé' },
                { value: 'EVALUE', label: 'Évalué' },
              ]}
              onChange={() => {}}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trimestre</TableHead>
                    <TableHead>Objectif</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>Budget prévu</TableHead>
                    <TableHead>Consommé</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plansAction.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell><Badge>T{plan.trimestre}</Badge></TableCell>
                      <TableCell className="font-medium">{plan.objectif}</TableCell>
                      <TableCell className="max-w-xs truncate">{plan.activite}</TableCell>
                      <TableCell>{formatMontant(plan.budget_prevu)} F</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{formatMontant(plan.budget_consomme)}</span>
                          <span className="text-gray-400"> F</span>
                        </div>
                        <div className="w-16 bg-gray-100 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${Math.min((plan.budget_consomme / plan.budget_prevu) * 100, 100)}%` }} 
                          />
                        </div>
                      </TableCell>
                      <TableCell>{plan.responsable}</TableCell>
                      <TableCell><Badge color={getStatutColor(plan.statut)}>{plan.statut}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal('activite', plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal('imputation', plan)}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Réunions */}
      {activeTab === 'reunions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Gestion des réunions</h2>
              <p className="text-sm text-gray-500">PV, listes de présence et comptes rendus</p>
            </div>
            <Button onClick={() => handleOpenModal('reunion')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle réunion
            </Button>
          </div>

          {/* Stats réunions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Réunions mensuelles</p>
              <p className="text-2xl font-bold">{reunions.filter(r => r.type === 'MENSUELLE').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Réunions trimestrielles</p>
              <p className="text-2xl font-bold">{reunions.filter(r => r.type === 'TRIMESTRIELLE').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Réunions COGES</p>
              <p className="text-2xl font-bold">{reunions.filter(r => r.type === 'COGES').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">PV téléchargés</p>
              <p className="text-2xl font-bold">{reunions.filter(r => r.pv_url).length}/{reunions.length}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reunions.map((reunion) => (
              <Card key={reunion.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeReunionIcon(reunion.type)}
                    </div>
                    <div>
                      <p className="font-medium">{reunion.type}</p>
                      <p className="text-sm text-gray-500">{reunion.date}</p>
                    </div>
                  </div>
                  <Badge>{reunion.participants} participants</Badge>
                </div>
                <p className="mt-3 text-gray-700">{reunion.theme}</p>
                {reunion.observations && (
                  <p className="mt-2 text-sm text-gray-500 italic">"{reunion.observations}"</p>
                )}
                <div className="mt-3 flex gap-2">
                  {reunion.pv_url ? (
                    <Button variant="secondary" size="sm">
                      <FileText className="h-3 w-3 mr-1" />PV
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Upload className="h-3 w-3 mr-1" />Ajouter PV
                    </Button>
                  )}
                  {reunion.liste_presence_url ? (
                    <Button variant="secondary" size="sm">
                      <Users className="h-3 w-3 mr-1" />Présence
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Upload className="h-3 w-3 mr-1" />Liste présence
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Évaluations */}
      {activeTab === 'evaluations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Évaluations trimestrielles</h2>
              <p className="text-sm text-gray-500">Suivi des évaluations du district</p>
            </div>
            <Button onClick={() => handleOpenModal('evaluation')}>
              <Plus className="h-4 w-4 mr-2" />Préparer évaluation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((trimestre) => {
              const evalTr = evaluations.find(e => e.trimestre === trimestre);
              return (
                <Card key={trimestre} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Trimestre {trimestre}</h3>
                      <p className="text-xs text-gray-500">{trimestre === 1 ? 'Janvier-Mars' : trimestre === 2 ? 'Avril-Juin' : trimestre === 3 ? 'Juillet-Septembre' : 'Octobre-Décembre'}</p>
                    </div>
                    <Badge color={evalTr ? getStatutColor(evalTr.statut) : 'gray'}>
                      {evalTr?.statut || 'Non préparé'}
                    </Badge>
                  </div>
                  
                  {evalTr ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Note obtained</span>
                        <span className="text-xl font-bold text-green-600">{evalTr.note}/100</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Documents</span>
                          <span>{evalTr.documents_fournis.length}/{evalTr.documents_requis.length}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(evalTr.documents_fournis.length / evalTr.documents_requis.length) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Documents fournis:</p>
                        <ul className="text-xs mt-1 space-y-1">
                          {evalTr.documents_fournis.map((doc, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />{doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {evalTr.observations && (
                        <p className="text-xs text-gray-500 italic">"{evalTr.observations}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">En attente de préparation</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-3 w-3 mr-1" />Préparer
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Prochaines étapes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Prochaines étapes</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Évaluation T2 prévue pour Juillet 2025
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents à préparer: Plan action T2, PV réunions, rapport financier
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objectif: Améliorer le score (78 → 85 minimum)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Suivi budgétaire</h2>
              <p className="text-sm text-gray-500">Répartition et consommation du budget PBF</p>
            </div>
            <Button onClick={() => handleOpenModal('imputation')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle imputation
            </Button>
          </div>

          {/* Vue d'ensemble */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-200">Total budget disponible (2025)</p>
                  <p className="text-4xl font-bold">{formatMontant(totalBudget)} F</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200">Consommé</p>
                  <p className="text-2xl font-bold">{formatMontant(totalConsomme)} F</p>
                  <p className="text-sm text-blue-300">Reste: {formatMontant(totalReste)} F</p>
                </div>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-4 mt-4">
                <div className="bg-white h-4 rounded-full transition-all" style={{ width: `${tauxExecution}%` }} />
              </div>
              <p className="text-sm text-blue-300 mt-2">{tauxExecution.toFixed(1)}% du budget consommé</p>
            </CardContent>
          </Card>

          {/* Budget par catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const taux = (budget.consomme / budget.budget_initial) * 100;
              return (
                <Card key={budget.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">{budget.categorie.replace(/_/g, ' ')}</p>
                      <p className="text-xl font-bold">{formatMontant(budget.budget_initial)} F</p>
                    </div>
                    <Badge color={taux > 90 ? 'red' : taux > 70 ? 'yellow' : 'green'}>
                      {taux.toFixed(0)}% utilisé
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getBudgetColor(budget.categorie)}`}
                      style={{ width: `${Math.min(taux, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Consommé: {formatMontant(budget.consomme)} F</span>
                    <span className="text-gray-500">Reste: {formatMontant(budget.reste)} F</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Répartition visuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition du budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{budget.categorie.replace(/_/g, ' ')}</span>
                      <span>{((budget.budget_initial / totalBudget) * 100).toFixed(1)}% - {formatMontant(budget.budget_initial)} F</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-6">
                      <div 
                        className={`h-6 rounded-full ${getBudgetColor(budget.categorie)} flex items-center justify-end pr-2`}
                        style={{ width: `${(budget.budget_initial / totalBudget) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{((budget.budget_initial / totalBudget) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Archives */}
      {activeTab === 'archives' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Archives PBF</h2>
              <p className="text-sm text-gray-500">Documents pour les contrôles du district</p>
            </div>
            <Button onClick={() => handleOpenModal('document')}>
              <Upload className="h-4 w-4 mr-2" />Télécharger document
            </Button>
          </div>

          {/* Statut des documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-700">Documents complets</p>
              <p className="text-2xl font-bold text-green-700">{documents.filter(d => d.statut === 'COMPLET').length}</p>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-700">Documents incomplets</p>
              <p className="text-2xl font-bold text-yellow-700">{documents.filter(d => d.statut === 'INCOMPLET').length}</p>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-sm text-red-700">Documents manquants</p>
              <p className="text-2xl font-bold text-red-700">{documents.filter(d => d.statut === 'MANQUANT').length}</p>
            </Card>
          </div>

          {/* Liste des documents par trimestre */}
          {[1, 2, 3, 4].map((trimestre) => {
            const docsTrimestre = documents.filter(d => d.categorie === `TRIMESTRE_${trimestre}`);
            return (
              <Card key={trimestre}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Trimestre {trimestre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {docsTrimestre.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.nom}</p>
                            <p className="text-xs text-gray-500">{doc.date_upload || 'Non téléchargé'}</p>
                          </div>
                        </div>
                        <Badge color={getStatutColor(doc.statut)}>
                          {doc.statut === 'COMPLET' ? '✓' : doc.statut === 'MANQUANT' ? '✗' : '!'}
                        </Badge>
                      </div>
                    ))}
                    {docsTrimestre.length === 0 && (
                      <p className="text-gray-500 text-sm col-span-2">Aucun document pour ce trimestre</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal通用 */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={
        modalType === 'activite' ? 'Nouvelle activité' :
        modalType === 'reunion' ? 'Nouvelle réunion' :
        modalType === 'evaluation' ? 'Préparer évaluation' :
        modalType === 'imputation' ? 'Nouvelle imputation' :
        modalType === 'document' ? 'Télécharger document' :
        'Nouveau'
      }>
        <div className="space-y-4">
          {modalType === 'activite' && (
            <>
              <Input label="Objectif" placeholder="Ex: Améliorer la CPN1" />
              <Input label="Activité" placeholder="Description de l'activité" />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Trimestre" options={[
                  { value: '1', label: 'Trimestre 1' },
                  { value: '2', label: 'Trimestre 2' },
                  { value: '3', label: 'Trimestre 3' },
                  { value: '4', label: 'Trimestre 4' },
                ]} onChange={() => {}} />
                <Input label="Budget prévu" type="number" placeholder="0" />
              </div>
              <Input label="Responsable" placeholder="Nom du responsable" />
            </>
          )}
          {modalType === 'reunion' && (
            <>
              <Select label="Type de réunion" options={[
                { value: 'MENSUELLE', label: 'Réunion mensuelle' },
                { value: 'TRIMESTRIELLE', label: 'Réunion trimestrielle' },
                { value: 'COGES', label: 'Réunion COGES' },
                { value: 'ASSEMBLEE', label: 'Assemblée générale' },
              ]} onChange={() => {}} />
              <Input label="Date" type="date" />
              <Input label="Thème" placeholder="Thème de la réunion" />
              <Input label="Nombre de participants" type="number" />
            </>
          )}
          {modalType === 'imputation' && (
            <>
              <Select label="Catégorie" options={[
                { value: 'PRIME_PERSONNEL', label: 'Prime du personnel' },
                { value: 'ACHAT_MATERIEL', label: 'Achat matériel' },
                { value: 'FONCTIONNEMENT', label: 'Fonctionnement' },
                { value: 'INVESTISSEMENT', label: 'Investissement' },
              ]} onChange={() => {}} />
              <Input label="Montant" type="number" placeholder="0" />
              <Input label="Motif" placeholder="Description de la dépense" />
            </>
          )}
          {modalType === 'evaluation' && (
            <>
              <Select label="Trimestre" options={[
                { value: '1', label: 'Trimestre 1' },
                { value: '2', label: 'Trimestre 2' },
                { value: '3', label: 'Trimestre 3' },
                { value: '4', label: 'Trimestre 4' },
              ]} onChange={() => {}} />
              <p className="text-sm text-gray-500">Sélectionnez les documents à joindre:</p>
              <div className="space-y-2">
                {['Plan action', 'PV réunions', 'Rapport financier', 'Liste présence'].map((doc) => (
                  <label key={doc} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>{doc}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {modalType === 'document' && (
            <>
              <Input label="Nom du document" placeholder="Nom du fichier" />
              <Select label="Type" options={[
                { value: 'PLAN', label: 'Plan d\'action' },
                { value: 'PV', label: 'PV de réunion' },
                { value: 'LISTE', label: 'Liste de présence' },
                { value: 'RAPPORT', label: 'Rapport' },
                { value: 'DOSSIER', label: 'Dossier' },
                { value: 'BORDEREAU', label: 'Bordereau' },
              ]} onChange={() => {}} />
              <Select label="Trimestre" options={[
                { value: 'TRIMESTRE_1', label: 'Trimestre 1' },
                { value: 'TRIMESTRE_2', label: 'Trimestre 2' },
                { value: 'TRIMESTRE_3', label: 'Trimestre 3' },
                { value: 'TRIMESTRE_4', label: 'Trimestre 4' },
              ]} onChange={() => {}} />
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Glissez-déposez un fichier ou cliquez pour sélectionner</p>
              </div>
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