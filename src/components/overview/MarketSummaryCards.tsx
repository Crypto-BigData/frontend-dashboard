import type { MarketSummary } from '../../types/overview';
import type { Signal } from '../../types/signal';
import { formatPercent, formatPrice, sentimentLabel } from '../../utils/format';

type Props = {
  summary: MarketSummary | null;
  signals: Signal[];
  loading: boolean;
  error?: string;
};

function dominantSentiment(summary: MarketSummary | null): string {
  if (!summary?.generalSentiment) return 'Neutral';

  const entries = Object.entries(summary.generalSentiment);
  const [label] = entries.reduce((highest, current) => (current[1] > highest[1] ? current : highest), entries[0]);
  return sentimentLabel(label);
}

function Card({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
    </article>
  );
}

export function MarketSummaryCards({ summary, signals, loading, error }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {['BTC Price', 'ETH Price', 'Market Sentiment', 'Active Signals'].map((title) => (
          <Card key={title} title={title} value="Loading..." subtitle="Fetching market snapshot" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Market summary unavailable: {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
        No market summary data available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card title="BTC Price" value={formatPrice(summary.btcPrice)} subtitle={formatPercent(summary.btcChange24h)} />
      <Card title="ETH Price" value={formatPrice(summary.ethPrice)} subtitle={formatPercent(summary.ethChange24h)} />
      <Card title="Market Sentiment" value={dominantSentiment(summary)} subtitle="Based on latest news mix" />
      <Card title="Active Signals" value={String(signals.length)} subtitle="Current pump/dump alerts" />
    </div>
  );
}
