'use client';

import { Header } from '@/components/ui/Header';
import { NotificationProvider } from '@/components/ui/Notification';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Header userName="Dr. Kouamé" userRole="DIRECTEUR" />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </NotificationProvider>
  );
}