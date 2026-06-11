import { createChart, type IChartApi, type LineData, type UTCTimestamp } from 'lightweight-charts';
import { useEffect, useMemo, useRef } from 'react';
import type { IndicatorPoint } from '../../types/indicator';

type Props = {
  data?: IndicatorPoint[];
};

export function RsiPanel({ data = [] }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const chartData = useMemo<LineData[]>(
    () =>
      data.map((point) => ({
        time: point.time as UTCTimestamp,
        value: point.value,
      })),
    [data],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (chartData.length === 0) return;

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
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addLineSeries({
      color: '#7c3aed',
      lineWidth: 2,
      priceLineVisible: false,
      title: 'RSI',
    });

    series.setData(chartData);
    series.createPriceLine({
      price: 70,
      color: '#f97316',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: '70',
    });
    series.createPriceLine({
      price: 30,
      color: '#0284c7',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: '30',
    });
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [chartData]);

  if (data.length === 0) {
    return (
      <section className="rounded-lg border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h4 className="text-base font-bold text-slate-950">RSI</h4>
        </div>
        <div className="p-5 text-sm text-slate-500">No RSI data available for this range.</div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h4 className="text-base font-bold text-slate-950">RSI</h4>
      </div>
      <div ref={containerRef} className="h-[180px] w-full" />
    </section>
  );
}
