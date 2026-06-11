import type { ChatMessage } from '../../types/chatbot';
import { formatMsDate } from '../../utils/format';

type Props = {
  message: ChatMessage;
};

export function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const sources = message.metadata?.sources?.filter(Boolean) ?? [];
  const toolCalls = message.metadata?.toolCalls?.filter(Boolean) ?? [];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <article
        className={`max-w-[min(760px,90%)] rounded-lg border px-4 py-3 shadow-sm ${
          isUser
            ? 'border-blue-200 bg-blue-600 text-white'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        <p className={`mt-2 text-xs ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>{formatMsDate(message.createdAt)}</p>

        {!isUser && (sources.length > 0 || toolCalls.length > 0) ? (
          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
            {sources.length > 0 ? <p>Sources: {sources.join(', ')}</p> : null}
            {toolCalls.length > 0 ? <p>Tools: {toolCalls.join(', ')}</p> : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}
