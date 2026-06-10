import type { Signal } from '../types/signal';

const now = Date.now();

export const mockSignals: Signal[] = [
  {
    id: 'sig-1',
    ticker: 'BTCUSDT',
    type: 'PUMP_ALERT',
    confidence: 0.86,
    detectedAt: new Date(now - 12 * 60 * 1000).toISOString(),
    detectedAtMs: now - 12 * 60 * 1000,
    metadata: { volumeIncrease: '240%' },
  },
  {
    id: 'sig-2',
    ticker: 'BTCUSDT',
    type: 'BUY',
    confidence: 0.78,
    detectedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    detectedAtMs: now - 3 * 60 * 60 * 1000,
    metadata: { reason: 'MA20 recovery' },
  },
  {
    id: 'sig-3',
    ticker: 'BTCUSDT',
    type: 'SELL',
    confidence: null,
    detectedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    detectedAtMs: now - 8 * 60 * 60 * 1000,
    metadata: { reason: 'RSI overheated' },
  },
  {
    id: 'sig-4',
    ticker: 'ETHUSDT',
    type: 'DUMP_ALERT',
    confidence: 0.74,
    detectedAt: new Date(now - 42 * 60 * 1000).toISOString(),
    detectedAtMs: now - 42 * 60 * 1000,
    metadata: { rangeExpansion: '1.8x' },
  },
  {
    id: 'sig-5',
    ticker: 'ETHUSDT',
    type: 'BUY',
    confidence: 0.69,
    detectedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    detectedAtMs: now - 4 * 60 * 60 * 1000,
    metadata: { reason: 'Breakout confirmation' },
  },
];
