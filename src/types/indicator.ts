export type IndicatorPoint = {
  time: number;
  value: number;
};

export type IndicatorSeries = {
  ma20?: IndicatorPoint[];
  ma50?: IndicatorPoint[];
  ema20?: IndicatorPoint[];
  ema50?: IndicatorPoint[];
  bollingerUpper?: IndicatorPoint[];
  bollingerMiddle?: IndicatorPoint[];
  bollingerLower?: IndicatorPoint[];
  rsi?: IndicatorPoint[];
};

export type IndicatorResponse = IndicatorSeries & {
  ticker: string;
  interval: number;
};

export type RawIndicatorPoint = {
  openTime?: number | string | null;
  time?: number | string | null;
  timestamp?: number | string | null;
  value: string | number | null;
};

export type RawIndicatorResponse = {
  ticker: string;
  interval: number;
  ma20?: RawIndicatorPoint[];
  MA20?: RawIndicatorPoint[];
  ma_20?: RawIndicatorPoint[];
  ma50?: RawIndicatorPoint[];
  MA50?: RawIndicatorPoint[];
  ma_50?: RawIndicatorPoint[];
  ema20?: RawIndicatorPoint[];
  EMA20?: RawIndicatorPoint[];
  ema_20?: RawIndicatorPoint[];
  ema50?: RawIndicatorPoint[];
  EMA50?: RawIndicatorPoint[];
  ema_50?: RawIndicatorPoint[];
  bollingerUpper?: RawIndicatorPoint[];
  bbUpper?: RawIndicatorPoint[];
  upperBand?: RawIndicatorPoint[];
  bollingerMiddle?: RawIndicatorPoint[];
  bbMiddle?: RawIndicatorPoint[];
  middleBand?: RawIndicatorPoint[];
  bollingerLower?: RawIndicatorPoint[];
  bbLower?: RawIndicatorPoint[];
  lowerBand?: RawIndicatorPoint[];
  rsi?: RawIndicatorPoint[];
  bollinger?: any[];
}
