'use client';

import { useState } from 'react';
import { Plus, Search, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ExportButton } from '@/components/ui/ExportButton';
import { calculateAge, formatDate } from '@/lib/utils';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données mockées
  const patients = [
    { id: '1', numero: 'EPS-2024-00001', nom: 'Koné', prenom: 'Mariam', dateNaiss: '1990-05-15', genre: 'FEMININ', telephone: '07 00 00 00 01', adresse: 'Abidjan' },
    { id: '2', numero: 'EPS-2024-00002', nom: 'Diallo', prenom: 'Abdoulaye', dateNaiss: '1985-08-20', genre: 'MASCULIN', telephone: '07 00 00 00 02', adresse: 'Yopougon' },
    { id: '3', numero: 'EPS-2024-00003', nom: 'Bamba', prenom: 'Aissata', dateNaiss: '2019-03-10', genre: 'FEMININ', telephone: '07 00 00 00 03', adresse: 'Cocody' },
    { id: '4', numero: 'EPS-2024-00004', nom: 'Traoré', prenom: 'Lassina', dateNaiss: '1975-12-25', genre: 'MASCULIN', telephone: '07 00 00 00 04', adresse: 'Plateau' },
    { id: '5', numero: 'EPS-2024-00005', nom: 'Koffi', prenom: 'Adélaïde', dateNaiss: '1995-07-08', genre: 'FEMININ', telephone: '07 00 00 00 05', adresse: 'Treichville' },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Préparer les données pour l'export
  const exportData = filteredPatients.map(p => ({
    Numéro: p.numero,
    Nom: p.nom,
    Prénom: p.prenom,
    'Date de naissance': formatDate(p.dateNaiss),
    Âge: calculateAge(p.dateNaiss) + ' ans',
    Genre: p.genre === 'FEMININ' ? 'Femme' : 'Homme',
    Téléphone: p.telephone,
    Adresse: p.adresse,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-500 dark:text-slate-400">Gestion des dossiers patients</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            data={exportData} 
            filename="liste_patients" 
            title="Exporter"
          />
          <Button onClick={() => setIsModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">Total patients</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{patients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">Consultations aujourd'hui</p>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">Nouveaux ce mois</p>
            <p className="text-2xl font-bold text-green-600">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">Patients en cours</p>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, prénom ou numéro de dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{patient.numero}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{patient.nom}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{patient.prenom}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{formatDate(patient.dateNaiss)}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{calculateAge(patient.dateNaiss)} ans</TableCell>
                  <TableCell>
                    <Badge variant={patient.genre === 'FEMININ' ? 'info' : 'success'}>
                      {patient.genre === 'FEMININ' ? 'Femme' : 'Homme'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{patient.telephone}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau patient"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nom" placeholder="Koné" required />
            <Input label="Prénom" placeholder="Mariam" required />
            <Input label="Date de naissance" type="date" required />
            <Input label="Lieu de naissance" placeholder="Abidjan" />
            <Input label="Téléphone" placeholder="07 00 00 00 00" type="tel" />
            <Input label="Adresse" placeholder="Quartier, Ville" />
            <Input label="Personne de contact" placeholder="Nom complet" />
            <Input label="Téléphone contact" placeholder="07 00 00 00 00" type="tel" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}