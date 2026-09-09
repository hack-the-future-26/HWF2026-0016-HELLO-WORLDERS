import { Notification } from '../types';
import { mockNotifications } from '../data/mockData';

const LOCAL_NOTIFS_KEY = 'campus_thrift_notifications';

class NotificationService {
  private notifications: Notification[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(LOCAL_NOTIFS_KEY);
      this.notifications = stored ? JSON.parse(stored) : [...mockNotifications];
    } catch {
      this.notifications = [...mockNotifications];
    }
  }

  private saveState() {
    try {
      localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }

  // TODO: [Backend Integration] Replace with GET /api/notifications
  public async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // TODO: [Backend Integration] Replace with PATCH /api/notifications/:id/read
  public async markAsRead(notificationId: string): Promise<void> {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  // TODO: [Backend Integration] Replace with PATCH /api/notifications/read-all
  public async markAllAsRead(userId: string): Promise<void> {
    this.notifications
      .filter(n => n.userId === userId)
      .forEach(n => {
        n.isRead = true;
      });
    this.saveState();
  }

  public async getUnreadCount(userId: string): Promise<number> {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }
}

export const notificationService = new NotificationService();
