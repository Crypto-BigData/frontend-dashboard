import { average } from '../utils/number';
import { mockCandles } from './market.mock';
import type { IndicatorResponse } from '../types/indicator';

function movingAverage(period: number) {
  return mockCandles.map((candle, index) => ({
    time: candle.time,
    value: average(mockCandles.slice(Math.max(0, index - period + 1), index + 1).map((item) => item.close)),
  }));
}

function exponentialMovingAverage(period: number) {
  const multiplier = 2 / (period + 1);
  let previous = mockCandles[0]?.close ?? 0;

  return mockCandles.map((candle, index) => {
    previous = index === 0 ? candle.close : (candle.close - previous) * multiplier + previous;
    return {
      time: candle.time,
      value: previous,
    };
  });
}

function standardDeviation(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function bollingerBands(period = 20) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (const [index, candle] of mockCandles.entries()) {
    const window = mockCandles.slice(Math.max(0, index - period + 1), index + 1).map((item) => item.close);
    const mean = average(window);
    const deviation = standardDeviation(window, mean);

    middle.push({ time: candle.time, value: mean });
    upper.push({ time: candle.time, value: mean + deviation * 2 });
    lower.push({ time: candle.time, value: mean - deviation * 2 });
  }

  return { upper, middle, lower };
}

function rsi() {
  return mockCandles.map((candle, index) => ({
    time: candle.time,
    value: 50 + Math.sin(index / 6) * 24,
  }));
}

const bollinger = bollingerBands();

export const mockIndicators: IndicatorResponse = {
  ticker: 'BTCUSDT',
  interval: 300_000,
  ma20: movingAverage(20),
  ma50: movingAverage(50),
  ema20: exponentialMovingAverage(20),
  ema50: exponentialMovingAverage(50),
  bollingerUpper: bollinger.upper,
  bollingerMiddle: bollinger.middle,
  bollingerLower: bollinger.lower,
  rsi: rsi(),
};
