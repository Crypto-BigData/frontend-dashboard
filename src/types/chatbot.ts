export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  metadata?: ChatbotMetadata;
};

export type ChatbotRequest = {
  message: string;
};

export type ChatbotMetadata = {
  sources?: string[];
  toolCalls?: string[];
  raw?: unknown;
};

export type ChatbotReply = {
  answer: string;
  metadata?: ChatbotMetadata;
};

export type RawChatbotResponse = {
  reply?: unknown;
  answer?: unknown;
  message?: unknown;
  content?: unknown;
  response?: unknown;
  result?: unknown;
  sources?: unknown;
  toolCalls?: unknown;
  metadata?: unknown;
};
