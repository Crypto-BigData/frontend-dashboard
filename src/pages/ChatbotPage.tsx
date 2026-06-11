import { useCallback, useState } from 'react';
import { ChatInput } from '../components/chatbot/ChatInput';
import { ChatMessageList } from '../components/chatbot/ChatMessageList';
import { SuggestedPrompts } from '../components/chatbot/SuggestedPrompts';
import { chatbotApi } from '../services/chatbotApi';
import type { ChatMessage } from '../types/chatbot';

const suggestedPrompts = [
  'BTC hôm nay có tín hiệu gì?',
  'Tin tức tiêu cực gần nhất về ETH là gì?',
  'Volume spike mạnh nhất trong 24h qua là ticker nào?',
  'Tóm tắt thị trường hôm nay.',
  'Bitcoin có tin tức nào ảnh hưởng giá trong 24h qua không?',
];

function createMessage(role: ChatMessage['role'], content: string, metadata?: ChatMessage['metadata']): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    createdAt: Date.now(),
    metadata,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Chatbot request failed.';
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const content = (messageText ?? input).trim();
      if (!content || loading) return;

      setError(undefined);
      setInput('');
      setLoading(true);
      setMessages((current) => [...current, createMessage('user', content)]);

      try {
        const reply = await chatbotApi.sendMessage(content);
        setMessages((current) => [...current, createMessage('assistant', reply.answer, reply.metadata)]);
      } catch (requestError) {
        const friendlyMessage = errorMessage(requestError);
        setError(friendlyMessage);
        setMessages((current) => [...current, createMessage('assistant', friendlyMessage)]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading],
  );

  return (
    <div className="space-y-6">
      <section>
        <p className="eyebrow">Chatbot</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Chatbot</h2>
        <p className="mt-2 text-sm text-slate-500">Ask questions about market, news, signals and sentiment.</p>
      </section>

      <SuggestedPrompts prompts={suggestedPrompts} disabled={loading} onSelect={(prompt) => void sendMessage(prompt)} />

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <ChatMessageList messages={messages} loading={loading} />
      <ChatInput value={input} loading={loading} onChange={setInput} onSubmit={() => void sendMessage()} />
    </div>
  );
}
