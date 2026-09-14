import { Notification } from '../types';
import { mockNotifications } from '../data/mockData';
import { api } from './api';

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
    try {
      return await api.get<Notification[]>(`/notifications/${userId}`);
    } catch {
      return this.notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }

  // TODO: [Backend Integration] Replace with PATCH /api/notifications/:id/read
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`, { is_read: true });
      return;
    } catch { /* use local demo state when the API is unavailable */ }
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  // TODO: [Backend Integration] Replace with PATCH /api/notifications/read-all
  public async markAllAsRead(userId: string): Promise<void> {
    try {
      await api.patch(`/notifications/read-all/${userId}`, {});
      return;
    } catch { /* use local demo state when the API is unavailable */ }
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
