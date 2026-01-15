'use client';

import { useState, useEffect } from 'react';
import { 
  Users, DollarSign, UserPlus, Pill, Activity, TrendingUp, 
  Calendar, AlertTriangle, FileText, ClipboardList, Clock, 
  CheckCircle, Heart, Stethoscope, Baby, Syringe, 
  ChevronRight, ArrowRight, Zap, Target, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useThemeSync } from '@/hooks/useThemeSync';

// Données
const stats = {
  personnel: 45,
  patients: 128,
  revenus: 12500000,
  medicaments: 234,
};

const activitesRecentes = [
  { id: 1, type: 'patient', message: 'Nouveau patient: Koné Mariam', time: '5 min', icon: UserPlus, color: 'green' },
  { id: 2, type: 'pbf', message: 'PBF validé: 45 consultations < 5 ans', time: '15 min', icon: Activity, color: 'blue' },
  { id: 3, type: 'stock', message: 'Alerte: Paracétamol sous seuil', time: '1h', icon: AlertTriangle, color: 'yellow' },
  { id: 4, type: 'conge', message: 'Congé approuvé: Dr. Koffi', time: '2h', icon: Calendar, color: 'purple' },
  { id: 5, type: 'naissance', message: 'Naissance: Fille, 3.2kg', time: '3h', icon: Baby, color: 'pink' },
];

const alerts = [
  { id: 1, type: 'warning', message: '3 produits en rupture de stock', action: 'Voir pharmacy', priority: 'high' },
  { id: 2, type: 'info', message: 'Rapport PBF à soumettre le 25/01', action: 'Soumettre', priority: 'medium' },
  { id: 3, type: 'success', message: 'Audit hygiène réalisé avec succès', action: '', priority: 'low' },
];

const indicateursPBF = [
  { name: 'Consultations enfants < 5 ans', current: 425, target: 500, rate: 85, icon: Baby, color: 'blue' },
  { name: 'Consultations prénatales', current: 180, target: 200, rate: 90, icon: Activity, color: 'pink' },
  { name: 'Accouchements assistés', current: 42, target: 50, rate: 84, icon: Heart, color: 'red' },
  { name: 'Vaccinations complètes', current: 135, target: 150, rate: 90, icon: Syringe, color: 'green' },
];

const quickAccess = [
  { name: 'Patients', icon: UserPlus, color: 'from-blue-500 to-blue-600', href: '/dashboard/modules/patients', stats: '+12%' },
  { name: 'PBF', icon: Target, color: 'from-purple-500 to-purple-600', href: '/dashboard/modules/stats', stats: '90%' },
  { name: 'Pharmacie', icon: Pill, color: 'from-green-500 to-green-600', href: '/dashboard/modules/pharmacie', stats: '234' },
  { name: 'Personnel', icon: Users, color: 'from-orange-500 to-orange-600', href: '/dashboard/modules/rh', stats: '45' },
  { name: 'Hygiène', icon: CheckCircle, color: 'from-teal-500 to-teal-600', href: '/dashboard/modules/hygiene', stats: 'A+98%' },
  { name: 'Finance', icon: DollarSign, color: 'from-yellow-500 to-yellow-600', href: '/dashboard/modules/finance', stats: '+8%' },
];

const echances = [
  { title: 'Rapport PBF mensuel', date: '25 Janvier', priority: 'high', days: 3 },
  { title: 'Réunion du personnel', date: '28 Janvier', priority: 'medium', days: 6 },
  { title: 'Inventaire pharmacie', date: '30 Janvier', priority: 'medium', days: 8 },
  { title: 'Audit qualité', date: '5 Février', priority: 'low', days: 14 },
];

// Composant Graphique Simple
function ProgressRing({ value, size = 80, strokeWidth = 8, color = '#3B82F6' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-slate-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

// Couleurs d'activité
const activityColors: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isDark } = useThemeSync();
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🏥</span>
              Tableau de bord EPSC
            </h1>
            <p className="text-blue-100 mt-1 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Établissement Public de Santé de Premier Contact
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm text-blue-100">Date</p>
              <p className="font-semibold">
                {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-sm text-blue-100">Heure</p>
              <p className="font-semibold">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Personnel */}
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-bl-full transition-transform group-hover:scale-110" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Personnel</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.personnel}</p>
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />+5
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">Agents actifs ce mois</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[85%]" />
            </div>
          </CardContent>
        </Card>

        {/* Patients */}
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-bl-full transition-transform group-hover:scale-110" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Patients</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.patients}</p>
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />+12%
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">Ce mois</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-[78%]" />
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-bl-full transition-transform group-hover:scale-110" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Revenus</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{(stats.revenus / 1000000).toFixed(1)}M</p>
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />+8%
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">FCFA ce mois</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 w-[92%]" />
            </div>
          </CardContent>
        </Card>

        {/* Médicaments */}
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-bl-full transition-transform group-hover:scale-110" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Médicaments</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.medicaments}</p>
                  <span className="text-sm text-yellow-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />2 alertes
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">En stock</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Pill className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-[68%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Indicateurs PBF */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Indicateurs PBF - Mois en cours
              <Badge className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">90% avg</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {indicateursPBF.map((indicator, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="relative">
                    <ProgressRing value={indicator.rate} size={90} color={
                      indicator.rate >= 90 ? '#10B981' : indicator.rate >= 70 ? '#F59E0B' : '#EF4444'
                    } />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{indicator.rate}%</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-gray-600 dark:text-slate-400 line-clamp-2">{indicator.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{indicator.current}/{indicator.target}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Alertes
              <Badge className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{alerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                    alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/40' :
                      alert.type === 'success' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-blue-100 dark:bg-blue-900/40'
                    }`}>
                      {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                      {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      {alert.type === 'info' && <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.message}</p>
                      {alert.action && (
                        <button className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1">
                          {alert.action} <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {alert.priority === 'high' && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full">Urgent</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickAccess.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${item.color}`} />
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-3 group-hover:scale-125 transition-transform duration-300`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{item.stats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />
              <div className="space-y-4">
                {activitesRecentes.map((activity) => {
                  const Icon = activity.icon;
                  const colors = activityColors[activity.color] || activityColors.blue;
                  return (
                    <div key={activity.id} className="relative flex items-start gap-4 pl-10 group">
                      <div className={`absolute left-0 p-2 rounded-full ${colors.bg} z-10 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.message}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Il y a {activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Échéances */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Échéances à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {echances.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-l-4"
                  style={{
                    borderLeftColor: item.priority === 'high' ? '#EF4444' : item.priority === 'medium' ? '#F59E0B' : '#10B981'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      item.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 
                      item.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        item.priority === 'high' ? 'text-red-600 dark:text-red-400' : 
                        item.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{item.date} • Dans {item.days} jours</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Consultations', value: '1,245', icon: Stethoscope, color: 'blue' },
          { label: 'Urgences', value: '89', icon: Activity, color: 'red' },
          { label: 'Naissances', value: '42', icon: Baby, color: 'pink' },
          { label: 'Vaccinations', value: '312', icon: Syringe, color: 'green' },
          { label: 'Opérations', value: '28', icon: Heart, color: 'purple' },
          { label: 'Sorties', value: '156', icon: UserPlus, color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <stat.icon className={`h-6 w-6 mx-auto mb-2 text-${stat.color}-500`} style={{ color: `var(--${stat.color}-500)` }} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}