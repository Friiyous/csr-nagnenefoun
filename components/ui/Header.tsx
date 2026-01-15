'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Bell, User, LogOut, Settings, ChevronDown, Sun, Moon,
  LayoutDashboard, Users, DollarSign, Pill, FileText, 
  Calendar, BarChart3, Heart, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeSync } from '@/hooks/useThemeSync';

// Navigation items avec icônes
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { href: '/dashboard/modules/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/modules/stats', label: 'PBF', icon: BarChart3 },
  { href: '/dashboard/modules/pharmacie', label: 'Pharmacie', icon: Pill },
  { href: '/dashboard/modules/hygiene', label: 'Hygiène', icon: Heart },
  { href: '/dashboard/modules/finance', label: 'Finance', icon: DollarSign },
  { href: '/dashboard/modules/rh', label: 'Personnel', icon: Users },
  { href: '/dashboard/modules/users', label: 'Utilisateurs', icon: Settings },
  { href: '/dashboard/modules/conges', label: 'Congés', icon: Calendar },
  { href: '/dashboard/modules/gardes', label: 'Gardes', icon: Clock },
  { href: '/dashboard/modules/archives', label: 'Archives', icon: FileText },
];

export function Header({ userName = 'Dr. Kouamé', userRole = 'DIRECTEUR' }: { userName?: string; userRole?: string }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isDark, toggleTheme } = useThemeSync();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-xs">EPSC</span>
              </div>
              <div className="hidden sm:block max-w-[240px]">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Établissement Public de Santé de Premier Contact</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Nagnénéfoun • Région du Poro</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Plus menu */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Plus
                <ChevronDown className={cn("h-4 w-4 transition-transform", activeDropdown === 'more' && "rotate-180")} />
              </button>
              
              {activeDropdown === 'more' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-20">
                    {NAV_ITEMS.slice(6).map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                            isActive 
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                              : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Mode jour' : 'Mode nuit'}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{userRole}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-slate-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{userRole}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Mon profil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </Link>
                    <hr className="my-2 border-gray-100 dark:border-slate-700" />
                    <button className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <nav className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}