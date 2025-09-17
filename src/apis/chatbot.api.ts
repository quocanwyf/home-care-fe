import axios from 'axios';

import type { GroqResponse } from '@/types/table/objects/chatbot';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;

export const sendMessageToOpenAI = async (message: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key không được cấu hình');
  }

  try {
    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant', // Groq's free model
        messages: [
          {
            role: 'system',
            content:
              'Bạn là một trợ lý AI hữu ích cho ứng dụng chăm sóc sức khỏe tại nhà. Hãy trả lời một cách thân thiện và hữu ích bằng tiếng Việt.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return (
      response.data.choices[0]?.message?.content ||
      'Xin lỗi, tôi không thể trả lời lúc này.'
    );
  } catch (error) {
    console.error('Error calling Groq API:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message || 'Lỗi kết nối API';
      throw new Error(errorMessage);
    }

    throw new Error('Không thể kết nối với chatbot. Vui lòng thử lại sau.');
  }
};
