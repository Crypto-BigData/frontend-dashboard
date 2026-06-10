import type { Candle } from '../types/market';

const now = Date.now();

export const mockCandles: Candle[] = Array.from({ length: 80 }, (_, index) => {
  const base = 64_000 + Math.sin(index / 5) * 900 + index * 18;
  const open = base + Math.sin(index) * 120;
  const close = base + Math.cos(index / 2) * 160;
  const high = Math.max(open, close) + 220;
  const low = Math.min(open, close) - 180;

  return {
    ticker: 'BTCUSDT',
    time: Math.floor((now - (80 - index) * 300_000) / 1000),
    openTime: now - (80 - index) * 300_000,
    closeTime: now - (79 - index) * 300_000,
    open,
    high,
    low,
    close,
    volume: 850 + Math.abs(Math.sin(index / 3)) * 650,
  };
});
