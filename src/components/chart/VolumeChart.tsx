import { createChart, type HistogramData, type IChartApi, type UTCTimestamp } from 'lightweight-charts';
import { useEffect, useMemo, useRef } from 'react';
import type { Candle } from '../../types/market';

type Props = {
  candles: Candle[];
};

export function VolumeChart({ candles }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const chartData = useMemo<HistogramData[]>(
    () =>
      candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        value: candle.volume,
        color: candle.close >= candle.open ? '#10b981' : '#fb7185',
      })),
    [candles],
  );

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
    });

    const series = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceLineVisible: false,
    });

    series.setData(chartData);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData]);

  return (
    <section className="rounded-lg border border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h4 className="text-base font-bold text-slate-950">Volume</h4>
      </div>
      <div ref={containerRef} className="h-[180px] w-full" />
    </section>
  );
}
