import type { NewsMarker } from '../../types/newsImpact';
import { sentimentLabel } from '../../utils/format';
import { formatImpactDate, formatImpactPrice, sentimentBadgeClass } from './formatters';

type Props = {
  markers: NewsMarker[];
  loading: boolean;
  error?: string;
  selectedId?: number;
  onSelect: (marker: NewsMarker) => void;
};

export function NewsImpactMarkerList({ markers, loading, error, selectedId, onSelect }: Props) {
  if (loading) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading news markers...</div>;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Markers unavailable: {error}</div>;
  if (markers.length === 0) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">No news markers found.</div>;

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">News Markers</h3>
        <p className="mt-1 text-sm text-slate-500">Timeline ordered by publish time.</p>
      </div>
      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
        {markers.map((marker) => (
          <button
            key={marker.newsId}
            className={`w-full p-5 text-left transition hover:bg-blue-50 ${
              selectedId === marker.newsId ? 'bg-blue-50' : 'bg-white'
            }`}
            type="button"
            onClick={() => onSelect(marker)}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(marker.sentiment)}`}>
                {sentimentLabel(marker.sentiment)}
              </span>
              <span className="text-xs font-semibold text-slate-400">{formatImpactDate(marker.publishedOn)}</span>
              <span className="text-xs font-semibold text-slate-500">{marker.sourceName}</span>
            </div>
            <p className="mt-3 font-bold text-slate-950">{marker.title}</p>
            <p className="mt-2 text-sm text-slate-500">
              {marker.ticker} - Price at publish {formatImpactPrice(marker.priceAtPublish)}
            </p>
            {marker.keywordList.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {marker.keywordList.slice(0, 5).map((keyword) => (
                  <span key={keyword} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
