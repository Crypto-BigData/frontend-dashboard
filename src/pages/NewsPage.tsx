import { useEffect, useMemo, useState } from 'react';
import { NewsDetailModal } from '../components/news/NewsDetailModal';
import { NewsFilterBar, type NewsFilters } from '../components/news/NewsFilterBar';
import { NewsList } from '../components/news/NewsList';
import { NewsPagination } from '../components/news/NewsPagination';
import { newsApi } from '../services/newsApi';
import type { NewsItem } from '../types/news';

type NewsState = {
  data: NewsItem[];
  total: number;
  totalPages?: number;
  loading: boolean;
  error?: string;
};

const pageSize = 20;
const defaultFilters: NewsFilters = {
  search: '',
  sentiment: 'All',
  category: 'All',
  source: 'All',
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Client-side filtering removed

export function NewsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [state, setState] = useState<NewsState>({ data: [], total: 0, loading: true });

  useEffect(() => {
    let mounted = true;

    async function loadNews() {
      setState((current) => ({ ...current, loading: true, error: undefined }));

      try {
        const result = await newsApi.getNews({ 
          page, 
          pageSize,
          search: filters.search,
          sentiment: filters.sentiment,
          category: filters.category,
          source: filters.source
        });
        if (!mounted) return;
        setState({
          data: result.data,
          total: result.total,
          totalPages: result.totalPages,
          loading: false,
        });
      } catch (error) {
        if (!mounted) return;
        setState({ data: [], total: 0, loading: false, error: errorMessage(error) });
      }
    }

    void loadNews();

    return () => {
      mounted = false;
    };
  }, [page, filters]);

  // filteredNews is now just state.data since filtering is done by backend

  return (
    <div className="space-y-6">
      <section>
        <p className="eyebrow">News</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">News</h2>
        <p className="mt-2 text-sm text-slate-500">Latest crypto news and sentiment.</p>
      </section>

      <NewsFilterBar
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1); // Reset page on filter change
        }}
      />

      <NewsPagination
        page={page}
        pageSize={pageSize}
        total={state.total}
        totalPages={state.totalPages}
        currentCount={state.data.length}
        onPageChange={setPage}
      />

      <NewsList news={state.data} loading={state.loading} error={state.error} onSelect={setSelectedNews} />

      <NewsDetailModal item={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
}
