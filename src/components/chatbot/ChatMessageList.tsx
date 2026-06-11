import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types/chatbot';
import { ChatMessageBubble } from './ChatMessageBubble';

type Props = {
  messages: ChatMessage[];
  loading: boolean;
};

export function ChatMessageList({ messages, loading }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Ask a question to start analyzing market, news, signals and sentiment.
      </div>
    );
  }

  return (
    <div className="max-h-[58vh] space-y-4 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      {loading ? (
        <div className="flex justify-start">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Thinking...
          </div>
        </div>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
