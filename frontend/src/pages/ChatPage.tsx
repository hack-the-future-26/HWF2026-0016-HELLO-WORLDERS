import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, MessagesSquare } from 'lucide-react';
import { Conversation, Message } from '../types';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { ChatList } from '../components/chat/ChatList';
import { ChatConversation } from '../components/chat/ChatConversation';
import { EmptyState } from '../components/common/EmptyState';
import { ChatSkeleton } from '../components/common/LoadingSkeleton';

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const list = await chatService.getConversations(user.id);
      setConversations(list);

      // Determine active conversation ID
      const targetId = id || (list.length > 0 ? list[0].id : null);
      if (targetId) {
        const full = await chatService.getConversationById(targetId, user.id);
        if (full) {
          setActiveConversation(full.conversation);
          setMessages(full.messages);
        }
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user, id]);

  const handleSelectConversation = (convId: string) => {
    navigate(`/chat/${convId}`);
  };

  const handleSendMessage = async (text: string, offerAmount?: number) => {
    if (!activeConversation || !user) return;

    try {
      const sent = await chatService.sendMessage(activeConversation.id, user.id, text, offerAmount);
      setMessages(prev => [...prev, sent]);

      // Refresh conversations list to update snippet
      const updatedList = await chatService.getConversations(user.id);
      setConversations(updatedList);
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto h-[75vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
        <ChatSkeleton />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <EmptyState
          icon={<MessagesSquare className="w-8 h-8" />}
          title="No Campus-Thrift Messages Yet"
          description="Browse the marketplace to find textbooks, tech, and dorm supplies, then click 'Chat with Seller' on any product page to start negotiating!"
          actionText="Browse Campus Marketplace"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] min-h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12">
      {/* Left Sidebar: Conversation List */}
      <div
        className={`md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full ${
          id ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Campus Messages</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList
            conversations={conversations}
            activeConversationId={activeConversation?.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* Right Area: Active Conversation Thread */}
      <div
        className={`md:col-span-8 flex flex-col h-full ${
          !id && !activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'
        }`}
      >
        {activeConversation ? (
          <ChatConversation
            conversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={() => navigate('/chat')}
          />
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Select a conversation from the left to read messages.
          </div>
        )}
      </div>
    </div>
  );
};
