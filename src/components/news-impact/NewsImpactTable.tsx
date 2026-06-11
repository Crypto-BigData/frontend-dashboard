import type { ImpactTableRow } from '../../types/newsImpact';
import { sentimentLabel } from '../../utils/format';
import { formatImpactDate, formatImpactPercent, sentimentBadgeClass } from './formatters';

type Props = {
  rows: ImpactTableRow[];
  loading: boolean;
  error?: string;
};

export function NewsImpactTable({ rows, loading, error }: Props) {
  if (loading) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading impact table...</div>;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Impact table unavailable: {error}</div>;
  if (rows.length === 0) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">No impact table data.</div>;

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Impact Table</h3>
      </div>
      <div className="overflow-auto max-h-[500px] custom-scrollbar">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400 sticky top-0 z-10">
            <tr>
              <th className="px-5 py-3">News</th>
              <th className="px-5 py-3">Ticker</th>
              <th className="px-5 py-3">Sentiment</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3 text-right">+15m</th>
              <th className="px-5 py-3 text-right">+1h</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.newsId}>
                <td className="px-5 py-4 font-semibold text-slate-950">{row.title}</td>
                <td className="px-5 py-4 text-slate-600">{row.ticker}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(row.sentiment)}`}>
                    {sentimentLabel(row.sentiment)}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{formatImpactDate(row.publishedOn)}</td>
                <td className="px-5 py-4 text-right font-bold text-slate-900">{formatImpactPercent(row.changePercent15m)}</td>
                <td className="px-5 py-4 text-right font-bold text-slate-900">{formatImpactPercent(row.changePercent1h)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
