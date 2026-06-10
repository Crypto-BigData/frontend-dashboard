import { mockSignals } from '../mocks/signals.mock';
import type { RawSignal, Signal } from '../types/signal';
import { nullableNumber } from '../utils/number';
import { apiGet, USE_MOCK } from './apiClient';

type SignalResponse = { data: RawSignal[] } | RawSignal[];

function unwrapList(response: SignalResponse): RawSignal[] {
  return Array.isArray(response) ? response : response.data;
}

function toTimestampMs(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return value > 1_000_000_000_000 ? value : value * 1000;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSignal(raw: RawSignal, index: number): Signal | null {
  const ticker = raw.ticker ?? raw.symbol;
  const type = raw.type ?? raw.signalType ?? '-';
  const detectedAt = raw.detectedAt ?? raw.timestamp ?? raw.createdAt ?? raw.openTime ?? null;
  const detectedAtMs = toTimestampMs(detectedAt);

  if (!ticker || !detectedAtMs) return null;

  return {
    id: String(raw.id ?? `${ticker}-${type}-${detectedAtMs}-${index}`),
    ticker,
    type,
    confidence: nullableNumber(raw.confidence),
    detectedAt: typeof detectedAt === 'string' ? detectedAt : new Date(detectedAtMs).toISOString(),
    detectedAtMs,
    metadata: raw.metadata ?? {},
  };
}

export const signalsApi = {
  async getActiveSignals(limit = 10, ticker?: string): Promise<Signal[]> {
    if (USE_MOCK) return mockSignals.slice(0, limit);

    const query: Record<string, string | number> = { limit };
    if (ticker) {
      query.ticker = ticker;
    }

    const response = await apiGet<SignalResponse>('/signals/active', query);
    return unwrapList(response)
      .map(normalizeSignal)
      .filter((signal): signal is Signal => signal !== null);
  },
};
