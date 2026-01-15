'use client';

import { useState } from 'react';
import { Search, Phone, Mail, MapPin, User, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ROLES } from '@/constants';

// Données de l'annuaire
const annuaireData = [
  {
    id: '1',
    nom: 'Kouamé',
    prenom: 'Jean',
    fonction: 'Médecin',
    specialite: 'Médecine Générale',
    telephone: '+225 07 00 00 00 01',
    email: 'kouame.jean@eps.ci',
    service: 'Consultations',
    role: 'MEDECIN',
  },
  {
    id: '2',
    nom: 'Kone',
    prenom: 'Mariam',
    fonction: 'Infirmier',
    specialite: 'Soins Infirmiers',
    telephone: '+225 07 00 00 00 02',
    email: 'kone.mariam@eps.ci',
    service: 'Pédiatrie',
    role: 'INFIRMIER',
  },
  {
    id: '3',
    nom: 'Diallo',
    prenom: 'Abdoulaye',
    fonction: 'Pharmacien',
    specialite: 'Pharmacie',
    telephone: '+225 07 00 00 00 03',
    email: 'diallo.abdoulaye@eps.ci',
    service: 'Pharmacie',
    role: 'PHARMACIEN',
  },
  {
    id: '4',
    nom: 'Bamba',
    prenom: 'Aissata',
    fonction: 'Sage-femme',
    specialite: 'Obstétrique',
    telephone: '+225 07 00 00 00 04',
    email: 'bamba.aissata@eps.ci',
    service: 'Maternité',
    role: 'INFIRMIER',
  },
  {
    id: '5',
    nom: 'Traoré',
    prenom: 'Lassina',
    fonction: 'Agent d\'hygiène',
    telephone: '+225 07 00 00 00 05',
    email: 'traore.lassina@eps.ci',
    service: 'Hygiène',
    role: 'AGENT_HYGIENE',
  },
  {
    id: '6',
    nom: 'Koffi',
    prenom: 'Adélaïde',
    fonction: 'Agent administratif',
    telephone: '+225 07 00 00 00 06',
    email: 'koffi.adelailde@eps.ci',
    service: 'Administration',
    role: 'AGENT_ADMIN',
  },
];

export default function AnnuairePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredAnnuaire = annuaireData.filter((person) => {
    const matchesSearch =
      person.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.fonction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || person.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'MEDECIN': return 'info';
      case 'PHARMACIEN': return 'success';
      case 'INFIRMIER': return 'warning';
      case 'AGENT_HYGIENE': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Annuaire</h1>
        <p className="text-gray-500">Contacts du personnel de l'EPS</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, fonction ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total contacts</p>
            <p className="text-2xl font-bold">{annuaireData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Médecins</p>
            <p className="text-2xl font-bold text-blue-600">
              {annuaireData.filter(p => p.role === 'MEDECIN').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Infirmiers</p>
            <p className="text-2xl font-bold text-yellow-600">
              {annuaireData.filter(p => p.role === 'INFIRMIER').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Services</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(annuaireData.map(p => p.service)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnuaire.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {person.nom} {person.prenom}
                    </h3>
                  </div>
                  <Badge variant={getRoleBadgeVariant(person.role) as 'success' | 'warning' | 'info' | 'danger' | 'default'}>
                    {person.fonction}
                  </Badge>
                  {person.specialite && (
                    <p className="text-sm text-gray-500 mt-1">{person.specialite}</p>
                  )}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{person.service}</span>
                    </div>
                    <a
                      href={`tel:${person.telephone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                    >
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span>{person.telephone}</span>
                    </a>
                    <a
                      href={`mailto:${person.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 truncate"
                    >
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{person.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnuaire.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Aucun contact trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}