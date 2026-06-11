import type { Signal } from '../../types/signal';
import { formatMsDate } from '../../utils/format';

type Props = {
  signals: Signal[];
  loading: boolean;
  error?: string;
};

function signalBadgeClass(type?: string | null) {
  const normalized = type?.toLowerCase() ?? '';
  if (normalized.includes('pump') || normalized.includes('buy')) return 'bg-emerald-50 text-emerald-700';
  if (normalized.includes('dump') || normalized.includes('sell')) return 'bg-rose-50 text-rose-700';
  return 'bg-blue-50 text-blue-700';
}

function formatConfidence(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'N/A';
  const percent = value <= 1 ? value * 100 : value;
  return `${percent.toFixed(0)}%`;
}

export function LatestSignals({ signals, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading latest signals...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Latest signals unavailable: {error}</div>;
  }

  if (signals.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No active signals right now.</div>;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Latest Signals</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {signals.map((signal) => (
          <li key={signal.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-950">{signal.ticker ?? '-'}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${signalBadgeClass(signal.type)}`}>
                  {signal.type ?? '-'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{formatMsDate(signal.detectedAt ? Date.parse(signal.detectedAt) : null)}</p>
            </div>
            <p className="text-sm font-bold text-slate-700">Confidence {formatConfidence(signal.confidence)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
