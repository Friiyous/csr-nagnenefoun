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
  ClipboardCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
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
  Sparkles,
  Building,
  Activity,
  Wrench,
  MapPin,
  AlertCircle,
  Clock,
  RefreshCw,
  Package,
  Shield,
  Phone
} from 'lucide-react';

// Types pour le module Hygiène EPSC
interface EquipeHygiene {
  id: string;
  nom: string;
  fonction: string;
  telephone: string;
  role: 'RESPONSABLE' | 'AGENT' | 'SUPERVISEUR' | 'TECHNICIEN';
  actif: boolean;
}

interface EspaceHygiene {
  id: string;
  nom: string;
  localisation: string;
  superficie: string;
  type: 'LAVAGE_MAINS' | 'TOILETTES' | 'DOUCHE' | 'STOCKAGE' | 'INCINERATEUR' | 'CHAMBRE_FROIDE' | 'BUANDERIE' | 'CABINET';
  equipements: string[];
  statut: 'BON' | 'MOYEN' | 'MAUVAIS' | 'HORS_SERVICE';
  dernier_nettoyage: string;
  prochaine_action: string;
  responsable: string;
}

interface EquipementHygiene {
  id: string;
  nom: string;
  marque: string;
  numero_serie: string;
  localisation: string;
  date_acquisition: string;
  etat: 'FONCTIONNEL' | 'PANNE' | 'EN_REPARATION' | 'HORS_SERVICE';
  date_derniere_maintenance: string;
  prochaine_maintenance: string;
  fournisseur: string;
  cout_maintenance: number;
}

interface ProblemeHygiene {
  id: string;
  date_signalement: string;
  espace: string;
  description: string;
  priorite: 'FAIBLE' | 'MOYENNE' | 'ELEVEE' | 'CRITIQUE';
  statut: 'SIGNALE' | 'EN_COURS' | 'RESOLU' | 'CLOTURE';
  responsable: string;
  date_resolution?: string;
  observations?: string;
}

interface InterventionMaintenance {
  id: string;
  date: string;
  equipement: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'CURATIVE';
  description: string;
  technicien: string;
  cout: number;
  duree: string;
  pieces_changees: string[];
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

export default function HygienePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipes' | 'espaces' | 'equipements' | 'problemes' | 'interventions'>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Données EPSC
  const equipes: EquipeHygiene[] = [
    { id: '1', nom: 'Kouamé Jean', fonction: 'Responsable Hygiène', telephone: '07 07 07 07', role: 'RESPONSABLE', actif: true },
    { id: '2', nom: 'Bamba Paul', fonction: 'Agent d\'entretien', telephone: '05 05 05 05', role: 'AGENT', actif: true },
    { id: '3', nom: 'Traoré Fatou', fonction: 'Agent d\'entretien', telephone: '08 08 08 08', role: 'AGENT', actif: true },
    { id: '4', nom: 'Diallo Ali', fonction: 'Technicien maintenance', telephone: '09 09 09 09', role: 'TECHNICIEN', actif: true },
    { id: '5', nom: 'Dr. Koffi Marie', fonction: 'Superviseur médical', telephone: '01 01 01 01', role: 'SUPERVISEUR', actif: true },
  ];

  const espaces: EspaceHygiene[] = [
    { id: '1', nom: 'Lavage mains - Entrée principale', localisation: 'Bâtiment A - Entrée', superficie: '4 m²', type: 'LAVAGE_MAINS', equipements: ['Robinet automatique', 'Distributeur savon', 'Papier essuie-mains', 'Poubelle pedal'], statut: 'BON', dernier_nettoyage: '2025-01-15', prochaine_action: 'Réapprovisionnement savon', responsable: 'Bamba Paul' },
    { id: '2', nom: 'Lavage mains - Laboratoire', localisation: 'Bâtiment B - Labo', superficie: '3 m²', type: 'LAVAGE_MAINS', equipements: ['Robinet', 'Distributeur SHA', 'Poubelle'], statut: 'BON', dernier_nettoyage: '2025-01-15', prochaine_action: 'Vérifier thermostat', responsable: 'Traoré Fatou' },
    { id: '3', nom: 'Toilettes personnel', localisation: 'Bâtiment A - Rdc', superficie: '8 m²', type: 'TOILETTES', equipements: ['3 cuvettes', '2 lavabos', 'Miroir', 'Porte-serviettes'], statut: 'MOYEN', dernier_nettoyage: '2025-01-14', prochaine_action: 'Réparer fuite robinet', responsable: 'Bamba Paul' },
    { id: '4', nom: 'Toilettes consultation', localisation: 'Bâtiment B - Rdc', superficie: '6 m²', type: 'TOILETTES', equipements: ['2 cuvettes', '1 lavabo', 'Accessibilité PMR'], statut: 'BON', dernier_nettoyage: '2025-01-15', prochaine_action: 'Aucune', responsable: 'Traoré Fatou' },
    { id: '5', nom: 'Local incinérateur', localisation: 'Extérieur - Angle SO', superficie: '12 m²', type: 'INCINERATEUR', equipements: ['Incinérateur modèle X', 'Extincteur', 'Conduite fumées', 'Compteur'], statut: 'MOYEN', dernier_nettoyage: '2025-01-10', prochaine_action: 'Remplacer joints porte', responsable: 'Diallo Ali' },
    { id: '6', nom: 'Chambre froide médicaments', localisation: 'Pharmacie', superficie: '9 m²', type: 'CHAMBRE_FROIDE', equipements: ['Groupe froid', 'Thermomètre digital', 'Etagères inox', 'Alarme température'], statut: 'BON', dernier_nettoyage: '2025-01-14', prochaine_action: 'Calibrage mensuel', responsable: 'Kouamé Jean' },
    { id: '7', nom: 'Douche personnel', localisation: 'Bâtiment A - Etage', superficie: '10 m²', type: 'DOUCHE', equipements: ['3 douches', 'Porte-serviettes', 'Banc'], statut: 'MAUVAIS', dernier_nettoyage: '2025-01-12', prochaine_action: 'Rénovation complète', responsable: 'Bamba Paul' },
    { id: '8', nom: 'Local déchets', localisation: 'Extérieur - Angle SE', superficie: '15 m²', type: 'STOCKAGE', equipements: ['Fûts jaunes 50L x 4', 'Fûts rouges 50L x 2', 'Bac de stockage', 'Registre'], statut: 'MOYEN', dernier_nettoyage: '2025-01-15', prochaine_action: 'Vérifier ventilation', responsable: 'Traoré Fatou' },
  ];

  const equipements: EquipementHygiene[] = [
    { id: '1', nom: 'Incinérateur Principal', marque: 'M-Tech', numero_serie: 'MT-2021-0847', localisation: 'Local incinérateur', date_acquisition: '2021-06-15', etat: 'FONCTIONNEL', date_derniere_maintenance: '2024-12-10', prochaine_maintenance: '2025-03-10', fournisseur: 'MédiEquip CI', cout_maintenance: 150000 },
    { id: '2', nom: 'Groupe froid chambre froide', marque: 'Carrier', numero_serie: 'CR-45678', localisation: 'Pharmacie', date_acquisition: '2020-03-20', etat: 'FONCTIONNEL', date_derniere_maintenance: '2025-01-05', prochaine_maintenance: '2025-04-05', fournisseur: 'FroidServices', cout_maintenance: 85000 },
    { id: '3', nom: 'Autoclave de stérilisation', marque: 'Tuttnauer', numero_serie: 'TV-78901', localisation: 'Salle de soins', date_acquisition: '2019-08-10', etat: 'EN_REPARATION', date_derniere_maintenance: '2024-11-20', prochaine_maintenance: '2025-02-20', fournisseur: 'SterilTech', cout_maintenance: 0 },
    { id: '4', nom: 'Lave-mains automatique Entrée', marque: 'Sloan', numero_serie: 'SL-23456', localisation: 'Entrée principale', date_acquisition: '2022-01-15', etat: 'FONCTIONNEL', date_derniere_maintenance: '2025-01-10', prochaine_maintenance: '2025-04-10', fournisseur: 'HygienePro', cout_maintenance: 25000 },
    { id: '5', nom: 'Pompe doseuse chlore', marque: 'Prominent', numero_serie: 'PM-34567', localisation: 'Local technique', date_acquisition: '2021-04-20', etat: 'PANNE', date_derniere_maintenance: '2024-10-15', prochaine_maintenance: '2025-01-20', fournisseur: 'EauTech', cout_maintenance: 0 },
  ];

  const problemes: ProblemeHygiene[] = [
    { id: '1', date_signalement: '2025-01-14', espace: 'Douche personnel', description: 'Fuite au niveau du pommeau de douche n°2, murs humides', priorite: 'MOYENNE', statut: 'EN_COURS', responsable: 'Diallo Ali', observations: 'Pièces commandées' },
    { id: '2', date_signalement: '2025-01-13', espace: 'Local incinérateur', description: 'Joints de la porte de combustion usés, fumée visible', priorite: 'ELEVEE', statut: 'EN_COURS', responsable: 'Diallo Ali', observations: 'En attente livraison joints' },
    { id: '3', date_signalement: '2025-01-12', espace: 'Toilettes personnel', description: 'Fuite sous le lavabo du WC n°1', priorite: 'MOYENNE', statut: 'SIGNALE', responsable: 'Bamba Paul' },
    { id: '4', date_signalement: '2025-01-10', espace: 'Pompe doseuse chlore', description: 'Pompe ne dose plus, indicateurs au rouge', priorite: 'CRITIQUE', statut: 'EN_COURS', responsable: 'Diallo Ali', observations: 'Technicien contacté' },
    { id: '5', date_signalement: '2025-01-08', espace: 'Autoclave', description: 'Message d\'erreur sur la température', priorite: 'ELEVEE', statut: 'EN_REPARATION', responsable: 'Technicien externe', date_resolution: '2025-01-20', observations: 'Sous garantie' },
    { id: '6', date_signalement: '2025-01-05', espace: 'Local déchets', description: 'Ventilation insuffisante, odeur persistante', priorite: 'FAIBLE', statut: 'RESOLU', responsable: 'Bamba Paul', date_resolution: '2025-01-10', observations: 'Ventilateur ajouté' },
  ];

  const interventions: InterventionMaintenance[] = [
    { id: '1', date: '2025-01-10', equipement: 'Incinérateur Principal', type: 'PREVENTIVE', description: 'Maintenance trimestrielle, nettoyage chambre, vérification brûleur', technicien: 'Diallo Ali', cout: 150000, duree: '3h', pieces_changees: ['Filtre à fuel', 'Joint porte'] },
    { id: '2', date: '2025-01-05', equipement: 'Groupe froid chambre froide', type: 'PREVENTIVE', description: 'Vérification température, nettoyage condenseur', technicien: 'Diallo Ali', cout: 85000, duree: '1h30', pieces_changees: [] },
    { id: '3', date: '2024-12-20', equipement: 'Lave-mains automatique', type: 'CORRECTIVE', description: 'Remplacement capteur détection', technicien: 'Technicien externe', cout: 45000, duree: '30min', pieces_changees: ['Capteur IR'] },
    { id: '4', date: '2024-11-25', equipement: 'Autoclave de stérilisation', type: 'CORRECTIVE', description: 'Diagnostic panne température', technicien: 'SterilTech', cout: 0, duree: '2h', pieces_changees: [] },
  ];

  // Calculs des stats
  const espacesTotal = espaces.length;
  const espacesBon = espaces.filter(e => e.statut === 'BON').length;
  const espacesMoyen = espaces.filter(e => e.statut === 'MOYEN').length;
  const espacesMauvais = espaces.filter(e => e.statut === 'MAUVAIS' || e.statut === 'HORS_SERVICE').length;
  const equipementsFonctionnels = equipements.filter(e => e.etat === 'FONCTIONNEL').length;
  const equipementsPanne = equipements.filter(e => e.etat === 'PANNE' || e.etat === 'EN_REPARATION').length;
  const problemesEnCours = problemes.filter(p => p.statut === 'EN_COURS' || p.statut === 'SIGNALE').length;
  const problemesCritiques = problemes.filter(p => p.priorite === 'CRITIQUE' && p.statut !== 'RESOLU' && p.statut !== 'CLOTURE').length;

  const scoreGlobal = Math.round((espacesBon * 100 + espacesMoyen * 50) / (espacesTotal * 100) * 100);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'BON':
      case 'FONCTIONNEL':
      case 'RESOLU':
      case 'CLOTURE': return 'green';
      case 'MOYEN':
      case 'EN_REPARATION':
      case 'EN_COURS': return 'yellow';
      case 'MAUVAIS':
      case 'HORS_SERVICE':
      case 'PANNE':
      case 'SIGNALE': return 'red';
      default: return 'gray';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'CRITIQUE': return 'red';
      case 'ELEVEE': return 'orange';
      case 'MOYENNE': return 'yellow';
      case 'FAIBLE': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LAVAGE_MAINS': return <Sparkles className="h-5 w-5 text-green-600" />;
      case 'TOILETTES': return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'DOUCHE': return <Activity className="h-5 w-5 text-purple-600" />;
      case 'INCINERATEUR': return <Thermometer className="h-5 w-5 text-orange-600" />;
      case 'CHAMBRE_FROIDE': return <Droplets className="h-5 w-5 text-cyan-600" />;
      case 'STOCKAGE': return <Package className="h-5 w-5 text-gray-600" />;
      default: return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'RESPONSABLE': return <Users className="h-4 w-4 text-blue-600" />;
      case 'TECHNICIEN': return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'SUPERVISEUR': return <Shield className="h-4 w-4 text-purple-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
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
          <h1 className="text-2xl font-bold">Gestion de l'Hygiène</h1>
          <p className="text-gray-500">Établissement Public de Santé de Contrôle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Rapport mensuel
          </Button>
          <Button onClick={() => handleOpenModal('probleme')}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Signaler problème
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {[
          { key: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
          { key: 'equipes', icon: Users, label: 'Équipe' },
          { key: 'espaces', icon: Building, label: 'Espaces' },
          { key: 'equipements', icon: Wrench, label: 'Équipements' },
          { key: 'problemes', icon: AlertTriangle, label: 'Problèmes' },
          { key: 'interventions', icon: Clock, label: 'Interventions' },
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
          {/* Alertes critiques */}
          {problemesCritiques > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">{problemesCritiques} problème(s) critique(s) en attente</p>
                    <p className="text-sm text-red-600">Intervention immédiate requise</p>
                  </div>
                  <Button variant="destructive" size="sm" className="ml-auto" onClick={() => setActiveTab('problemes')}>
                    Voir les problèmes
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
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Espaces suivis</p>
                  <p className="text-2xl font-bold">{espacesTotal}</p>
                  <p className="text-xs text-green-600">{espacesBon} en bon état</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Équipements OK</p>
                  <p className="text-2xl font-bold">{equipementsFonctionnels}/{equipements.length}</p>
                  <p className="text-xs text-red-600">{equipementsPanne} en panne</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Problèmes actifs</p>
                  <p className="text-2xl font-bold">{problemesEnCours}</p>
                  <p className="text-xs text-gray-500">En attente</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Score global</p>
                  <p className={`text-2xl font-bold ${scoreGlobal >= 80 ? 'text-green-600' : scoreGlobal >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{scoreGlobal}%</p>
                  <p className="text-xs text-gray-500">Hygiène du centre</p>
                </div>
              </div>
            </Card>
          </div>

          {/* État des espaces */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-700">Espaces en bon état</p>
                  <p className="text-2xl font-bold text-green-700">{espacesBon}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-700">À surveiller</p>
                  <p className="text-2xl font-bold text-yellow-700">{espacesMoyen}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-700">À rénover</p>
                  <p className="text-2xl font-bold text-red-700">{espacesMauvais}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Problèmes récents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Problèmes récents</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('problemes')}>Voir tout</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Espace</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problemes.slice(0, 5).map((probleme) => (
                    <TableRow key={probleme.id}>
                      <TableCell className="font-medium">{probleme.espace}</TableCell>
                      <TableCell className="max-w-xs truncate">{probleme.description}</TableCell>
                      <TableCell>
                        <Badge color={getPrioriteColor(probleme.priorite)}>{probleme.priorite}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge color={getStatutColor(probleme.statut)}>{probleme.statut}</Badge>
                      </TableCell>
                      <TableCell>{probleme.responsable}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Espaces critiques */}
          <Card>
            <CardHeader>
              <CardTitle>Espaces nécessitant une attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {espaces.filter(e => e.statut === 'MAUVAIS' || e.statut === 'MOYEN').map((espace) => (
                  <div key={espace.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(espace.type)}
                        <span className="font-medium">{espace.nom}</span>
                      </div>
                      <Badge color={getStatutColor(espace.statut)}>{espace.statut}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{espace.localisation}</p>
                    <div className="bg-yellow-50 p-2 rounded text-sm">
                      <span className="font-medium">Prochaine action: </span>
                      {espace.prochaine_action}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Responsable: {espace.responsable}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Équipe */}
      {activeTab === 'equipes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Équipe d'hygiène</h2>
              <p className="text-sm text-gray-500">Personnel responsable de l'hygiène du centre</p>
            </div>
            <Button onClick={() => handleOpenModal('equipe')}>
              <Plus className="h-4 w-4 mr-2" />Ajouter membre
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipes.map((membre) => (
              <Card key={membre.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      {getRoleIcon(membre.role)}
                    </div>
                    <div>
                      <p className="font-medium">{membre.nom}</p>
                      <p className="text-sm text-gray-500">{membre.fonction}</p>
                    </div>
                  </div>
                  <Badge color={membre.actif ? 'green' : 'gray'}>
                    {membre.actif ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    {membre.telephone}
                  </div>
                  <Badge className="mt-2">{membre.role}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Espaces */}
      {activeTab === 'espaces' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Espaces d'hygiène</h2>
              <p className="text-sm text-gray-500">Suivi des locaux et installations</p>
            </div>
            <Button onClick={() => handleOpenModal('espace')}>
              <Plus className="h-4 w-4 mr-2" />Ajouter espace
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {espaces.map((espace) => (
              <Card key={espace.id} className={`p-4 ${espace.statut === 'MAUVAIS' ? 'border-red-300 bg-red-50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(espace.type)}
                    <span className="font-medium text-sm">{espace.nom}</span>
                  </div>
                  <Badge color={getStatutColor(espace.statut)}>{espace.statut}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{espace.localisation}
                </p>
                <p className="text-xs text-gray-500 mb-2">{espace.superficie}</p>
                <div className="text-xs bg-gray-100 p-2 rounded mb-2">
                  <p className="font-medium mb-1">Équipements:</p>
                  <ul className="list-disc list-inside">
                    {espace.equipements.slice(0, 3).map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                    {espace.equipements.length > 3 && <li>+{espace.equipements.length - 3} autres</li>}
                  </ul>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>Dernier nettoyage: {formatDate(espace.dernier_nettoyage)}</span>
                </div>
                <p className="text-xs text-orange-600 mt-1 font-medium">⚠ {espace.prochaine_action}</p>
                <p className="text-xs text-gray-500 mt-1">Resp: {espace.responsable}</p>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleOpenModal('espace', espace)}>
                  <Edit className="h-3 w-3 mr-1" />Modifier
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Équipements */}
      {activeTab === 'equipements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Équipements d'hygiène</h2>
              <p className="text-sm text-gray-500">Suivi du matériel et maintenance</p>
            </div>
            <Button onClick={() => handleOpenModal('equipement')}>
              <Plus className="h-4 w-4 mr-2" />Ajouter équipement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-700">Fonctionnels</p>
              <p className="text-2xl font-bold text-green-700">{equipements.filter(e => e.etat === 'FONCTIONNEL').length}</p>
            </Card>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-700">En réparation</p>
              <p className="text-2xl font-bold text-yellow-700">{equipements.filter(e => e.etat === 'EN_REPARATION').length}</p>
            </Card>
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-sm text-red-700">En panne</p>
              <p className="text-2xl font-bold text-red-700">{equipements.filter(e => e.etat === 'PANNE').length}</p>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Équipement</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Dernière maintenance</TableHead>
                    <TableHead>Prochaine</TableHead>
                    <TableHead>Coût</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipements.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{eq.nom}</p>
                          <p className="text-xs text-gray-500">{eq.marque} - {eq.numero_serie}</p>
                        </div>
                      </TableCell>
                      <TableCell>{eq.localisation}</TableCell>
                      <TableCell>
                        <Badge color={getStatutColor(eq.etat)}>{eq.etat.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(eq.date_derniere_maintenance)}</TableCell>
                      <TableCell>{formatDate(eq.prochaine_maintenance)}</TableCell>
                      <TableCell>{formatMontant(eq.cout_maintenance)} F</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Problèmes */}
      {activeTab === 'problemes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Problèmes et signalements</h2>
              <p className="text-sm text-gray-500">Suivi des dysfonctionnements</p>
            </div>
            <Button onClick={() => handleOpenModal('probleme')}>
              <Plus className="h-4 w-4 mr-2" />Signaler un problème
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Signalés</p>
              <p className="text-2xl font-bold">{problemes.filter(p => p.statut === 'SIGNALE').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold">{problemes.filter(p => p.statut === 'EN_COURS').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Résolus</p>
              <p className="text-2xl font-bold">{problemes.filter(p => p.statut === 'RESOLU').length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-red-600">{problemesCritiques}</p>
            </Card>
          </div>

          <div className="space-y-4">
            {problemes.map((probleme) => (
              <Card key={probleme.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getPrioriteColor(probleme.priorite) === 'red' ? 'bg-red-100' : getPrioriteColor(probleme.priorite) === 'orange' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                      <AlertTriangle className={`h-5 w-5 ${getPrioriteColor(probleme.priorite) === 'red' ? 'text-red-600' : getPrioriteColor(probleme.priorite) === 'orange' ? 'text-orange-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{probleme.espace}</p>
                      <p className="text-sm text-gray-600">{probleme.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Signalé le {formatDate(probleme.date_signalement)} par {probleme.responsable}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge color={getPrioriteColor(probleme.priorite)}>{probleme.priorite}</Badge>
                    <Badge color={getStatutColor(probleme.statut)} className="ml-2">{probleme.statut}</Badge>
                  </div>
                </div>
                {probleme.observations && (
                  <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
                    <span className="font-medium">Observations: </span>{probleme.observations}
                  </div>
                )}
                {probleme.date_resolution && (
                  <p className="text-xs text-green-600 mt-2">Résolu le {formatDate(probleme.date_resolution)}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Interventions */}
      {activeTab === 'interventions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Interventions et maintenance</h2>
              <p className="text-sm text-gray-500">Historique des interventions</p>
            </div>
            <Button onClick={() => handleOpenModal('intervention')}>
              <Plus className="h-4 w-4 mr-2" />Nouvelle intervention
            </Button>
          </div>

          {/* Coût total */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-700">Coût total des interventions (2025)</p>
                  <p className="text-3xl font-bold text-blue-700">{formatMontant(interventions.reduce((sum, i) => sum + i.cout, 0))} F</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Nombre d'interventions</p>
                  <p className="text-2xl font-bold text-blue-700">{interventions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {interventions.map((intervention) => (
              <Card key={intervention.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{intervention.equipement}</span>
                      <Badge color={intervention.type === 'PREVENTIVE' ? 'green' : intervention.type === 'CORRECTIVE' ? 'yellow' : 'red'}>
                        {intervention.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{intervention.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {intervention.date} - {intervention.duree} - {intervention.technicien}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatMontant(intervention.cout)} F</p>
                  </div>
                </div>
                {intervention.pieces_changees.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-gray-600">Pièces changées:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {intervention.pieces_changees.map((piece, i) => (
                        <Badge key={i} variant="outline">{piece}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal générique */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={
        modalType === 'equipe' ? 'Nouveau membre' :
        modalType === 'espace' ? 'Nouvel espace' :
        modalType === 'equipement' ? 'Nouvel équipement' :
        modalType === 'probleme' ? 'Signaler un problème' :
        modalType === 'intervention' ? 'Nouvelle intervention' :
        'Nouveau'
      } size="lg">
        <div className="space-y-4">
          {modalType === 'equipe' && (
            <>
              <Input label="Nom complet" placeholder="Nom et prénom" />
              <Input label="Fonction" placeholder="Ex: Agent d'entretien" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Téléphone" placeholder="07 07 07 07" />
                <Select label="Rôle" options={[
                  { value: 'RESPONSABLE', label: 'Responsable' },
                  { value: 'AGENT', label: 'Agent' },
                  { value: 'TECHNICIEN', label: 'Technicien' },
                  { value: 'SUPERVISEUR', label: 'Superviseur' },
                ]} onChange={() => {}} />
              </div>
            </>
          )}
          {modalType === 'espace' && (
            <>
              <Input label="Nom de l'espace" placeholder="Ex: Lavage mains - Entrée" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Localisation" placeholder="Bâtiment A - Rdc" />
                <Input label="Superficie" placeholder="4 m²" />
              </div>
              <Select label="Type" options={[
                { value: 'LAVAGE_MAINS', label: 'Lavage mains' },
                { value: 'TOILETTES', label: 'Toilettes' },
                { value: 'DOUCHE', label: 'Douche' },
                { value: 'INCINERATEUR', label: 'Incinérateur' },
                { value: 'CHAMBRE_FROIDE', label: 'Chambre froide' },
                { value: 'STOCKAGE', label: 'Stockage' },
              ]} onChange={() => {}} />
              <Input label="Responsable" placeholder="Nom du responsable" />
              <Input label="Équipements (séparés par virgule)" placeholder="Robinet, Savon, etc." />
            </>
          )}
          {modalType === 'equipement' && (
            <>
              <Input label="Nom de l'équipement" placeholder="Ex: Incinérateur Principal" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Marque" placeholder="Ex: M-Tech" />
                <Input label="Numéro de série" placeholder="MT-2021-0847" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Localisation" placeholder="Local incinérateur" />
                <Input label="Date d'acquisition" type="date" />
              </div>
              <Input label="Fournisseur" placeholder="Nom du fournisseur" />
            </>
          )}
          {modalType === 'probleme' && (
            <>
              <Select label="Espace concerné" options={espaces.map(e => ({ value: e.nom, label: e.nom }))} onChange={() => {}} />
              <Select label="Priorité" options={[
                { value: 'FAIBLE', label: 'Faible' },
                { value: 'MOYENNE', label: 'Moyenne' },
                { value: 'ELEVEE', label: 'Élevée' },
                { value: 'CRITIQUE', label: 'Critique' },
              ]} onChange={() => {}} />
              <Input label="Description du problème" placeholder="Décrivez le problème..." />
              <Input label="Responsable du suivi" placeholder="Nom du responsable" />
            </>
          )}
          {modalType === 'intervention' && (
            <>
              <Select label="Équipement" options={equipements.map(e => ({ value: e.nom, label: e.nom }))} onChange={() => {}} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" />
                <Select label="Type" options={[
                  { value: 'PREVENTIVE', label: 'Préventive' },
                  { value: 'CORRECTIVE', label: 'Corrective' },
                  { value: 'CURATIVE', label: 'Curative' },
                ]} onChange={() => {}} />
              </div>
              <Input label="Description" placeholder="Description de l'intervention" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Technicien" placeholder="Nom du technicien" />
                <Input label="Coût (F CFA)" type="number" placeholder="0" />
              </div>
              <Input label="Pièces changées" placeholder="Séparées par virgule" />
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