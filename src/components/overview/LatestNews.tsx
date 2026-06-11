import type { NewsItem } from '../../types/news';
import { formatTimestampDate, sentimentLabel } from '../../utils/format';

type Props = {
  news: NewsItem[];
  loading: boolean;
  error?: string;
  onSelect?: (news: NewsItem) => void;
};

function sentimentBadgeClass(sentiment?: string | null) {
  const normalized = sentiment?.toLowerCase() ?? 'neutral';
  if (normalized === 'positive') return 'bg-emerald-50 text-emerald-700';
  if (normalized === 'negative') return 'bg-rose-50 text-rose-700';
  return 'bg-slate-100 text-slate-700';
}

export function LatestNews({ news, loading, error, onSelect }: Props) {
  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading latest news...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Latest news unavailable: {error}</div>;
  }

  if (news.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No latest news found.</div>;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Latest News</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {news.map((item) => (
          <li 
            key={item.id} 
            className="px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => onSelect?.(item)}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(item.sentiment)}`}>
                {sentimentLabel(item.sentiment)}
              </span>
              <span className="text-xs font-semibold text-slate-400">{formatTimestampDate(item.publishedOn)}</span>
            </div>
            <p className="mt-2 line-clamp-2 font-semibold text-slate-950">{item.title ?? '-'}</p>
            <p className="mt-1 text-sm text-slate-500">{item.sourceName ?? '-'}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
