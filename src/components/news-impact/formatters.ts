import { formatPercent, formatPrice, formatTimestampDate } from '../../utils/format';

export function formatImpactDate(value: number | null | undefined): string {
  return formatTimestampDate(value);
}

export function formatImpactPrice(value: string | number | null | undefined): string {
  return formatPrice(value);
}

export function formatImpactPercent(value: string | number | null | undefined): string {
  return formatPercent(value);
}

export function sentimentBadgeClass(sentiment?: string | null): string {
  const normalized = sentiment?.toLowerCase() ?? 'neutral';
  if (normalized === 'positive') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (normalized === 'negative') return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-slate-200 bg-slate-100 text-slate-700';
}
