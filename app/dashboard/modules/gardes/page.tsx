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
  Calendar, Users, Plus, Printer, ChevronLeft, ChevronRight, 
  Home, Baby, Heart, ClipboardList, Save, RotateCcw, Edit
} from 'lucide-react';

// Types
interface Personnel {
  id: string;
  nom: string;
  fonction: string;
  service: 'DISPENSAIRE' | 'MATERNITE' | 'AIDE_SOIGNANTE' | 'FILLE_SALLE';
  telephone: string;
  actif: boolean;
}

interface Garde {
  id: string;
  personnel_id: string;
  date: string;
  jour: number;
  service: 'DISPENSAIRE' | 'MATERNITE' | 'AIDE_SOIGNANTE' | 'FILLE_SALLE';
  periode: string;
  statut: string;
}

const moisFrancais = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const annees = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 1 + i);

// Configuration des services
const serviceConfig = {
  DISPENSAIRE: { label: 'Dispensaire', couleur: 'blue', icon: Home },
  MATERNITE: { label: 'Maternité', couleur: 'pink', icon: Baby },
  AIDE_SOIGNANTE: { label: 'Aide Soignante', couleur: 'green', icon: Heart },
  FILLE_SALLE: { label: 'Filles de Salle', couleur: 'yellow', icon: ClipboardList },
};

export default function GardesPage() {
  // État principal
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'planning' | 'personnel'>('planning');
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('all');
  
  // Personnel avec 16 agents
  const [personnel, setPersonnel] = useState<Personnel[]>([
    // Dispensaire - 5 agents
    { id: '1', nom: 'Dr. Koffi Jean', fonction: 'Médecin Chef', service: 'DISPENSAIRE', telephone: '01 01 01 01', actif: true },
    { id: '2', nom: 'Dr. Koffi Marie', fonction: 'Médecin', service: 'DISPENSAIRE', telephone: '02 02 02 02', actif: true },
    { id: '3', nom: 'Kouamé A. Paul', fonction: 'Infirmier Chef', service: 'DISPENSAIRE', telephone: '03 03 03 03', actif: true },
    { id: '4', nom: 'Bamba P. Fatou', fonction: 'Infirmière', service: 'DISPENSAIRE', telephone: '04 04 04 04', actif: true },
    { id: '5', nom: 'Traoré S. Ali', fonction: 'Infirmier', service: 'DISPENSAIRE', telephone: '05 05 05 05', actif: true },
    
    // Maternité - 4 agents
    { id: '6', nom: 'Dr. Konan R. Marie', fonction: 'Sage-femme Chef', service: 'MATERNITE', telephone: '06 06 06 06', actif: true },
    { id: '7', nom: 'Diallo A. Fatou', fonction: 'Sage-femme', service: 'MATERNITE', telephone: '07 07 07 07', actif: true },
    { id: '8', nom: 'Kouadio Y. Jeanne', fonction: 'Sage-femme', service: 'MATERNITE', telephone: '08 08 08 08', actif: true },
    { id: '9', nom: 'Ouattara K. Paul', fonction: 'Infirmier', service: 'MATERNITE', telephone: '09 09 09 09', actif: true },
    
    // Aide Soignante - 3 agents
    { id: '10', nom: 'Soro G. Marie', fonction: 'Aide-soignante Chef', service: 'AIDE_SOIGNANTE', telephone: '10 10 10 10', actif: true },
    { id: '11', nom: 'Kone F. Fatou', fonction: 'Aide-soignante', service: 'AIDE_SOIGNANTE', telephone: '11 11 11 11', actif: true },
    { id: '12', nom: 'Coulibaly S. Ali', fonction: 'Aide-soignante', service: 'AIDE_SOIGNANTE', telephone: '12 12 12 12', actif: true },
    
    // Filles de Salle - 4 agents
    { id: '13', nom: 'Toure P. Marie', fonction: 'Fille de salle', service: 'FILLE_SALLE', telephone: '13 13 13 13', actif: true },
    { id: '14', nom: 'Bamba K. Fatou', fonction: 'Fille de salle', service: 'FILLE_SALLE', telephone: '14 14 14 14', actif: true },
    { id: '15', nom: 'Koffi Y. Ali', fonction: 'Fille de salle', service: 'FILLE_SALLE', telephone: '15 15 15 15', actif: true },
    { id: '16', nom: "N'guessan A. Paul", fonction: 'Fille de salle', service: 'FILLE_SALLE', telephone: '16 16 16 16', actif: true },
  ]);

  const [gardesSauvegardees, setGardesSauvegardees] = useState<Record<string, Garde[]>>({});
  const [gardesActuelles, setGardesActuelles] = useState<Garde[]>([]);

  // Charger les gardes sauvegardées
  useEffect(() => {
    const key = `${selectedYear}-${selectedMonth}`;
    if (gardesSauvegardees[key]) {
      setGardesActuelles(gardesSauvegardees[key]);
    } else {
      genererPlanningAutomatique();
    }
  }, [selectedMonth, selectedYear]);

  // Génération automatique du planning - TOUS LES JOURS y compris dimanche
  const genererPlanningAutomatique = () => {
    const newGardes: Garde[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Chaque service avec rotation simple
      Object.entries(serviceConfig).forEach(([service, _]) => {
        const servicePersonnel = personnel.filter(p => p.service === service && p.actif);
        if (servicePersonnel.length === 0) return;

        // Rotation simple : jour X agent index = (jour-1) % nbAgents
        const agentIndex = (day - 1) % servicePersonnel.length;
        const agent = servicePersonnel[agentIndex];

        newGardes.push({
          id: `${dateStr}-${service}`,
          personnel_id: agent.id,
          date: dateStr,
          jour: day,
          service: service as any,
          periode: '24h',
          statut: 'PLANIFIEE'
        });
      });
    }

    setGardesActuelles(newGardes);
  };

  // Sauvegarder le planning
  const sauvegarderPlanning = () => {
    const key = `${selectedYear}-${selectedMonth}`;
    setGardesSauvegardees(prev => ({
      ...prev,
      [key]: gardesActuelles
    }));
    alert(`Planning de ${moisFrancais[selectedMonth]} ${selectedYear} sauvegardé !`);
  };

  // Imprimer
  const imprimerPlanning = () => {
    window.print();
  };

  // Navigation mois
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Fonctions utilitaires
  const getPersonnel = (id: string) => personnel.find(p => p.id === id);
  const getServiceConfig = (service: string) => serviceConfig[service as keyof typeof serviceConfig];

  const getGardesForDay = (day: number) => {
    return gardesActuelles.filter(g => 
      g.jour === day && 
      (!selectedService || g.service === selectedService)
    );
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold">📅 Planning des Gardes EPSC</h1>
          <p className="text-gray-500">Tous les jours travaillé - Rotation automatique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={genererPlanningAutomatique}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Régénérer
          </Button>
          <Button variant="secondary" onClick={sauvegarderPlanning}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button onClick={imprimerPlanning}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('planning')}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 ${
            activeTab === 'planning' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Planning Mensuel
        </button>
        <button
          onClick={() => setActiveTab('personnel')}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 ${
            activeTab === 'personnel' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500'
          }`}
        >
          <Users className="h-4 w-4" />
          Personnel (16)
        </button>
      </div>

      {/* PLANNING */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:grid-cols-5">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Période</p>
              <p className="text-xl font-bold">{moisFrancais[selectedMonth]}</p>
              <p className="text-xs text-gray-500">{selectedYear} - {daysInMonth} jours</p>
            </Card>
            {Object.entries(serviceConfig).map(([key, config]) => {
              const Icon = config.icon;
              const count = personnel.filter(p => p.service === key && p.actif).length;
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${config.couleur}-100`}>
                      <Icon className={`h-4 w-4 text-${config.couleur}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{config.label}</p>
                      <p className="text-xl font-bold">{count} agents</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap print:hidden">
            <Button variant={selectedService === 'all' ? 'primary' : 'outline'} onClick={() => setSelectedService('all')}>
              Tous services
            </Button>
            {Object.entries(serviceConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button key={key} variant={selectedService === key ? 'primary' : 'outline'} onClick={() => setSelectedService(key)} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {config.label}
                </Button>
              );
            })}
          </div>

          {/* Navigation mois/année */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border print:hidden">
            <div className="flex gap-4 items-center">
              <Button variant="outline" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-xl font-bold min-w-[140px] text-center">{moisFrancais[selectedMonth]}</h2>
              <Select 
                value={String(selectedYear)} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                options={annees.map(a => ({ value: String(a), label: String(a) }))}
                className="w-24"
              />
              <Button variant="outline" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="text-sm text-gray-500">{gardesActuelles.filter(g => !selectedService || g.service === selectedService).length} gardes</div>
          </div>

          {/* Calendrier - Version imprimable */}
          <div className="print:w-full">
            <div className="text-center mb-4">
              <h1 className="text-xl md:text-2xl font-bold">Établissement Public de Santé de Contrôle</h1>
              <h2 className="text-lg md:text-xl font-semibold text-gray-600">Planning des Gardes - {moisFrancais[selectedMonth]} {selectedYear}</h2>
            </div>
            
            <Card className="print:border-none print:shadow-none">
              <CardContent className="p-2 print:p-0">
                {/* Grille des jours */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const gardies = getGardesForDay(day);
                    const isToday = new Date(selectedYear, selectedMonth, day).toDateString() === new Date().toDateString();
                    
                    return (
                      <div 
                        key={day}
                        className={`min-h-24 p-1 border rounded print:border print:h-28 ${isToday ? 'bg-blue-50 print:bg-gray-100' : 'bg-white'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold ${isToday ? 'text-blue-600' : ''}`}>{day}</span>
                        </div>
                        <div className="space-y-0.5">
                          {gardies.slice(0, 4).map((garde) => {
                            const p = getPersonnel(garde.personnel_id);
                            const config = getServiceConfig(garde.service);
                            // Extraire le nom de famille
                            const nomAffiche = p?.nom.split(' ').slice(1).join(' ') || '';
                            
                            return (
                              <div 
                                key={garde.id}
                                className={`text-[9px] p-0.5 rounded leading-tight print:text-xs font-medium ${
                                  config.couleur === 'blue' ? 'bg-blue-100 text-blue-700' :
                                  config.couleur === 'pink' ? 'bg-pink-100 text-pink-700' :
                                  config.couleur === 'green' ? 'bg-green-100 text-green-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}
                                title={`${config.label} - ${p?.nom}`}
                              >
                                {config.label === 'Filles de Salle' ? '' : config.label === 'Dispensaire' ? '🏥' : config.label === 'Maternité' ? '👶' : config.label === 'Aide Soignante' ? '💚' : ''}
                                {nomAffiche}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste détaillée */}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Liste - {moisFrancais[selectedMonth]} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Fonction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gardesActuelles
                    .filter(g => !selectedService || g.service === selectedService)
                    .slice(0, 60)
                    .map((garde) => {
                      const p = getPersonnel(garde.personnel_id);
                      const config = getServiceConfig(garde.service);
                      return (
                        <TableRow key={garde.id}>
                          <TableCell className="font-bold">{garde.jour}</TableCell>
                          <TableCell>
                            <Badge className={`bg-${config.couleur}-100 text-${config.couleur}-700`}>
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{p?.nom}</TableCell>
                          <TableCell className="text-gray-500">{p?.fonction}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PERSONNEL */}
      {activeTab === 'personnel' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <div>
              <h2 className="text-xl font-semibold">👥 Personnel - Rotation Automatique</h2>
              <p className="text-sm text-gray-500">16 agents | Rotation par jour</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Agent
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(serviceConfig).map(([key, config]) => {
              const Icon = config.icon;
              const agents = personnel.filter(p => p.service === key);
              return (
                <Card key={key}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </CardTitle>
                    <Badge>{agents.length} agents</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{agent.nom}</p>
                          <p className="text-xs text-gray-500">{agent.fonction}</p>
                        </div>
                        <Badge color={agent.actif ? 'green' : 'gray'}>{agent.actif ? 'Actif' : 'Inactif'}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal ajout personnel */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter un Agent" size="md">
        <div className="space-y-4">
          <Input label="Nom complet" placeholder="Nom et prénom" />
          <Input label="Fonction" placeholder="Ex: Infirmier" />
          <Select label="Service" options={[
            { value: 'DISPENSAIRE', label: 'Dispensaire' },
            { value: 'MATERNITE', label: 'Maternité' },
            { value: 'AIDE_SOIGNANTE', label: 'Aide Soignante' },
            { value: 'FILLE_SALLE', label: 'Filles de Salle' },
          ]} onChange={() => {}} />
          <Input label="Téléphone" placeholder="01 01 01 01" />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={() => setShowModal(false)}>Ajouter</Button>
          </div>
        </div>
      </Modal>

      {/* Styles impression */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; }
          body { font-size: 9px; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}