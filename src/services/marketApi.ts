import { mockCandles } from '../mocks/market.mock';
import type { Candle, KlineQuery, RawKline } from '../types/market';
import { nullableNumber } from '../utils/number';
import { apiGet, USE_MOCK } from './apiClient';

type KlineResponse = { data: RawKline[] } | RawKline[];

function normalizeKline(raw: RawKline): Candle | null {
  const open = nullableNumber(raw.open);
  const high = nullableNumber(raw.high);
  const low = nullableNumber(raw.low);
  const close = nullableNumber(raw.close);
  const volume = nullableNumber(raw.volume);

  if (
    !Number.isFinite(raw.openTime) ||
    !Number.isFinite(raw.closeTime) ||
    open === null ||
    high === null ||
    low === null ||
    close === null ||
    volume === null
  ) {
    return null;
  }

  return {
    ticker: raw.ticker,
    time: Math.floor(raw.openTime / 1000),
    openTime: raw.openTime,
    closeTime: raw.closeTime,
    open,
    high,
    low,
    close,
    volume,
  };
}

function unwrapList(response: KlineResponse): RawKline[] {
  return Array.isArray(response) ? response : response.data;
}

export const marketApi = {
  async getKlines(query: KlineQuery): Promise<Candle[]> {
    if (USE_MOCK) return mockCandles;

    const response = await apiGet<KlineResponse>('/kline/klines', {
      ticker: query.ticker,
      interval: query.interval,
      fromTime: query.fromTime,
      toTime: query.toTime,
    });

    return unwrapList(response)
      .map(normalizeKline)
      .filter((candle): candle is Candle => candle !== null)
      .sort((a, b) => a.openTime - b.openTime);
  },

  async getServerTime(): Promise<number> {
    if (USE_MOCK) return Date.now();

    const response = await apiGet<number | { time: number } | { data: number } | { timestamp: number }>('/kline/time-now');
    if (typeof response === 'number') return response;
    if ('timestamp' in response) return response.timestamp;
    if ('time' in response) return response.time;
    return response.data;
  },
};
