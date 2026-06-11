import type { ChartInterval } from '../../utils/time';

const intervals: ChartInterval[] = ['5m', '15m', '1h', '4h', '1d'];

type Props = {
  value: ChartInterval;
  onChange: (interval: ChartInterval) => void;
};

export function IntervalSelector({ value, onChange }: Props) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-600">
      Interval
      <select
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value as ChartInterval)}
      >
        {intervals.map((interval) => (
          <option key={interval} value={interval}>
            {interval}
          </option>
        ))}
      </select>
    </label>
  );
}
