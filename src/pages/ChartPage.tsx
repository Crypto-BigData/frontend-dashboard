import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CandlestickChart } from '../components/chart/CandlestickChart';
import { IndicatorToggle, type IndicatorKey } from '../components/chart/IndicatorToggle';
import { IntervalSelector } from '../components/chart/IntervalSelector';
import { RsiPanel } from '../components/chart/RsiPanel';
import { TickerSelector } from '../components/chart/TickerSelector';
import { VolumeChart } from '../components/chart/VolumeChart';
import { type TickerSymbol, tickers } from '../constants/chart';
import { indicatorsApi } from '../services/indicatorsApi';
import { marketApi } from '../services/marketApi';
import { signalsApi } from '../services/signalsApi';
import type { IndicatorResponse } from '../types/indicator';
import type { Candle } from '../types/market';
import type { Signal } from '../types/signal';
import { formatMsDate } from '../utils/format';
import { type ChartInterval, intervalMap } from '../utils/time';

type ChartState = {
  candles: Candle[];
  loading: boolean;
  error?: string;
  serverTime?: number;
};

type IndicatorState = {
  data: IndicatorResponse | null;
  loading: boolean;
  error?: string;
};

type SignalsState = {
  data: Signal[];
  loading: boolean;
  error?: string;
};

const intervalOptions: ChartInterval[] = ['5m', '15m', '1h', '4h', '1d'];
const defaultIndicators: Record<IndicatorKey, boolean> = {
  ma20: true,
  ma50: true,
  bollinger: false,
  rsi: true,
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function getTickerParam(value: string | null): TickerSymbol {
  return tickers.includes(value as TickerSymbol) ? (value as TickerSymbol) : 'BTCUSDT';
}

function getIntervalParam(value: string | null): ChartInterval {
  return intervalOptions.includes(value as ChartInterval) ? (value as ChartInterval) : '5m';
}

export function ChartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<ChartState>({ candles: [], loading: true });
  const [indicatorToggles, setIndicatorToggles] = useState(defaultIndicators);
  const [indicators, setIndicators] = useState<IndicatorState>({ data: null, loading: true });
  const [showSignals, setShowSignals] = useState(true);
  const [signals, setSignals] = useState<SignalsState>({ data: [], loading: false });

  const symbol = getTickerParam(searchParams.get('symbol'));
  const interval = getIntervalParam(searchParams.get('interval'));
  const intervalMs = intervalMap[interval];

  const rangeLabel = useMemo(() => {
    if (state.candles.length === 0) return 'Last 24 hours';
    const first = state.candles[0];
    const last = state.candles[state.candles.length - 1];
    return `${formatMsDate(first.openTime)} - ${formatMsDate(last.closeTime)}`;
  }, [state.candles]);

  const activeMaLabels = [
    indicatorToggles.ma20 ? 'MA20' : null,
    indicatorToggles.ma50 ? 'MA50' : null,
    indicatorToggles.bollinger ? 'Bollinger Bands' : null,
  ].filter(Boolean);

  const missingAdvancedIndicators = Boolean(
    indicators.data &&
      (indicatorToggles.bollinger &&
        (!indicators.data.bollingerUpper?.length ||
          !indicators.data.bollingerMiddle?.length ||
          !indicators.data.bollingerLower?.length)),
  );

  const visibleSignals = useMemo(
    () => signals.data.filter((signal) => signal.ticker === symbol),
    [signals.data, symbol],
  );

  const handleSymbolChange = useCallback(
    (nextSymbol: TickerSymbol) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set('symbol', nextSymbol);
        next.set('interval', getIntervalParam(current.get('interval')));
        return next;
      });
      setState({ candles: [], loading: true });
      setIndicators({ data: null, loading: true });
      if (showSignals) setSignals((current) => ({ ...current, loading: true, error: undefined }));
    },
    [setSearchParams, showSignals],
  );

  const handleIntervalChange = useCallback(
    (nextInterval: ChartInterval) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set('symbol', getTickerParam(current.get('symbol')));
        next.set('interval', nextInterval);
        return next;
      });
      setState({ candles: [], loading: true });
      setIndicators({ data: null, loading: true });
      if (showSignals) setSignals((current) => ({ ...current, loading: true, error: undefined }));
    },
    [setSearchParams, showSignals],
  );

  function handleRefresh() {
    setState({ candles: [], loading: true });
    setIndicators({ data: null, loading: true });
    if (showSignals) setSignals((current) => ({ ...current, loading: true, error: undefined }));
    setRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    let mounted = true;

    async function loadChart() {
      setState((current) => ({ ...current, loading: true, error: undefined }));
      setIndicators((current) => ({ ...current, loading: true, error: undefined }));

      const toTime = Date.now();
      let fromTime = toTime - 180 * 24 * 60 * 60 * 1000; // default 6 months for 4h+
      
      // Optimize payload: limit candle count to ~1000-2000 based on interval
      if (intervalMs === 300000) { // 5m -> 7 days (2016 candles)
        fromTime = toTime - 7 * 24 * 60 * 60 * 1000;
      } else if (intervalMs === 900000) { // 15m -> 14 days (1344 candles)
        fromTime = toTime - 14 * 24 * 60 * 60 * 1000;
      } else if (intervalMs === 3600000) { // 1h -> 90 days (2160 candles)
        fromTime = toTime - 90 * 24 * 60 * 60 * 1000;
      }

      const [serverTimeResult, candlesResult, indicatorsResult] = await Promise.allSettled([
        marketApi.getServerTime().catch(() => undefined),
        marketApi.getKlines({
          ticker: symbol,
          interval: intervalMs,
          fromTime,
          toTime,
        }),
        indicatorsApi.getIndicators({
          ticker: symbol,
          interval: intervalMs,
          fromTime,
          toTime,
          indicators: 'ma,rsi,ema,bb',
        }),
      ]);

      if (!mounted) return;

      if (candlesResult.status === 'fulfilled') {
        setState({
          candles: candlesResult.value,
          loading: false,
          serverTime: serverTimeResult.status === 'fulfilled' ? serverTimeResult.value : undefined,
        });
      } else {
        setState({ candles: [], loading: false, error: errorMessage(candlesResult.reason) });
      }

      if (indicatorsResult.status === 'fulfilled') {
        setIndicators({ data: indicatorsResult.value, loading: false });
      } else {
        setIndicators({ data: null, loading: false, error: errorMessage(indicatorsResult.reason) });
      }
    }

    void loadChart();

    return () => {
      mounted = false;
    };
  }, [symbol, intervalMs, refreshKey]);

  useEffect(() => {
    let mounted = true;

    if (!showSignals) {
      setSignals({ data: [], loading: false });
      return () => {
        mounted = false;
      };
    }

    setSignals((current) => ({ ...current, loading: true, error: undefined }));

    signalsApi
      .getActiveSignals(50, symbol)
      .then((data) => {
        if (mounted) setSignals({ data, loading: false });
      })
      .catch((error) => {
        if (mounted) setSignals({ data: [], loading: false, error: errorMessage(error) });
      });

    return () => {
      mounted = false;
    };
  }, [refreshKey, showSignals, symbol]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Chart</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Market Chart</h2>
          <p className="mt-2 text-sm text-slate-500">Candlestick and volume analysis.</p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
          <TickerSelector value={symbol} onChange={handleSymbolChange} />
          <IntervalSelector value={interval} onChange={handleIntervalChange} />
          <IndicatorToggle value={indicatorToggles} onChange={setIndicatorToggles} />
          <label className="grid gap-2 text-sm font-semibold text-slate-600">
            Signals
            <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm">
              <input
                checked={showSignals}
                className="h-4 w-4 accent-blue-600"
                type="checkbox"
                onChange={(event) => setShowSignals(event.target.checked)}
              />
              Show Signals
            </span>
          </label>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            type="button"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {indicators.loading ? (
              <p className="mt-1 text-xs text-slate-400">Loading indicators...</p>
            ) : indicators.error ? (
              <p className="mt-1 text-xs text-amber-600">Indicators unavailable: {indicators.error}</p>
            ) : indicators.data &&
              (indicators.data.ma20?.length || indicators.data.ma50?.length || indicators.data.rsi?.length) ? (
                <p className="mt-1 text-xs text-slate-400">
                Indicators: MA20 {indicators.data.ma20?.length ?? 0}, MA50 {indicators.data.ma50?.length ?? 0}, BB{' '}
                {indicators.data.bollingerUpper?.length ?? 0}, RSI {indicators.data.rsi?.length ?? 0}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">No indicator data for this range.</p>
            )}
            {missingAdvancedIndicators ? (
              <p className="mt-1 text-xs text-amber-600">Some indicators are not available from API yet.</p>
            ) : null}
            {showSignals ? (
              signals.loading ? (
                <p className="mt-1 text-xs text-slate-400">Loading signals...</p>
              ) : signals.error ? (
                <p className="mt-1 text-xs text-amber-600">Signals unavailable: {signals.error}</p>
              ) : visibleSignals.length > 0 ? (
                <p className="mt-1 text-xs text-slate-400">Signals: {visibleSignals.length} active for {symbol}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">No active signals for {symbol}.</p>
              )
            ) : null}
          </div>
          <p className="text-sm text-slate-500">Server time {state.serverTime ? formatMsDate(state.serverTime) : '-'}</p>
        </div>

        {state.loading ? (
          <div className="p-8 text-sm text-slate-500">Loading market candles...</div>
        ) : state.error ? (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Chart unavailable: {state.error}
          </div>
        ) : state.candles.length === 0 ? (
          <div className="p-8 text-sm text-slate-500">No candle data found for this ticker and interval.</div>
        ) : (
          <div className="space-y-4 p-4">
            <section className="min-w-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <h4 className="text-base font-bold text-slate-950">{symbol} - OHLCV</h4>
                <p className="mt-1 text-sm text-slate-500">{rangeLabel}</p>
                {activeMaLabels.length > 0 ? (
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Indicators: {activeMaLabels.join(', ')}
                  </p>
                ) : null}
              </div>
              <CandlestickChart
                candles={state.candles}
                ma20={indicatorToggles.ma20 ? indicators.data?.ma20 : undefined}
                ma50={indicatorToggles.ma50 ? indicators.data?.ma50 : undefined}
                bollingerUpper={indicatorToggles.bollinger ? indicators.data?.bollingerUpper : undefined}
                bollingerMiddle={indicatorToggles.bollinger ? indicators.data?.bollingerMiddle : undefined}
                bollingerLower={indicatorToggles.bollinger ? indicators.data?.bollingerLower : undefined}
                signals={showSignals ? visibleSignals : undefined}
              />
            </section>
            <VolumeChart candles={state.candles} />
            {indicatorToggles.rsi ? <RsiPanel data={indicators.data?.rsi} /> : null}
          </div>
        )}
      </section>
    </div>
  );
}
