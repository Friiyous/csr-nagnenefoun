// Service de notifications pour EPS Manager

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

class NotificationService {
  private listeners: ((notification: Notification) => void)[] = [];

  // Subscribe to notifications
  subscribe(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Show a notification
  show(type: NotificationType, title: string, message: string, duration = 5000) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      duration,
    };

    this.listeners.forEach(listener => listener(notification));

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(notification.id), duration);
    }

    return notification.id;
  }

  dismiss(id: string) {
    // This will be handled by the UI component
  }

  // Convenience methods
  success(title: string, message: string) {
    return this.show('success', title, message);
  }

  error(title: string, message: string) {
    return this.show('error', title, message);
  }

  warning(title: string, message: string) {
    return this.show('warning', title, message);
  }

  info(title: string, message: string) {
    return this.show('info', title, message);
  }
}

export const notifications = new NotificationService();

// Alertes système spécifiques à EPS Manager
export const alertMessages = {
  stockLow: (produit: string, quantite: number) =>
    notifications.warning('Stock bas', `${produit} - ${quantite} restante(s)`),
  
  stockOut: (produit: string) =>
    notifications.error('Rupture de stock', `${produit} est en rupture de stock`),
  
  congePending: (personnel: string) =>
    notifications.info('Congé en attente', `Demande de ${personnel} en attente d'approbation`),
  
  pbfDeadline: (jours: number) =>
    notifications.warning('Échéance PBF', `Rapport PBF à soumettre dans ${jours} jours`),
  
  hygieneCheckOverdue: (lieu: string) =>
    notifications.warning('Contrôle higiene', `Contrôle ${lieu} en retard`),
};