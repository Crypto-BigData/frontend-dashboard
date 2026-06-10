export const intervalMap = {
  '5m': 300_000,
  '15m': 900_000,
  '1h': 3_600_000,
  '4h': 14_400_000,
  '1d': 86_400_000,
} as const;

export type ChartInterval = keyof typeof intervalMap;

export function daysAgoMs(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export function secondsToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}

export function msToDate(ms: number): Date {
  return new Date(ms);
}
