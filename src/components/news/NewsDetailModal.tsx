import { X } from 'lucide-react';
import type { NewsItem } from '../../types/news';
import { formatTimestampDate, sentimentLabel } from '../../utils/format';

type Props = {
  item: NewsItem | null;
  onClose: () => void;
};

export function NewsDetailModal({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
      <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {item.sourceName ?? '-'} - {formatTimestampDate(item.publishedOn)}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{item.title ?? '-'}</h2>
          </div>
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            type="button"
            onClick={onClose}
            aria-label="Close news detail"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 p-5">
          {item.subtitle ? <p className="text-base text-slate-600">{item.subtitle}</p> : null}

          <dl className="grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">Sentiment</dt>
              <dd className="mt-1 font-semibold text-slate-900">{sentimentLabel(item.sentiment)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">Sentiment Score</dt>
              <dd className="mt-1 font-semibold text-slate-900">{item.sentimentScore ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">Authors</dt>
              <dd className="mt-1 font-semibold text-slate-900">{item.authorList.length ? item.authorList.join(', ') : '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">Type</dt>
              <dd className="mt-1 font-semibold text-slate-900">{item.type ?? '-'}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-bold text-slate-950">Categories</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.categoryList.length ? (
                item.categoryList.map((category) => (
                  <span key={category} className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">-</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950">Keywords</h3>
            <p className="mt-2 text-sm text-slate-600">{item.keywordList.length ? item.keywordList.join(', ') : '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950">Content</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {item.rawBody || 'No content available'}
            </p>
          </div>

          {item.url ? (
            <a
              className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              Open original article
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}
