import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { Conversation, Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { ChatComposer } from './ChatComposer';
import { useAuth } from '../../context/AuthContext';

interface ChatConversationProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string, offerAmount?: number) => void;
  onBack?: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  messages,
  onSendMessage,
  onBack
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participant = conversation.otherParticipant;
  const product = conversation.product;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      {/* Conversation Top Header */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={participant?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={participant?.name || 'User'}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
              {participant?.name || 'Student'}
              {participant?.verifiedStudent && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {participant?.dorm} • {participant?.department}
            </p>
          </div>
        </div>

        {/* Product Snapshot Tag */}
        {product && (
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors shrink-0 max-w-[200px]"
            title={product.title}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-7 h-7 rounded-lg object-cover"
            />
            <div className="min-w-0 text-left hidden sm:block">
              <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">
                {product.title}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                ${product.price}
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>
        )}
      </div>

      {/* Safety Reminder Header */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 border-b border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Campus-Thrift Safe Meetup: Prefer public campus areas like the Student Union or Science Library.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderId === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <ChatComposer onSendMessage={onSendMessage} />
    </div>
  );
};
