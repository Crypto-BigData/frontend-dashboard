import type { NewsMarker } from '../../types/newsImpact';
import { formatImpactDate, sentimentBadgeClass } from './formatters';

type Props = {
  markers: NewsMarker[];
};

export function NewsImpactTimeline({ markers }: Props) {
  if (markers.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">Impact Timeline</h3>
      <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {markers.map((marker) => (
          <div key={marker.newsId} className="min-w-52 rounded-lg border border-slate-200 p-4">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(marker.sentiment)}`}>
              {marker.sentiment}
            </span>
            <p className="mt-3 text-xs font-semibold text-slate-400">{formatImpactDate(marker.publishedOn)}</p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-900">{marker.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
