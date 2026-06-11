import type { SentimentCorrelation } from '../../types/newsImpact';
import { sentimentLabel } from '../../utils/format';
import { formatImpactPercent, sentimentBadgeClass } from './formatters';

type Props = {
  data: SentimentCorrelation[];
  loading: boolean;
  error?: string;
};

export function SentimentCorrelationChart({ data, loading, error }: Props) {
  if (loading) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading sentiment correlation...</div>;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Correlation unavailable: {error}</div>;
  if (data.length === 0) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">No sentiment correlation data.</div>;

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Sentiment Correlation</h3>
      </div>
      <div className="space-y-4 p-5">
        {data.map((item) => (
          <div key={item.sentiment} className="rounded-lg border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(item.sentiment)}`}>
                {sentimentLabel(item.sentiment)}
              </span>
              <span className="text-sm text-slate-500">{item.newsCount} news</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Avg +15m</p>
                <p className="mt-1 font-bold text-slate-950">{formatImpactPercent(item.avgChangePercent15m)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Avg +1h</p>
                <p className="mt-1 font-bold text-slate-950">{formatImpactPercent(item.avgChangePercent1h)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Avg +4h</p>
                <p className="mt-1 font-bold text-slate-950">{formatImpactPercent(item.avgChangePercent4h)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
