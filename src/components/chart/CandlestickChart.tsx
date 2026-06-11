import {
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  LineStyle,
  type LineData,
  type SeriesMarker,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useMemo, useRef } from 'react';
import type { IndicatorPoint } from '../../types/indicator';
import type { Candle } from '../../types/market';
import type { Signal } from '../../types/signal';
import type { NewsMarker } from '../../types/newsImpact';

type Props = {
  candles: Candle[];
  ma20?: IndicatorPoint[];
  ma50?: IndicatorPoint[];
  bollingerUpper?: IndicatorPoint[];
  bollingerMiddle?: IndicatorPoint[];
  bollingerLower?: IndicatorPoint[];
  signals?: Signal[];
  news?: NewsMarker[];
};

type LineSeriesKey =
  | 'ma20'
  | 'ma50'
  | 'bollingerUpper'
  | 'bollingerMiddle'
  | 'bollingerLower';

type LineSeriesMap = Partial<Record<LineSeriesKey, ISeriesApi<'Line'>>>;

const lineSeriesOptions: Record<
  LineSeriesKey,
  { color: string; title: string; lineWidth?: 1 | 2; lineStyle?: LineStyle }
> = {
  ma20: { color: '#2563eb', title: 'MA20', lineWidth: 2 },
  ma50: { color: '#f59e0b', title: 'MA50', lineWidth: 2 },
  bollingerUpper: { color: '#64748b', title: 'BB Upper', lineWidth: 1, lineStyle: LineStyle.Dashed },
  bollingerMiddle: { color: '#94a3b8', title: 'BB Middle', lineWidth: 1, lineStyle: LineStyle.Dotted },
  bollingerLower: { color: '#64748b', title: 'BB Lower', lineWidth: 1, lineStyle: LineStyle.Dashed },
};

function toLineData(points?: IndicatorPoint[]): LineData[] {
  return (
    points?.map((point) => ({
      time: point.time as UTCTimestamp,
      value: point.value,
    })) ?? []
  );
}

function normalizeSignalType(type?: string | null): string {
  return (type ?? '').toUpperCase().replace(/[\s-]+/g, '_');
}

function markerConfig(type?: string | null) {
  const normalized = normalizeSignalType(type);
  if (normalized.includes('SELL')) {
    return { position: 'aboveBar' as const, shape: 'arrowDown' as const, color: '#e11d48', text: 'Sell' };
  }
  if (normalized.includes('DUMP')) {
    return { position: 'aboveBar' as const, shape: 'arrowDown' as const, color: '#be123c', text: 'Dump' };
  }
  if (normalized.includes('PUMP')) {
    return { position: 'belowBar' as const, shape: 'arrowUp' as const, color: '#059669', text: 'Pump' };
  }
  if (normalized.includes('BUY')) {
    return { position: 'belowBar' as const, shape: 'arrowUp' as const, color: '#16a34a', text: 'Buy' };
  }
  return { position: 'belowBar' as const, shape: 'circle' as const, color: '#2563eb', text: type ?? '-' };
}

function nearestCandle(candles: Candle[], timestampMs: number): Candle | null {
  const first = candles[0];
  const last = candles[candles.length - 1];

  // If closeTime is 0 (due to DB issues), fallback to openTime + 5 minutes
  const lastClose = last?.closeTime > 0 ? last.closeTime : (last?.openTime + 300000);
  
  // Strictly enforce boundaries so we don't snap future news to old candles
  if (!first || !last || timestampMs < first.openTime || timestampMs > lastClose) return null;

  return candles.reduce((nearest, candle) => {
    const nearestDistance = Math.abs(nearest.openTime - timestampMs);
    const candleDistance = Math.abs(candle.openTime - timestampMs);
    return candleDistance < nearestDistance ? candle : nearest;
  }, first);
}

function toMarkers(candles: Candle[], signals?: Signal[], news?: NewsMarker[]): SeriesMarker<UTCTimestamp>[] {
  const markersMap = new Map<UTCTimestamp, SeriesMarker<UTCTimestamp>>();

  signals?.forEach((signal) => {
    if (!signal.detectedAtMs) return;
    const candle = nearestCandle(candles, signal.detectedAtMs);
    if (!candle) return;
    const config = markerConfig(signal.type);

    markersMap.set(candle.time as UTCTimestamp, {
      time: candle.time as UTCTimestamp,
      position: config.position,
      shape: config.shape,
      color: config.color,
      text: config.text,
    });
  });

  // Iterate in reverse so NEWEST news (which are at the start of the array) overwrite older news
  if (news) {
    for (let i = news.length - 1; i >= 0; i--) {
      const item = news[i];
      if (!item.publishedOn) continue;
      const candle = nearestCandle(candles, item.publishedOn);
      if (!candle) continue;
      
      const isPositive = item.sentiment?.toLowerCase() === 'positive';
      const isNegative = item.sentiment?.toLowerCase() === 'negative';
      const color = isPositive ? '#16a34a' : isNegative ? '#e11d48' : '#3b82f6';
      const shape = isPositive ? 'arrowUp' : isNegative ? 'arrowDown' : 'square';
      const position = isPositive ? 'belowBar' : 'aboveBar';
      
      const existing = markersMap.get(candle.time as UTCTimestamp);
      
      markersMap.set(candle.time as UTCTimestamp, {
        time: candle.time as UTCTimestamp,
        position,
        shape,
        color,
        text: existing ? 'N+' : 'N', // If multiple events on same candle, show N+
      });
    }
  }

  return Array.from(markersMap.values()).sort((a, b) => Number(a.time) - Number(b.time));
}

export function CandlestickChart({
  candles,
  ma20,
  ma50,
  bollingerUpper,
  bollingerMiddle,
  bollingerLower,
  signals,
  news,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<LineSeriesMap>({});

  const chartData = useMemo<CandlestickData[]>(
    () =>
      candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    [candles],
  );
  const lineData = useMemo<Record<LineSeriesKey, LineData[]>>(
    () => ({
      ma20: toLineData(ma20),
      ma50: toLineData(ma50),
      bollingerUpper: toLineData(bollingerUpper),
      bollingerMiddle: toLineData(bollingerMiddle),
      bollingerLower: toLineData(bollingerLower),
    }),
    [bollingerLower, bollingerMiddle, bollingerUpper, ma20, ma50],
  );
  const combinedMarkers = useMemo(() => toMarkers(candles, signals, news), [candles, signals, news]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#334155',
      },
      grid: {
        vertLines: { color: '#eef2f7' },
        horzLines: { color: '#eef2f7' },
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#059669',
      downColor: '#e11d48',
      borderUpColor: '#059669',
      borderDownColor: '#e11d48',
      wickUpColor: '#059669',
      wickDownColor: '#e11d48',
    });

    const lineSeries = Object.fromEntries(
      Object.entries(lineSeriesOptions).map(([key, options]) => [
        key,
        chart.addLineSeries({
          color: options.color,
          lineWidth: options.lineWidth ?? 2,
          lineStyle: options.lineStyle ?? LineStyle.Solid,
          priceLineVisible: false,
          lastValueVisible: false,
          title: options.title,
        }),
      ]),
    ) as LineSeriesMap;

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    lineSeriesRef.current = lineSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
      lineSeriesRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(chartData);
      candlestickSeriesRef.current.setMarkers(combinedMarkers);
      chartRef.current?.timeScale().fitContent();
    }
  }, [chartData, combinedMarkers]);

  useEffect(() => {
    Object.entries(lineData).forEach(([key, data]) => {
      lineSeriesRef.current[key as LineSeriesKey]?.setData(data);
    });
  }, [lineData]);

// combinedMarkers effect merged into chartData effect

  return (
    <div className="relative">
      <div ref={containerRef} className="h-[420px] w-full" />
    </div>
  );
}
