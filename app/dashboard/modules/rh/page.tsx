'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { personnelApi } from '@/lib/api-supabase';

interface Personnel {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  fonction: string;
  categorie: string;
  specialite?: string;
  telephone?: string;
  email?: string;
  statut: string;
}

export default function RHPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    fonction: '',
    categorie: 'B',
    specialite: '',
    telephone: '',
    email: '',
    statut: 'ACTIF',
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const data = await personnelApi.getAll();
      setPersonnel(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPersonnel) {
        await personnelApi.update(editingPersonnel.id, formData);
      } else {
        await personnelApi.create(formData);
      }
      fetchPersonnel();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (p: Personnel) => {
    setEditingPersonnel(p);
    setFormData({
      matricule: p.matricule,
      nom: p.nom,
      prenom: p.prenom,
      fonction: p.fonction,
      categorie: p.categorie,
      specialite: p.specialite || '',
      telephone: p.telephone || '',
      email: p.email || '',
      statut: p.statut,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce personnel ?')) {
      try {
        await personnelApi.delete(id);
        fetchPersonnel();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingPersonnel(null);
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      fonction: '',
      categorie: 'B',
      specialite: '',
      telephone: '',
      email: '',
      statut: 'ACTIF',
    });
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF': return 'green';
      case 'CONGE': return 'yellow';
      case 'MISSION': return 'blue';
      case 'SUSPENDU': return 'red';
      case 'RETRAITE': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
        <Button onClick={() => setShowModal(true)}>+ Ajouter un agent</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total personnel</p>
          <p className="text-2xl font-bold">{personnel.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600">
            {personnel.filter(p => p.statut === 'ACTIF').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">En congé</p>
          <p className="text-2xl font-bold text-yellow-600">
            {personnel.filter(p => p.statut === 'CONGE').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Catégories A</p>
          <p className="text-2xl font-bold text-blue-600">
            {personnel.filter(p => p.categorie === 'A').length}
          </p>
        </Card>
      </div>

      {/* Personnel Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste du personnel</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : personnel.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun personnel enregistré</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.matricule}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{p.nom} {p.prenom}</p>
                        <p className="text-sm text-gray-500">{p.telephone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{p.fonction}</TableCell>
                    <TableCell>
                      <Badge>Catégorie {p.categorie}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getStatutColor(p.statut)}>{p.statut}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(p)}>
                          Modifier
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingPersonnel ? 'Modifier le personnel' : 'Nouveau personnel'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Matricule"
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
            />
            <Select
              label="Catégorie"
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              options={[
                { value: 'A', label: 'A - Cadres supérieurs' },
                { value: 'B', label: 'B - Cadres moyens' },
                { value: 'C', label: 'C - Employés' },
                { value: 'D', label: 'D - Ouvriers' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            />
          </div>
          <Input
            label="Fonction"
            value={formData.fonction}
            onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
          />
          <Input
            label="Spécialité"
            value={formData.specialite}
            onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <Select
            label="Statut"
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            options={[
              { value: 'ACTIF', label: 'Actif' },
              { value: 'CONGE', label: 'En congé' },
              { value: 'MISSION', label: 'En mission' },
              { value: 'SUSPENDU', label: 'Suspendu' },
              { value: 'RETRAITE', label: 'Retraité' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingPersonnel ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}