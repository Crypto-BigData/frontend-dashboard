export type RawKline = {
  ticker: string;
  openTime: number;
  open: string | number | null;
  high: string | number | null;
  low: string | number | null;
  close: string | number | null;
  volume: string | number | null;
  closeTime: number;
  quoteAssetVolume: string;
  numOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
};

export type Candle = {
  ticker: string;
  time: number;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type KlineQuery = {
  ticker: string;
  interval: number;
  fromTime?: number;
  toTime?: number;
};
