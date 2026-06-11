import type { VolumeSpike } from '../../types/overview';
import { formatNumber, formatRatio } from '../../utils/format';

type Props = {
  spikes: VolumeSpike[];
  loading: boolean;
  error?: string;
};

export function VolumeSpikeList({ spikes, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading volume spikes...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Volume spikes unavailable: {error}</div>;
  }

  if (spikes.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">No volume spikes detected.</div>;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-950">Volume Spike</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {spikes.map((item) => (
          <li key={item.ticker} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold text-slate-950">{item.ticker ?? '-'}</p>
              <p className="mt-1 text-sm text-slate-500">
                Current {formatNumber(item.lastVolume24h)} / Average {formatNumber(item.averageVolume7d)}
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
              {formatRatio(item.spikeRatio)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
