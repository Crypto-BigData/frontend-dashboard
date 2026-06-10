import { nullableNumber } from './number';
import { msToDate, secondsToDate } from './time';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const smallMoneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 8,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function formatPrice(value: string | number | null | undefined): string {
  const parsed = nullableNumber(value);
  if (parsed === null) return 'N/A';
  return Math.abs(parsed) > 0 && Math.abs(parsed) < 1 ? smallMoneyFormatter.format(parsed) : moneyFormatter.format(parsed);
}

export function formatNumber(value: string | number | null | undefined): string {
  const parsed = nullableNumber(value);
  return parsed === null ? 'N/A' : compactFormatter.format(parsed);
}

export function formatPercent(value: string | number | null | undefined): string {
  const parsed = nullableNumber(value);
  if (parsed === null) return 'N/A';
  return `${parsed > 0 ? '+' : ''}${parsed.toFixed(2)}%`;
}

export function formatRatio(value: string | number | null | undefined): string {
  const parsed = nullableNumber(value);
  return parsed === null ? 'N/A' : `${parsed.toFixed(2)}x`;
}

export function formatMsDate(value: number | null | undefined): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(msToDate(value));
}

export function formatNewsDateFromSeconds(value: number | null | undefined): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(secondsToDate(value));
}

export function formatTimestampDate(value: number | null | undefined): string {
  if (!value) return '-';
  return value > 1_000_000_000_000 ? formatMsDate(value) : formatNewsDateFromSeconds(value);
}

export function sentimentLabel(value?: string | null): string {
  if (!value) return 'Neutral';
  return value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
}
