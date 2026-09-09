import { Conversation, Message } from '../types';
import { mockConversations, mockMessages, mockProducts, mockUsers } from '../data/mockData';

const LOCAL_MESSAGES_KEY = 'campus_thrift_chat_messages';
const LOCAL_CONVERSATIONS_KEY = 'campus_thrift_chat_conversations';

class ChatService {
  private messagesByConv: Record<string, Message[]> = {};
  private conversations: Conversation[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedConvs = localStorage.getItem(LOCAL_CONVERSATIONS_KEY);
      this.conversations = storedConvs ? JSON.parse(storedConvs) : [...mockConversations];

      const storedMsgs = localStorage.getItem(LOCAL_MESSAGES_KEY);
      this.messagesByConv = storedMsgs ? JSON.parse(storedMsgs) : { ...mockMessages };
    } catch (e) {
      console.error('Failed to load chat state', e);
      this.conversations = [...mockConversations];
      this.messagesByConv = { ...mockMessages };
    }
  }

  private saveState() {
    try {
      localStorage.setItem(LOCAL_CONVERSATIONS_KEY, JSON.stringify(this.conversations));
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(this.messagesByConv));
    } catch (e) {
      console.error('Failed to save chat state', e);
    }
  }

  // TODO: [Backend Integration] Replace with GET /api/chat/conversations
  public async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversations
      .filter(c => c.participantIds.includes(userId))
      .map(c => {
        const product = mockProducts.find(p => p.id === c.productId);
        const otherUserId = c.participantIds.find(id => id !== userId);
        const otherParticipant = mockUsers.find(u => u.id === otherUserId);

        return {
          ...c,
          product,
          otherParticipant
        };
      })
      .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
  }

  // TODO: [Backend Integration] Replace with GET /api/chat/conversations/:id
  public async getConversationById(convId: string, currentUserId: string): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    const conv = this.conversations.find(c => c.id === convId);
    if (!conv) return null;

    const product = mockProducts.find(p => p.id === conv.productId);
    const otherUserId = conv.participantIds.find(id => id !== currentUserId);
    const otherParticipant = mockUsers.find(u => u.id === otherUserId);

    const fullConv: Conversation = {
      ...conv,
      product,
      otherParticipant
    };

    const messages = this.messagesByConv[convId] || [];

    // Mark as read locally
    if (conv.unreadCount > 0) {
      conv.unreadCount = 0;
      this.saveState();
    }

    return {
      conversation: fullConv,
      messages: [...messages]
    };
  }

  // TODO: [Backend Integration] Replace with POST /api/chat/conversations (get or create)
  public async getOrCreateConversation(productId: string, buyerId: string, sellerId: string): Promise<string> {
    const existing = this.conversations.find(
      c => c.productId === productId && c.participantIds.includes(buyerId) && c.participantIds.includes(sellerId)
    );

    if (existing) {
      return existing.id;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      productId,
      participantIds: [buyerId, sellerId],
      lastMessage: 'Conversation started',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };

    this.conversations.unshift(newConv);
    this.messagesByConv[newId] = [
      {
        id: `msg-${Date.now()}`,
        conversationId: newId,
        senderId: buyerId,
        text: 'Hi! I am interested in this item on Campus-Thrift. Is it still available?',
        timestamp: new Date().toISOString()
      }
    ];

    newConv.lastMessage = 'Hi! I am interested in this item on Campus-Thrift. Is it still available?';
    this.saveState();
    return newId;
  }

  // TODO: [Backend Integration] Replace with POST /api/chat/conversations/:id/messages
  public async sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
    offerAmount?: number
  ): Promise<Message> {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      text,
      timestamp: new Date().toISOString(),
      isQuickOffer: offerAmount !== undefined,
      offerAmount
    };

    if (!this.messagesByConv[conversationId]) {
      this.messagesByConv[conversationId] = [];
    }

    this.messagesByConv[conversationId].push(newMessage);

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageTimestamp = newMessage.timestamp;
    }

    this.saveState();

    // Mock friendly automated seller response after a short delay for demonstration
    this.triggerMockSellerReply(conversationId, senderId);

    return newMessage;
  }

  private triggerMockSellerReply(conversationId: string, currentSenderId: string) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const otherUserId = conv.participantIds.find(id => id !== currentSenderId);
    if (!otherUserId) return;

    // Simulate seller typing back after 2.5 seconds
    setTimeout(() => {
      const cannedReplies = [
        'Thanks for reaching out! Yes, that works for me. Are you on campus today?',
        'Sounds good! I can meet up at the Student Union or library lobby.',
        'Great, thanks for confirming! Let me know what time suits your class schedule.',
        'Got it! Looking forward to meeting in the campus safe zone.'
      ];
      const randomReply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];

      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        conversationId,
        senderId: otherUserId,
        text: randomReply,
        timestamp: new Date().toISOString()
      };

      if (this.messagesByConv[conversationId]) {
        this.messagesByConv[conversationId].push(replyMsg);
        conv.lastMessage = randomReply;
        conv.lastMessageTimestamp = replyMsg.timestamp;
        this.saveState();
      }
    }, 2500);
  }
}

export const chatService = new ChatService();
