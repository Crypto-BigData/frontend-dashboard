import type { NewsItem } from '../../types/news';
import { formatTimestampDate, sentimentLabel } from '../../utils/format';

type Props = {
  item: NewsItem;
  onSelect: (item: NewsItem) => void;
};

function sentimentBadgeClass(sentiment?: string | null) {
  const normalized = sentiment?.toLowerCase() ?? 'neutral';
  if (normalized === 'positive') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (normalized === 'negative') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export function NewsCard({ item, onSelect }: Props) {
  return (
    <button
      className="w-full rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
      type="button"
      onClick={() => onSelect(item)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(item.sentiment)}`}>
          {sentimentLabel(item.sentiment)}
        </span>
        <span className="text-xs font-semibold text-slate-400">{formatTimestampDate(item.publishedOn)}</span>
        <span className="text-xs font-semibold text-slate-400">-</span>
        <span className="text-xs font-semibold text-slate-500">{item.sourceName ?? '-'}</span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-950">{item.title ?? '-'}</h3>
      {item.subtitle ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.subtitle}</p> : null}

      {item.categoryList.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.categoryList.slice(0, 4).map((category) => (
            <span key={category} className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              {category}
            </span>
          ))}
        </div>
      ) : null}

      {item.keywordList.length > 0 ? (
        <p className="mt-3 text-xs text-slate-500">Keywords: {item.keywordList.slice(0, 6).join(', ')}</p>
      ) : null}
    </button>
  );
}
