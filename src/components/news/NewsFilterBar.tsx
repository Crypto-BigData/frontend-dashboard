export type NewsFilters = {
  search: string;
  sentiment: string;
  category: string;
  source: string;
};

type Props = {
  value: NewsFilters;
  onChange: (next: NewsFilters) => void;
};

const sentiments = ['All', 'Positive', 'Neutral', 'Negative'];
const categories = ['All', 'Cryptocurrency', 'Market', 'Trading', 'Business', 'Macroeconomics', 'Regulation', 'Exchange', 'Blockchain', 'Altcoin'];
const sources = ['All', 'Bitcoin World', 'CoinTurk News', 'Coin Edition', 'AMB Crypto', 'Cryptopolitan', 'CoinOtag', 'Bitcoin.com', 'Cointelegraph', 'CoinDesk', 'NewsBTC'];

function updateFilter(value: NewsFilters, key: keyof NewsFilters, nextValue: string): NewsFilters {
  return { ...value, [key]: nextValue };
}

export function NewsFilterBar({ value, onChange }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <label className="grid gap-2 text-sm font-semibold text-slate-600">
          Search
          <input
            className="h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search title, content, source..."
            type="search"
            value={value.search}
            onChange={(event) => onChange(updateFilter(value, 'search', event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-600">
          Sentiment
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={value.sentiment}
            onChange={(event) => onChange(updateFilter(value, 'sentiment', event.target.value))}
          >
            {sentiments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-600">
          Category
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={value.category}
            onChange={(event) => onChange(updateFilter(value, 'category', event.target.value))}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-600">
          Source
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={value.source}
            onChange={(event) => onChange(updateFilter(value, 'source', event.target.value))}
          >
            {sources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
