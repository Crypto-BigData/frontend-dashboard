import { mockIndicators } from '../mocks/indicators.mock';
import type { IndicatorResponse, RawIndicatorPoint, RawIndicatorResponse } from '../types/indicator';
import { nullableNumber } from '../utils/number';
import { apiGet, USE_MOCK } from './apiClient';

export type IndicatorQuery = {
  ticker: string;
  interval: number;
  indicators: string;
  fromTime?: number;
  toTime?: number;
};

function toChartTime(timestamp: number): number {
  return timestamp > 1_000_000_000_000 ? Math.floor(timestamp / 1000) : Math.floor(timestamp);
}

function pointTimestamp(point: RawIndicatorPoint): number | null {
  const timestamp = nullableNumber(point.openTime ?? point.time ?? point.timestamp);
  return timestamp === null ? null : timestamp;
}

function normalizePoints(points?: RawIndicatorPoint[]) {
  return (
    points
      ?.map((point) => {
        const value = nullableNumber(point.value);
        const timestamp = pointTimestamp(point);
        if (timestamp === null || value === null) return null;

        return {
          time: toChartTime(timestamp),
          value,
        };
      })
      .filter((point): point is { time: number; value: number } => point !== null)
      .sort((a, b) => a.time - b.time) ?? []
  );
}

function firstSeries(raw: RawIndicatorResponse, keys: Array<keyof RawIndicatorResponse>): RawIndicatorPoint[] | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (Array.isArray(value)) return value;
  }

  return undefined;
}

function normalizeIndicators(raw: RawIndicatorResponse): IndicatorResponse {
  return {
    ticker: raw.ticker,
    interval: raw.interval,
    ma20: normalizePoints(firstSeries(raw, ['ma20', 'MA20', 'ma_20'])),
    ma50: normalizePoints(firstSeries(raw, ['ma50', 'MA50', 'ma_50'])),
    ema20: normalizePoints(firstSeries(raw, ['ema20', 'EMA20', 'ema_20'])),
    ema50: normalizePoints(firstSeries(raw, ['ema50', 'EMA50', 'ema_50'])),
    bollingerUpper: normalizePoints(raw.bollinger?.map((p: any) => ({ time: p.openTime, value: p.upper }))),
    bollingerMiddle: normalizePoints(raw.bollinger?.map((p: any) => ({ time: p.openTime, value: p.middle }))),
    bollingerLower: normalizePoints(raw.bollinger?.map((p: any) => ({ time: p.openTime, value: p.lower }))),
    rsi: normalizePoints(raw.rsi),
  };
}

export const indicatorsApi = {
  async getIndicators(query: IndicatorQuery): Promise<IndicatorResponse> {
    if (USE_MOCK) return mockIndicators;

    const response = await apiGet<RawIndicatorResponse>('/indicators', {
          ticker: query.ticker,
          interval: query.interval,
          indicators: query.indicators,
      fromTime: query.fromTime,
      toTime: query.toTime,
    });

    return normalizeIndicators(response);
  },
};
