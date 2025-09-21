import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetAvailableStaffResponse,
  GetConversationDetailResponse,
  GetConversationsRequest,
  GetConversationsResponse,
  GetMessagesResponse,
  MarkAsReadResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/params/chat-params';

// API để lấy danh sách nhân viên chưa có cuộc hội thoại
export const getAvailableStaffApi = async (
  staffId: string
): Promise<GetAvailableStaffResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/create-conversation?staffId=${staffId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch available staff');
  }

  return response.json();
};

// API tạo cuộc hội thoại mới
export const createConversationApi = async (
  payload: CreateConversationRequest
): Promise<CreateConversationResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/create-conversation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};

// API lấy danh sách cuộc hội thoại
export const getConversationsApi = async (
  params: GetConversationsRequest
): Promise<GetConversationsResponse> => {
  const queryParams = new URLSearchParams({
    staffId: params.staffId,
    type: params.type,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/get-conversations?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return response.json();
};

// API lấy chi tiết cuộc hội thoại
export const getConversationDetailApi = async (
  conversationId: string
): Promise<GetConversationDetailResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/conversation/${conversationId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch conversation detail');
  }

  return response.json();
};

// API lấy tin nhắn
export const getMessagesApi = async (
  conversationId: string
): Promise<GetMessagesResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/conversation/messages/${conversationId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
};

// API gửi tin nhắn
export const sendMessageApi = async (
  payload: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/send-message`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};

// API đánh dấu đã đọc
export const markAsReadApi = async (
  conversationId: string,
  userId: string
): Promise<MarkAsReadResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/chats/conversation/read/${conversationId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to mark as read');
  }

  return response.json();
};
