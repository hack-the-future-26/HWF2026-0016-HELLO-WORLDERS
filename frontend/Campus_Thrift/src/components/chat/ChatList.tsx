import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Conversation } from '../../types';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (convId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
        No active conversations yet. Reach out to a seller from any listing!
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {conversations.map((conv) => {
        const isActive = conv.id === activeConversationId;
        const participant = conv.otherParticipant;
        const product = conv.product;

        const timeFormatted = new Date(conv.lastMessageTimestamp).toLocaleDateString([], {
          month: 'short',
          day: 'numeric'
        });

        return (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelectConversation(conv.id)}
            className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
              isActive
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={participant?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={participant?.name || 'User'}
                className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {conv.unreadCount}
                </span>
              )}
            </div>

            {/* Conversation Summary */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                  {participant?.name || 'Student'}
                  {participant?.verifiedStudent && (
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  )}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">{timeFormatted}</span>
              </div>

              {/* Product link title */}
              {product && (
                <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 truncate mb-1 flex items-center gap-1">
                  <span>Re: {product.title}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold">(${product.price})</span>
                </div>
              )}

              {/* Last message snippet */}
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {conv.lastMessage}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
