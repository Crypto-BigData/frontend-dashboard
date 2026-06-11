export type IndicatorKey = 'ma20' | 'ma50' | 'bollinger' | 'rsi';

type IndicatorState = Record<IndicatorKey, boolean>;

type Props = {
  value: IndicatorState;
  onChange: (next: IndicatorState) => void;
};

const options: Array<{ key: IndicatorKey; label: string; colorClass: string }> = [
  { key: 'ma20', label: 'MA20', colorClass: 'border-blue-200 bg-blue-50 text-blue-700' },
  { key: 'ma50', label: 'MA50', colorClass: 'border-amber-200 bg-amber-50 text-amber-700' },
  { key: 'bollinger', label: 'Bollinger', colorClass: 'border-slate-200 bg-slate-50 text-slate-700' },
  { key: 'rsi', label: 'RSI', colorClass: 'border-violet-200 bg-violet-50 text-violet-700' },
];

export function IndicatorToggle({ value, onChange }: Props) {
  return (
    <fieldset className="grid gap-2 text-sm font-semibold text-slate-600">
      <legend>Indicators</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.key}
            className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-bold shadow-sm ${option.colorClass}`}
          >
            <input
              checked={value[option.key]}
              className="h-4 w-4 accent-current"
              type="checkbox"
              onChange={(event) => onChange({ ...value, [option.key]: event.target.checked })}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
