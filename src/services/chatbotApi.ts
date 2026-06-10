import { getMockChatbotReply } from '../mocks/chatbot.mock';
import type { ChatbotReply, ChatbotRequest, RawChatbotResponse } from '../types/chatbot';
import { apiPost, USE_MOCK } from './apiClient';

function toStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(String).filter(Boolean);
}

function pickAnswer(response: RawChatbotResponse): string {
  const candidates = [
    response.reply,
    response.answer,
    response.message,
    response.content,
    response.response,
    response.result,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }

  return 'No response returned.';
}

function normalizeChatbotReply(response: RawChatbotResponse): ChatbotReply {
  return {
    answer: pickAnswer(response),
    metadata: {
      sources: toStringList(response.sources),
      toolCalls: toStringList(response.toolCalls),
      raw: response.metadata ?? response,
    },
  };
}

function friendlyError(error: unknown): Error {
  const message = error instanceof Error ? error.message : 'Unknown chatbot error';
  const normalized = message.toLowerCase();

  if (normalized.includes('openai_api_key') || normalized.includes('not configured') || normalized.includes('503')) {
    return new Error('Chatbot is currently unavailable because the backend AI provider is not configured.');
  }

  if (normalized.includes('failed to communicate') || normalized.includes('bad gateway') || normalized.includes('502')) {
    return new Error('Chatbot could not reach the AI service. Please try again later.');
  }

  return new Error(message);
}

export const chatbotApi = {
  async sendMessage(message: string): Promise<ChatbotReply> {
    if (USE_MOCK) return getMockChatbotReply(message);

    try {
      const response = await apiPost<RawChatbotResponse, ChatbotRequest>('/chatbot', { message });
      return normalizeChatbotReply(response);
    } catch (error) {
      throw friendlyError(error);
    }
  },
};
