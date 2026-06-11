import type { NewsMarker, PriceImpact, PriceImpactWindow } from '../../types/newsImpact';
import { sentimentLabel } from '../../utils/format';
import { formatImpactDate, formatImpactPercent, formatImpactPrice, sentimentBadgeClass } from './formatters';

type Props = {
  marker: NewsMarker | null;
  impact: PriceImpact | null;
  loading: boolean;
  error?: string;
};

function WindowStat({ label, window }: { label: string; window: PriceImpactWindow | null | undefined }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{formatImpactPercent(window?.changePercent)}</p>
      <p className="mt-1 text-sm text-slate-500">Price {formatImpactPrice(window?.price)}</p>
    </div>
  );
}

export function PriceImpactPanel({ marker, impact, loading, error }: Props) {
  if (!marker) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Select a marker to view price impact.</div>;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(marker.sentiment)}`}>
            {sentimentLabel(marker.sentiment)}
          </span>
          <span className="text-xs font-semibold text-slate-400">{formatImpactDate(marker.publishedOn)}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-slate-950">{marker.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {marker.sourceName} - {marker.ticker} - Price at publish {formatImpactPrice(marker.priceAtPublish)}
        </p>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-slate-500">Loading price impact...</div>
      ) : error ? (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Price impact unavailable: {error}</div>
      ) : impact ? (
        <div className="space-y-5 p-5">
          {marker.keywordList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {marker.keywordList.map((keyword) => (
                <span key={keyword} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <WindowStat label="After 5m" window={impact.impact.after5m} />
            <WindowStat label="After 15m" window={impact.impact.after15m} />
            <WindowStat label="After 1h" window={impact.impact.after1h} />
            <WindowStat label="After 4h" window={impact.impact.after4h} />
          </div>
        </div>
      ) : (
        <div className="p-6 text-sm text-slate-500">No price impact data available.</div>
      )}
    </section>
  );
}
