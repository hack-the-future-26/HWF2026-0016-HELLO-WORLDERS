import React from 'react';
import { Tag } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} space-y-1`}>
      <div
        className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isCurrentUser
            ? 'bg-emerald-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
        }`}
      >
        {/* Quick Offer Badge if applicable */}
        {message.isQuickOffer && message.offerAmount !== undefined && (
          <div className={`mb-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold ${
            isCurrentUser
              ? 'bg-emerald-700/80 text-white'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
          }`}>
            <Tag className="w-3 h-3" />
            <span>Offered: ${message.offerAmount}</span>
          </div>
        )}

        <p>{message.text}</p>
      </div>

      <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
        {timeFormatted}
      </span>
    </div>
  );
};
