import type { NewsItem } from '../../types/news';
import { NewsCard } from './NewsCard';

type Props = {
  news: NewsItem[];
  loading: boolean;
  error?: string;
  onSelect: (item: NewsItem) => void;
};

export function NewsList({ news, loading, error, onSelect }: Props) {
  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading news...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">News unavailable: {error}</div>;
  }

  if (news.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-500">No news found.</div>;
  }

  return (
    <div className="grid gap-4">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
