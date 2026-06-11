import { useEffect, useRef } from 'react';
import { type TickerSymbol, tickers } from '../../constants/chart';

type Props = {
  value: string;
  onChange: (ticker: TickerSymbol) => void;
};

export function TickerSelector({ value, onChange }: Props) {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const restoredValue = selectRef.current?.value;
    if (restoredValue && tickers.includes(restoredValue as TickerSymbol) && restoredValue !== value) {
      onChange(restoredValue as TickerSymbol);
    }
  }, [onChange, value]);

  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-600">
      Ticker
      <select
        ref={selectRef}
        autoComplete="off"
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value as TickerSymbol)}
      >
        {tickers.map((ticker) => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>
    </label>
  );
}
