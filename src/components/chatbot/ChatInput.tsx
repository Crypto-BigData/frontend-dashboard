import { Send } from 'lucide-react';

type Props = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, loading, onChange, onSubmit }: Props) {
  const disabled = loading || value.trim().length === 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="sr-only" htmlFor="chatbot-message">
        Chat message
      </label>
      <textarea
        id="chatbot-message"
        className="min-h-24 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        disabled={loading}
        placeholder="Ask about BTC, ETH, volume spikes, sentiment, or recent news..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!disabled) onSubmit();
          }
        }}
      />
      <div className="mt-3 flex justify-end">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          type="button"
          onClick={onSubmit}
        >
          <Send size={16} aria-hidden="true" />
          Send
        </button>
      </div>
    </div>
  );
}
