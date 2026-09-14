import { Conversation, Message } from '../types';
import { api, BackendChat, BackendMessage, resolveImage } from './api';
import { mapUser } from './productService';

function mapChat(chat: BackendChat, currentUserId: string): Conversation {
  const other = chat.other_user ? mapUser(chat.other_user) : undefined;
  const product = chat.product
    ? {
        id: String(chat.product.id),
        title: chat.product.title,
        price: chat.product.price,
        images: [resolveImage(chat.product.image_url)],
        condition: chat.product.condition as Conversation['product'] extends infer P
          ? P extends { condition: infer C } ? C : never : never,
        originalPrice: chat.product.price * 1.6,
        category: 'other' as const,
        description: '',
        sellerId: String(chat.seller_id),
        campus: '',
        pickupLocation: '',
        tags: [],
        createdAt: '',
        status: 'active' as const,
      }
    : undefined;

  return {
    id: String(chat.id),
    productId: String(chat.product_id),
    participantIds: [String(chat.buyer_id), String(chat.seller_id)],
    lastMessage: chat.last_message ?? 'Conversation started',
    lastMessageTimestamp: new Date().toISOString(),
    unreadCount: 0,
    product,
    otherParticipant: other,
  };
}

function mapMessage(m: BackendMessage): Message {
  return {
    id: String(m.id),
    conversationId: String(m.chat_id),
    senderId: String(m.sender_id),
    text: m.message,
    timestamp: new Date().toISOString(),
  };
}

class ChatService {
  async getConversations(userId: string): Promise<Conversation[]> {
    const res = await api.get<{ success: boolean; chats: BackendChat[] }>(`/chats?user_id=${userId}`);
    return (res.chats ?? []).map(c => mapChat(c, userId));
  }

  async getConversationById(
    chatId: string,
    currentUserId: string,
  ): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    try {
      const [chatsRes, msgsRes] = await Promise.all([
        api.get<{ success: boolean; chats: BackendChat[] }>(`/chats?user_id=${currentUserId}`),
        api.get<{ success: boolean; messages: BackendMessage[] }>(`/chats/${chatId}/messages`),
      ]);
      const meta = chatsRes.chats?.find(c => String(c.id) === chatId);
      if (!meta) return null;
      return {
        conversation: mapChat(meta, currentUserId),
        messages: (msgsRes.messages ?? []).map(mapMessage),
      };
    } catch { return null; }
  }

  async getOrCreateConversation(productId: string, buyerId: string, sellerId: string): Promise<string> {
    const res = await api.post<{ id: number }>('/chats', {
      product_id: Number(productId),
      buyer_id: Number(buyerId),
      seller_id: Number(sellerId),
    });
    return String(res.id);
  }

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const res = await api.post<{ success: boolean; message: BackendMessage }>(
      `/chats/${conversationId}/messages`,
      { sender_id: Number(senderId), message: text }
    );
    return mapMessage(res.message);
  }
}

export const chatService = new ChatService();
