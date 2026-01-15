'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Users, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { ROLE_LABELS, ROLE_COLORS, UserRole } from '@/types/roles';
import { formatDate } from '@/lib/utils';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Données mockées des utilisateurs
  const users = [
    { id: '1', name: 'Dr. Kouamé', email: 'kouame@eps.ci', role: 'DIRECTEUR', epsId: 'EPS-001', createdAt: '2024-01-15' },
    { id: '2', name: 'Dr. Koné', email: 'kone@eps.ci', role: 'MEDECIN', epsId: 'EPS-001', createdAt: '2024-02-20' },
    { id: '3', name: 'Inf. Diallo', email: 'diallo@eps.ci', role: 'INFIRMIER', epsId: 'EPS-001', createdAt: '2024-03-10' },
    { id: '4', name: 'Pharm. Traoré', email: 'traore@eps.ci', role: 'PHARMACIEN', epsId: 'EPS-001', createdAt: '2024-04-05' },
    { id: '5', name: 'Koffi Patrick', email: 'koffi@eps.ci', role: 'COMPTABLE', epsId: 'EPS-001', createdAt: '2024-05-18' },
    { id: '6', name: 'Bamba Aminata', email: 'bamba@eps.ci', role: 'RH', epsId: 'EPS-001', createdAt: '2024-06-22' },
    { id: '7', name: 'Soro Jean', email: 'soro@eps.ci', role: 'LOGISTIQUE', epsId: 'EPS-001', createdAt: '2024-07-30' },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = Object.keys(ROLE_LABELS) as UserRole[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h1>
          <p className="text-gray-500 dark:text-slate-400">Administrer les comptes et les rôles</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Administrateurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'ADMIN' || u.role === 'DIRECTEUR').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Personnel soignant</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => ['MEDECIN', 'INFIRMIER'].includes(u.role)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Nouveaux (mois)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{user.name}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={ROLE_COLORS[user.role as UserRole] || 'bg-gray-100 text-gray-700'}>
                      {ROLE_LABELS[user.role as UserRole] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        size="md"
      >
        <form className="space-y-4">
          <Input
            label="Nom complet"
            placeholder="Dr. Kouamé"
            defaultValue={editingUser?.name}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="kouame@eps.ci"
            defaultValue={editingUser?.email}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            required={!editingUser}
          />
          <Select
            label="Rôle"
            options={roles.map(role => ({
              value: role,
              label: ROLE_LABELS[role],
            }))}
            defaultValue={editingUser?.role || 'MEDECIN'}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit">
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}