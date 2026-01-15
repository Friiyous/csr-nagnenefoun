'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Pill, DollarSign, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui/StatsCard';

export default function StatsPage() {
  const [periode, setPeriode] = useState('mois');

  // Données mockées pour l'exemple
  const stats = {
    personnel: 45,
    patients: 128,
    consultations: 342,
    revenus: 12500000,
    depenses: 8500000,
    solde: 4000000,
  };

  const monthlyData = [
    { name: 'Jan', consultations: 280, revenus: 450000 },
    { name: 'Fév', consultations: 320, revenus: 520000 },
    { name: 'Mar', consultations: 350, revenus: 580000 },
    { name: 'Avr', consultations: 310, revenus: 490000 },
    { name: 'Mai', consultations: 340, revenus: 550000 },
    { name: 'Juin', consultations: 380, revenus: 620000 },
  ];

  const topServices = [
    { name: 'Consultations générales', value: 45 },
    { name: 'Pédiatrie', value: 25 },
    { name: 'Maternité', value: 15 },
    { name: 'Urgences', value: 10 },
    { name: 'Laboratoire', value: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">Tableaux de bord et rapports</p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          >
            <option value="jour">Aujourd'hui</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="annee">Cette année</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Consultations"
          value={stats.consultations}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Patients"
          value={stats.patients}
          icon={<Users className="h-6 w-6 text-green-600" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Revenus (FCFA)"
          value={stats.revenus.toLocaleString()}
          icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Solde"
          value={stats.solde.toLocaleString()}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Consultations mensuelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{month.name}</span>
                    <span className="text-gray-500">{month.consultations}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-blue-500"
                      style={{ width: `${(month.consultations / 400) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Répartition par service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{service.name}</span>
                    <span className="text-gray-500">{service.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        idx === 0 ? 'bg-blue-500' :
                        idx === 1 ? 'bg-green-500' :
                        idx === 2 ? 'bg-yellow-500' :
                        idx === 3 ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${service.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Résumé financier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Recettes</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.revenus.toLocaleString()} F
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Dépenses</p>
              <p className="text-2xl font-bold text-red-700">
                {stats.depenses.toLocaleString()} F
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Solde période</p>
              <p className={`text-2xl font-bold ${stats.solde >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {stats.solde.toLocaleString()} F
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Taux d'exécution</p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round((stats.solde / stats.revenus) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PBF Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Indicateurs PBF du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Consultations < 5 ans', target: 500, current: 425, rate: 85 },
              { name: 'Consultations prénatales', target: 200, current: 180, rate: 90 },
              { name: 'Accouchements', target: 50, current: 42, rate: 84 },
              { name: 'Vaccinations', target: 150, current: 135, rate: 90 },
            ].map((indicator, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">{indicator.name}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{indicator.current}/{indicator.target}</span>
                  <span className={`text-sm font-bold ${
                    indicator.rate >= 90 ? 'text-green-600' :
                    indicator.rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {indicator.rate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      indicator.rate >= 90 ? 'bg-green-500' :
                      indicator.rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${indicator.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}