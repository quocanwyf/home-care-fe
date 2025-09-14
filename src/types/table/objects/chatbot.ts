export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatBotState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}
