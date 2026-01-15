'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface Conge {
  id: string;
  personnelId: string;
  personnel: { nom: string; prenom: string; fonction: string };
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  motif?: string;
}

export default function CongesPage() {
  const [conges, setConges] = useState<Conge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    personnelId: '',
    type: 'ANNUEL',
    dateDebut: '',
    dateFin: '',
    motif: '',
  });

  useEffect(() => {
    fetchConges();
  }, []);

  const fetchConges = async () => {
    try {
      const res = await fetch('/api/conges?epsId=demo-eps-id');
      const data = await res.json();
      if (data.success) {
        setConges(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/conges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setConges([...conges, data.data]);
        setShowModal(false);
        setFormData({ personnelId: '', type: 'ANNUEL', dateDebut: '', dateFin: '', motif: '' });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/conges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: 'APPROUVE' }),
      });
      const data = await res.json();
      if (data.success) {
        setConges(conges.map((c) => (c.id === id ? { ...c, statut: 'APPROUVE' } : c)));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'APPROUVE': return 'green';
      case 'REFUSE': return 'red';
      default: return 'yellow';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Congés</h1>
        <Button onClick={() => setShowModal(true)}>+ Nouvelle demande</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total des congés</p>
          <p className="text-2xl font-bold">{conges.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {conges.filter((c) => c.statut === 'EN_ATTENTE').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Approuvés</p>
          <p className="text-2xl font-bold text-green-600">
            {conges.filter((c) => c.statut === 'APPROUVE').length}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des congés</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personnel</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conges.map((conge) => (
                  <TableRow key={conge.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{conge.personnel.nom} {conge.personnel.prenom}</p>
                        <p className="text-sm text-gray-500">{conge.personnel.fonction}</p>
                      </div>
                    </TableCell>
                    <TableCell>{conge.type}</TableCell>
                    <TableCell>
                      {conge.dateDebut} au {conge.dateFin}
                    </TableCell>
                    <TableCell>
                      <Badge color={getStatutColor(conge.statut)}>{conge.statut}</Badge>
                    </TableCell>
                    <TableCell>
                      {conge.statut === 'EN_ATTENTE' && (
                        <Button variant="secondary" size="sm" onClick={() => handleApprove(conge.id)}>
                          Approuver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle demande de congé">
        <div className="space-y-4">
          <Select
            label="Personnel"
            value={formData.personnelId}
            onChange={(e) => setFormData({ ...formData, personnelId: e.target.value })}
            options={[
              { value: '', label: 'Sélectionner...' },
              { value: 'P001', label: 'Dr. Kouamé Jean' },
              { value: 'P002', label: 'Traoré Fatou' },
              { value: 'P003', label: 'Diallo Ali' },
            ]}
          />
          <Select
            label="Type de congé"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'ANNUEL', label: 'Congé annuel' },
              { value: 'MALADIE', label: 'Maladie' },
              { value: 'MATERNITE', label: 'Maternité' },
              { value: 'PATERNITE', label: 'Paternité' },
              { value: 'SANS_SOLDE', label: 'Sans solde' },
            ]}
          />
          <Input
            label="Date de début"
            type="date"
            value={formData.dateDebut}
            onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
          />
          <Input
            label="Date de fin"
            type="date"
            value={formData.dateFin}
            onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
          />
          <Input
            label="Motif"
            value={formData.motif}
            onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={handleSubmit}>Soumettre</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}