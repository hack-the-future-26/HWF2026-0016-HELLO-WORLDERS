import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Tag, 
  AlertCircle, 
  TrendingDown, 
  Check, 
  Clock 
} from 'lucide-react';
import { Notification } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'safety':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'listing_update':
        return <TrendingDown className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const timeFormatted = new Date(notification.timestamp).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const content = (
    <div className="flex items-start gap-3 flex-1 min-w-0">
      <div className={`p-2 rounded-xl shrink-0 ${
        notification.isRead 
          ? 'bg-slate-100 dark:bg-slate-800' 
          : 'bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
      }`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`text-xs font-semibold truncate ${
            notification.isRead 
              ? 'text-slate-700 dark:text-slate-300' 
              : 'text-slate-900 dark:text-white font-bold'
          }`}>
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
          {notification.body}
        </p>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
          {timeFormatted}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
      notification.isRead
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
        : 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
    }`}>
      {notification.link ? (
        <Link 
          to={notification.link} 
          onClick={() => onMarkAsRead(notification.id)}
          className="flex-1 min-w-0 hover:opacity-90 transition-opacity"
        >
          {content}
        </Link>
      ) : (
        <div className="flex-1 min-w-0">
          {content}
        </div>
      )}

      {!notification.isRead && (
        <button
          type="button"
          onClick={() => onMarkAsRead(notification.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          title="Mark as read"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
