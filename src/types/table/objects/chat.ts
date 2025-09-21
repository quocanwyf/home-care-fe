export interface ChatParticipant {
  id: string;
  type: 'staff' | 'customer' | 'helper';
  userFullName?: string;
  userAvatar?: string;
  userPhone?: string;
}

export interface ChatConversation {
  _id: string;
  participants: ChatParticipant[];
  conversationType: 'staff' | 'customer' | 'helper';
  lastMessage: string;
  lastUpdated: string;
  id: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderType: 'staff' | 'customer' | 'helper';
  content: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  senderInfo: {
    fullName: string;
    avatar: string;
  };
}
