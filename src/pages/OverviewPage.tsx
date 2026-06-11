import { useEffect, useState } from 'react';
import { LatestNews } from '../components/overview/LatestNews';
import { LatestSignals } from '../components/overview/LatestSignals';
import { MarketSummaryCards } from '../components/overview/MarketSummaryCards';
import { TopMoversTable } from '../components/overview/TopMoversTable';
import { VolumeSpikeList } from '../components/overview/VolumeSpikeList';
import { NewsDetailModal } from '../components/news/NewsDetailModal';
import { newsApi } from '../services/newsApi';
import { overviewApi } from '../services/overviewApi';
import { signalsApi } from '../services/signalsApi';
import type { NewsItem } from '../types/news';
import type { MarketSummary, TopMover, VolumeSpike } from '../types/overview';
import type { Signal } from '../types/signal';

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error?: string;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function OverviewPage() {
  const [summary, setSummary] = useState<AsyncState<MarketSummary | null>>({ data: null, loading: true });
  const [topMovers, setTopMovers] = useState<AsyncState<TopMover[]>>({ data: [], loading: true });
  const [volumeSpikes, setVolumeSpikes] = useState<AsyncState<VolumeSpike[]>>({ data: [], loading: true });
  const [signals, setSignals] = useState<AsyncState<Signal[]>>({ data: [], loading: true });
  const [news, setNews] = useState<AsyncState<NewsItem[]>>({ data: [], loading: true });
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      setSummary((state) => ({ ...state, loading: true, error: undefined }));
      setTopMovers((state) => ({ ...state, loading: true, error: undefined }));
      setVolumeSpikes((state) => ({ ...state, loading: true, error: undefined }));
      setSignals((state) => ({ ...state, loading: true, error: undefined }));
      setNews((state) => ({ ...state, loading: true, error: undefined }));

      const [summaryResult, moversResult, spikesResult, signalsResult, newsResult] = await Promise.allSettled([
        overviewApi.getMarketSummary(),
        overviewApi.getTopMovers(),
        overviewApi.getVolumeSpikes(2, 10),
        signalsApi.getActiveSignals(10),
        newsApi.getLatestNews(10),
      ]);

      if (!mounted) return;

      setSummary(
        summaryResult.status === 'fulfilled'
          ? { data: summaryResult.value, loading: false }
          : { data: null, loading: false, error: errorMessage(summaryResult.reason) },
      );
      setTopMovers(
        moversResult.status === 'fulfilled'
          ? { data: moversResult.value, loading: false }
          : { data: [], loading: false, error: errorMessage(moversResult.reason) },
      );
      setVolumeSpikes(
        spikesResult.status === 'fulfilled'
          ? { data: spikesResult.value, loading: false }
          : { data: [], loading: false, error: errorMessage(spikesResult.reason) },
      );
      setSignals(
        signalsResult.status === 'fulfilled'
          ? { data: signalsResult.value, loading: false }
          : { data: [], loading: false, error: errorMessage(signalsResult.reason) },
      );
      setNews(
        newsResult.status === 'fulfilled'
          ? { data: newsResult.value, loading: false }
          : { data: [], loading: false, error: errorMessage(newsResult.reason) },
      );
    }

    void loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <p className="eyebrow">Overview</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Market Overview</h2>
        <p className="mt-2 text-sm text-slate-500">BTC/ETH snapshot, movers, volume spikes, signals, and latest news.</p>
      </section>

      <MarketSummaryCards
        summary={summary.data}
        signals={signals.data}
        loading={summary.loading || signals.loading}
        error={summary.error}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <TopMoversTable movers={topMovers.data} loading={topMovers.loading} error={topMovers.error} />
        <VolumeSpikeList spikes={volumeSpikes.data} loading={volumeSpikes.loading} error={volumeSpikes.error} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LatestSignals signals={signals.data} loading={signals.loading} error={signals.error} />
        <LatestNews news={news.data} loading={news.loading} error={news.error} onSelect={setSelectedNews} />
      </div>

      <NewsDetailModal item={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
}
