import {
  createConversationApi,
  getAvailableStaffApi,
  getConversationDetailApi,
  getConversationsApi,
  getMessagesApi,
  markAsReadApi,
  sendMessageApi,
} from '@/apis/chat.api';
import type {
  CreateConversationRequest,
  GetConversationsRequest,
  SendMessageRequest,
} from '@/types/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook lấy danh sách nhân viên có thể tạo cuộc hội thoại
export const useGetAvailableStaff = (staffId: string) => {
  return useQuery({
    queryKey: ['chat', 'available-staff', staffId],
    queryFn: () => getAvailableStaffApi(staffId),
    enabled: !!staffId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook tạo cuộc hội thoại mới
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationRequest) =>
      createConversationApi(payload),
    onSuccess: () => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'available-staff'] });
    },
  });
};

// Hook lấy danh sách cuộc hội thoại
export const useGetConversations = (params: GetConversationsRequest) => {
  return useQuery({
    queryKey: ['chat', 'conversations', params],
    queryFn: () => getConversationsApi(params),
    enabled: !!params.staffId && !!params.type,
    staleTime: 30 * 1000, // 30 giây
    refetchInterval: 10 * 1000, // Refresh mỗi 10s để cập nhật danh sách
  });
};

// Hook lấy chi tiết cuộc hội thoại
export const useGetConversationDetail = (conversationId: string) => {
  return useQuery({
    queryKey: ['chat', 'conversation-detail', conversationId],
    queryFn: () => getConversationDetailApi(conversationId),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook lấy tin nhắn của cuộc hội thoại
export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => getMessagesApi(conversationId),
    enabled: !!conversationId,
    staleTime: 0, // Luôn fetch fresh data
    refetchInterval: 3 * 1000, // Refresh mỗi 3s để có cảm giác real-time
  });
};

// Hook gửi tin nhắn
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessageRequest) => sendMessageApi(payload),
    onSuccess: (_, variables) => {
      // Refresh messages của conversation hiện tại
      queryClient.invalidateQueries({
        queryKey: ['chat', 'messages', variables.conversationId],
      });
      // Refresh danh sách conversations để cập nhật lastMessage
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversations'],
      });
    },
  });
};

// Hook đánh dấu đã đọc
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => markAsReadApi(conversationId, userId),
    onSuccess: (_, variables) => {
      // Refresh messages để cập nhật trạng thái đã đọc
      queryClient.invalidateQueries({
        queryKey: ['chat', 'messages', variables.conversationId],
      });
    },
  });
};
