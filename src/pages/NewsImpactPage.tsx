import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TickerSelector } from '../components/chart/TickerSelector';
import { CandlestickChart } from '../components/chart/CandlestickChart';
import { NewsImpactMarkerList } from '../components/news-impact/NewsImpactMarkerList';
import { NewsImpactTable } from '../components/news-impact/NewsImpactTable';
import { PriceImpactPanel } from '../components/news-impact/PriceImpactPanel';
import { SentimentCorrelationChart } from '../components/news-impact/SentimentCorrelationChart';
import type { TickerSymbol } from '../constants/chart';
import { marketApi } from '../services/marketApi';
import { newsImpactApi } from '../services/newsImpactApi';
import type { Candle } from '../types/market';
import type { ImpactTableRow, NewsMarker, PriceImpact, SentimentCorrelation } from '../types/newsImpact';

const timeRanges = [
  { label: '24h', value: '24h', durationMs: 24 * 60 * 60 * 1000 },
  { label: '7d', value: '7d', durationMs: 7 * 24 * 60 * 60 * 1000 },
  { label: '30d', value: '30d', durationMs: 30 * 24 * 60 * 60 * 1000 },
  { label: '6m', value: '180d', durationMs: 180 * 24 * 60 * 60 * 1000 },
] as const;

type TimeRangeValue = (typeof timeRanges)[number]['value'];

type Loadable<T> = {
  data: T;
  loading: boolean;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function NewsImpactPage() {
  const [symbol, setSymbol] = useState<TickerSymbol>('BTCUSDT');
  const [range, setRange] = useState<TimeRangeValue>('30d');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<NewsMarker | null>(null);
  const [markersState, setMarkersState] = useState<Loadable<NewsMarker[]>>({ data: [], loading: true });
  const [tableState, setTableState] = useState<Loadable<ImpactTableRow[]>>({ data: [], loading: true });
  const [correlationState, setCorrelationState] = useState<Loadable<SentimentCorrelation[]>>({ data: [], loading: true });
  const [impactState, setImpactState] = useState<Loadable<PriceImpact | null>>({ data: null, loading: false });
  const [marketState, setMarketState] = useState<Loadable<Candle[]>>({ data: [], loading: true });

  useEffect(() => {
    let ignore = false;
    const selectedRange = timeRanges.find((item) => item.value === range) ?? timeRanges[0];
    const toTime = Date.now();
    const fromTime = toTime - selectedRange.durationMs;
    let limit = 50;
    if (range === '7d') limit = 200;
    if (range === '30d') limit = 500;
    if (range === '180d') limit = 2000;

    const query = { ticker: symbol, fromTime, toTime, limit };

    setMarkersState((current) => ({ ...current, loading: true, error: undefined }));
    setTableState((current) => ({ ...current, loading: true, error: undefined }));
    setCorrelationState((current) => ({ ...current, loading: true, error: undefined }));
    setMarketState((current) => ({ ...current, loading: true, error: undefined }));

    let interval = 300000; // 5m default
    if (range === '7d') interval = 900000; // 15m
    if (range === '30d') interval = 3600000; // 1h
    if (range === '180d') interval = 14400000; // 4h

    marketApi
      .getKlines({ ticker: symbol, interval, fromTime, toTime })
      .then((candles) => {
        if (!ignore) setMarketState({ data: candles, loading: false });
      })
      .catch((error) => {
        if (!ignore) setMarketState({ data: [], loading: false, error: getErrorMessage(error) });
      });

    newsImpactApi
      .getMarkers(query)
      .then((markers) => {
        if (ignore) return;
        setMarkersState({ data: markers, loading: false });
        setSelectedMarker((current) => {
          if (current && markers.some((marker) => marker.newsId === current.newsId)) return current;
          return markers[0] ?? null;
        });
      })
      .catch((error) => {
        if (!ignore) setMarkersState({ data: [], loading: false, error: getErrorMessage(error) });
      });

    newsImpactApi
      .getImpactTable(query)
      .then((rows) => {
        if (!ignore) setTableState({ data: rows, loading: false });
      })
      .catch((error) => {
        if (!ignore) setTableState({ data: [], loading: false, error: getErrorMessage(error) });
      });

    newsImpactApi
      .getSentimentCorrelation({ ticker: symbol, fromTime, toTime })
      .then((data) => {
        if (!ignore) setCorrelationState({ data, loading: false });
      })
      .catch((error) => {
        if (!ignore) setCorrelationState({ data: [], loading: false, error: getErrorMessage(error) });
      });

    return () => {
      ignore = true;
    };
  }, [range, refreshKey, symbol]);

  useEffect(() => {
    let ignore = false;

    if (!selectedMarker) {
      setImpactState({ data: null, loading: false });
      return () => {
        ignore = true;
      };
    }

    setImpactState((current) => ({ ...current, loading: true, error: undefined }));
    newsImpactApi
      .getPriceImpact(selectedMarker.newsId, symbol)
      .then((impact) => {
        if (!ignore) setImpactState({ data: impact, loading: false });
      })
      .catch((error) => {
        if (!ignore) setImpactState({ data: null, loading: false, error: getErrorMessage(error) });
      });

    return () => {
      ignore = true;
    };
  }, [selectedMarker, symbol]);

  return (
    <section className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="page-header">
          <p className="eyebrow">News Impact</p>
          <h2>News Impact</h2>
          <p>Analyze how crypto news affects price movements.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[minmax(140px,1fr)_120px_auto] sm:items-end">
            <TickerSelector value={symbol} onChange={setSymbol} />
            <label className="grid gap-2 text-sm font-semibold text-slate-600">
              Range
              <select
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={range}
                onChange={(event) => setRange(event.target.value as TimeRangeValue)}
              >
                {timeRanges.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-950">Price Chart with News Markers</h3>
          {marketState.loading ? (
            <p className="mt-1 text-sm text-slate-500">Loading chart data...</p>
          ) : marketState.error ? (
            <p className="mt-1 text-sm text-red-600">Chart error: {marketState.error}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">
              Visualizing {marketState.data.length} candles with {markersState.data.length} news events.
            </p>
          )}
        </div>
        {!marketState.loading && !marketState.error && marketState.data.length > 0 && (
          <div className="p-4">
            <CandlestickChart candles={marketState.data} news={markersState.data} />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <NewsImpactMarkerList
          markers={markersState.data}
          loading={markersState.loading}
          error={markersState.error}
          selectedId={selectedMarker?.newsId}
          onSelect={setSelectedMarker}
        />
        <PriceImpactPanel
          marker={selectedMarker}
          impact={impactState.data}
          loading={impactState.loading}
          error={impactState.error}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <NewsImpactTable rows={tableState.data} loading={tableState.loading} error={tableState.error} />
        <SentimentCorrelationChart
          data={correlationState.data}
          loading={correlationState.loading}
          error={correlationState.error}
        />
      </div>
    </section>
  );
}
