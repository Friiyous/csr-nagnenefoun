'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ExportButton } from '@/components/ui/ExportButton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface Archive {
  id: string;
  titre: string;
  type: string;
  categorie: string;
  date: string;
  taille: string;
  format: string;
  author: string;
}

export default function ArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    type: 'RAPPORT',
    categorie: 'ADMINISTRATION',
    date: new Date().toISOString().split('T')[0],
    format: 'PDF',
    author: '',
  });

  useEffect(() => {
    fetchArchives();
  }, [searchTerm, selectedType, selectedCategory]);

  const fetchArchives = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedType) params.append('type', selectedType);
      if (selectedCategory) params.append('categorie', selectedCategory);
      
      const res = await fetch(`/api/archives?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArchives(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setArchives([...archives, data.data]);
        setShowModal(false);
        setFormData({
          titre: '',
          type: 'RAPPORT',
          categorie: 'ADMINISTRATION',
          date: new Date().toISOString().split('T')[0],
          format: 'PDF',
          author: '',
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RAPPORT': return 'blue';
      case 'DOCUMENT': return 'purple';
      case 'INVENTAIRE': return 'green';
      case 'PROTOCOLE': return 'yellow';
      case 'LISTE': return 'gray';
      default: return 'blue';
    }
  };

  const getCategoryColor = (categorie: string) => {
    switch (categorie) {
      case 'PBF': return 'bg-blue-100 text-blue-800';
      case 'ADMINISTRATION': return 'bg-purple-100 text-purple-800';
      case 'PHARMACIE': return 'bg-green-100 text-green-800';
      case 'HYGIENE': return 'bg-yellow-100 text-yellow-800';
      case 'RH': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Archives et Documents</h1>
        <div className="flex gap-2">
          <ExportButton 
            data={archives.map(a => ({ 
              id: a.id, 
              titre: a.titre, 
              type: a.type, 
              categorie: a.categorie, 
              date: a.date, 
              taille: a.taille, 
              format: a.format,
              auteur: a.author 
            }))} 
            filename="archives" 
            title="Exporter" 
          />
          <Button onClick={() => setShowModal(true)}>+ Ajouter un document</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total documents</p>
          <p className="text-2xl font-bold">{archives.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Rapports PBF</p>
          <p className="text-2xl font-bold text-blue-600">
            {archives.filter((a) => a.categorie === 'PBF').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Administration</p>
          <p className="text-2xl font-bold text-purple-600">
            {archives.filter((a) => a.categorie === 'ADMINISTRATION').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pharmacie</p>
          <p className="text-2xl font-bold text-green-600">
            {archives.filter((a) => a.categorie === 'PHARMACIE').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">RH</p>
          <p className="text-2xl font-bold text-gray-600">
            {archives.filter((a) => a.categorie === 'RH').length}
          </p>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: '', label: 'Tous les types' },
              { value: 'RAPPORT', label: 'Rapport' },
              { value: 'DOCUMENT', label: 'Document' },
              { value: 'INVENTAIRE', label: 'Inventaire' },
              { value: 'PROTOCOLE', label: 'Protocole' },
              { value: 'LISTE', label: 'Liste' },
            ]}
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: '', label: 'Toutes les catégories' },
              { value: 'PBF', label: 'PBF' },
              { value: 'ADMINISTRATION', label: 'Administration' },
              { value: 'PHARMACIE', label: 'Pharmacie' },
              { value: 'HYGIENE', label: 'Hygiène' },
              { value: 'RH', label: 'RH' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque de documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : archives.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun document trouvé</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archives.map((archive) => (
                  <TableRow key={archive.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{archive.titre}</p>
                        <p className="text-sm text-gray-500">Par: {archive.author}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(archive.categorie)}`}>
                        {archive.categorie}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge color={getTypeColor(archive.type)}>{archive.format}</Badge>
                    </TableCell>
                    <TableCell>{archive.date}</TableCell>
                    <TableCell>{archive.taille}</TableCell>
                    <TableCell>
                      <Button variant="secondary" size="sm">
                        📥
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter un document">
        <div className="space-y-4">
          <Input
            label="Titre du document"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          />
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'RAPPORT', label: 'Rapport' },
              { value: 'DOCUMENT', label: 'Document' },
              { value: 'INVENTAIRE', label: 'Inventaire' },
              { value: 'PROTOCOLE', label: 'Protocole' },
              { value: 'LISTE', label: 'Liste' },
            ]}
          />
          <Select
            label="Catégorie"
            value={formData.categorie}
            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
            options={[
              { value: 'PBF', label: 'PBF' },
              { value: 'ADMINISTRATION', label: 'Administration' },
              { value: 'PHARMACIE', label: 'Pharmacie' },
              { value: 'HYGIENE', label: 'Hygiène' },
              { value: 'RH', label: 'RH' },
            ]}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Select
            label="Format"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            options={[
              { value: 'PDF', label: 'PDF' },
              { value: 'DOCX', label: 'Word' },
              { value: 'XLSX', label: 'Excel' },
              { value: 'PPTX', label: 'PowerPoint' },
            ]}
          />
          <Input
            label="Auteur"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Glissez-déposez le fichier ici</p>
            <p className="text-sm text-gray-400">ou cliquez pour sélectionner</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button onClick={handleSubmit}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}