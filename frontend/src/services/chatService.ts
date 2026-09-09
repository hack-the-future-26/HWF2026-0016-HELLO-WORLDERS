import { Conversation, Message } from '../types';
import { api, BackendChat, BackendMessage } from './api';
import { mapBackendUser } from './productService';
import { resolveImageUrl } from './api';

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapBackendChat(chat: BackendChat, currentUserId: string): Conversation {
  const otherUser = chat.other_user ? mapBackendUser(chat.other_user) : undefined;

  const product = chat.product
    ? {
        id: String(chat.product.id),
        title: chat.product.title,
        price: chat.product.price,
        images: [resolveImageUrl(chat.product.image_url)],
        condition: chat.product.condition as Conversation['product'] extends infer P
          ? P extends { condition: infer C }
            ? C
            : never
          : never,
        // Minimal shape — pages only need title/images/price from conversations
        originalPrice: chat.product.price * 1.5,
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
    otherParticipant: otherUser,
  };
}

function mapBackendMessage(msg: BackendMessage): Message {
  return {
    id: String(msg.id),
    conversationId: String(msg.chat_id),
    senderId: String(msg.sender_id),
    text: msg.message,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// ChatService
// ---------------------------------------------------------------------------

class ChatService {
  // -----------------------------------------------------------------------
  // getConversations — GET /chats?user_id={id}
  // -----------------------------------------------------------------------
  public async getConversations(userId: string): Promise<Conversation[]> {
    const res = await api.get<{ success: boolean; chats: BackendChat[] }>(
      `/chats?user_id=${userId}`,
    );
    return (res.chats ?? []).map((c) => mapBackendChat(c, userId));
  }

  // -----------------------------------------------------------------------
  // getConversationById — GET /chats/{id}/messages
  // -----------------------------------------------------------------------
  public async getConversationById(
    chatId: string,
    currentUserId: string,
  ): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    try {
      // We need both the chat meta (from the list) and the messages
      const [chatsRes, messagesRes] = await Promise.all([
        api.get<{ success: boolean; chats: BackendChat[] }>(
          `/chats?user_id=${currentUserId}`,
        ),
        api.get<{ success: boolean; messages: BackendMessage[] }>(
          `/chats/${chatId}/messages`,
        ),
      ]);

      const chatMeta = chatsRes.chats?.find((c) => String(c.id) === chatId);
      if (!chatMeta) return null;

      const conversation = mapBackendChat(chatMeta, currentUserId);
      const messages = (messagesRes.messages ?? []).map(mapBackendMessage);

      return { conversation, messages };
    } catch {
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // getOrCreateConversation — POST /chats
  // -----------------------------------------------------------------------
  public async getOrCreateConversation(
    productId: string,
    buyerId: string,
    sellerId: string,
  ): Promise<string> {
    const res = await api.post<{ id: number }>('/chats', {
      product_id: Number(productId),
      buyer_id: Number(buyerId),
      seller_id: Number(sellerId),
    });
    return String(res.id);
  }

  // -----------------------------------------------------------------------
  // sendMessage — POST /chats/{id}/messages
  // -----------------------------------------------------------------------
  public async sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
    _offerAmount?: number,
  ): Promise<Message> {
    const res = await api.post<{ success: boolean; message: BackendMessage }>(
      `/chats/${conversationId}/messages`,
      {
        sender_id: Number(senderId),
        message: text,
      },
    );
    return mapBackendMessage(res.message);
  }
}

export const chatService = new ChatService();
