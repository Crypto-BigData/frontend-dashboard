import type { TopMover } from '../../types/overview';
import { formatPercent, formatPrice } from '../../utils/format';
import { nullableNumber } from '../../utils/number';

type Props = {
  movers: TopMover[];
  loading: boolean;
  error?: string;
};

function changeClass(value: string | number | null | undefined) {
  const parsed = nullableNumber(value);
  if (parsed === null) return 'text-slate-500';
  return parsed >= 0 ? 'text-emerald-600' : 'text-rose-600';
}

function sectionTitle(type: 'gainer' | 'loser') {
  return type === 'gainer' ? 'Top Gainers' : 'Top Losers';
}

export function TopMoversTable({ movers, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading top movers...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Top movers unavailable: {error}</div>;
  }

  if (movers.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No top movers found.</div>;
  }

  const grouped = {
    gainer: movers.filter((item) => item.type === 'gainer' || (nullableNumber(item.priceChangePercent24h) ?? 0) >= 0),
    loser: movers.filter((item) => item.type === 'loser' || (nullableNumber(item.priceChangePercent24h) ?? 0) < 0),
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Top Movers</h3>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        {(['gainer', 'loser'] as const).map((type) => (
          <div key={type} className="min-w-0 border-slate-200 p-5 lg:first:border-r">
            <h4 className="mb-3 text-sm font-bold text-slate-600">{sectionTitle(type)}</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-72 text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-2">Ticker</th>
                    <th className="py-2">Price</th>
                    <th className="py-2 text-right">24h</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grouped[type].map((item) => (
                    <tr key={`${type}-${item.ticker}`}>
                      <td className="py-3 font-semibold text-slate-900">{item.ticker ?? '-'}</td>
                      <td className="py-3 text-slate-600">{formatPrice(item.lastPrice)}</td>
                      <td className={`py-3 text-right font-semibold ${changeClass(item.priceChangePercent24h)}`}>
                        {formatPercent(item.priceChangePercent24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
