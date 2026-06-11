export const tickers = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'DOGEUSDT', 'XRPUSDT', 'ADAUSDT'] as const;

export type TickerSymbol = (typeof tickers)[number];
