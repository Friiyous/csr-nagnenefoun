'use client';

import { useState, useEffect } from 'react';
import { notifications } from '@/lib/notifications';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = notifications.subscribe((notification) => {
      const toast: Toast = {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
      };
      setToasts((prev) => [...prev, toast]);
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg min-w-[300px] animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : toast.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : toast.type === 'warning'
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{toast.title}</p>
                <p className="text-sm mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function useNotification() {
  return {
    success: (title: string, message: string) => notifications.success(title, message),
    error: (title: string, message: string) => notifications.error(title, message),
    warning: (title: string, message: string) => notifications.warning(title, message),
    info: (title: string, message: string) => notifications.info(title, message),
  };
}