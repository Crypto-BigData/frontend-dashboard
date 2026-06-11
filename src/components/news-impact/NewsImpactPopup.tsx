import type { NewsMarker } from '../../types/newsImpact';
import { sentimentLabel } from '../../utils/format';
import { formatImpactDate, formatImpactPrice, sentimentBadgeClass } from './formatters';

type Props = {
  marker: NewsMarker | null;
  onClose: () => void;
};

export function NewsImpactPopup({ marker, onClose }: Props) {
  if (!marker) return null;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sentimentBadgeClass(marker.sentiment)}`}>
            {sentimentLabel(marker.sentiment)}
          </span>
          <p className="mt-3 font-bold text-slate-950">{marker.title}</p>
          <p className="mt-1 text-sm text-slate-600">
            {marker.sourceName} - {formatImpactDate(marker.publishedOn)} - {formatImpactPrice(marker.priceAtPublish)}
          </p>
        </div>
        <button className="text-sm font-bold text-blue-700" type="button" onClick={onClose}>
          Clear
        </button>
      </div>
    </div>
  );
}
