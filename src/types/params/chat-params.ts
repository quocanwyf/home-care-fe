export interface AvailableStaff {
  _id: string;
  fullName: string;
  phone: string;
  avatar: string;
}

// API Response types
export interface GetAvailableStaffResponse {
  success: boolean;
  staffList: AvailableStaff[];
}

export interface CreateConversationRequest {
  participants: Array<{
    id: string;
    type: string;
  }>;
  conversationType: string;
}

export interface CreateConversationResponse {
  success: boolean;
}

export interface GetConversationsRequest {
  staffId: string;
  type: 'staff' | 'customer' | 'helper';
  page?: number;
  limit?: number;
}

export interface GetConversationsResponse {
  success: boolean;
  conversationData: ChatConversation[];
  conversationType: string;
  totalConversations: number;
}

export interface GetConversationDetailResponse {
  success: boolean;
  data: {
    _id: string;
    participants: ChatParticipant[];
    conversationType: string;
    lastUpdated: string;
    id: string;
  };
}

export interface GetMessagesResponse {
  success: boolean;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  conversationId: string;
  senderId: string;
  senderType: string;
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    conversationId: string;
    senderId: string;
    senderType: string;
    content: string;
    status: string;
    _id: string;
    createdAt: string;
    __v: number;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}
