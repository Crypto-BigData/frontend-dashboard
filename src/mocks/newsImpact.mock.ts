import type { ImpactTableRow, NewsMarker, PriceImpact, SentimentCorrelation } from '../types/newsImpact';

const now = Date.now();
const nowSeconds = Math.floor(now / 1000);

function hoursAgo(hours: number) {
  return nowSeconds - hours * 60 * 60;
}

export const mockNewsMarkers: NewsMarker[] = [
  {
    newsId: 1,
    title: 'Bitcoin ETF flow turns positive',
    sourceName: 'CoinDesk',
    sentiment: 'positive',
    keywords: 'Bitcoin, ETF',
    keywordList: ['Bitcoin', 'ETF'],
    publishedOn: hoursAgo(18),
    priceAtPublish: '64880.20',
    ticker: 'BTCUSDT',
  },
  {
    newsId: 2,
    title: 'Exchange reserves fall again',
    sourceName: 'CryptoPanic',
    sentiment: 'neutral',
    keywords: 'Bitcoin, Exchange',
    keywordList: ['Bitcoin', 'Exchange'],
    publishedOn: hoursAgo(12),
    priceAtPublish: null,
    ticker: 'BTCUSDT',
  },
  {
    newsId: 3,
    title: 'Regulators discuss stablecoin reserve rules',
    sourceName: 'CoinTelegraph',
    sentiment: 'negative',
    keywords: 'Regulation, Stablecoin',
    keywordList: ['Regulation', 'Stablecoin'],
    publishedOn: hoursAgo(9),
    priceAtPublish: '64320.00',
    ticker: 'BTCUSDT',
  },
  {
    newsId: 4,
    title: 'Institutional desk reports higher Bitcoin demand',
    sourceName: 'Decrypt',
    sentiment: 'positive',
    keywords: 'Institutional, Demand',
    keywordList: ['Institutional', 'Demand'],
    publishedOn: hoursAgo(6),
    priceAtPublish: '65110.75',
    ticker: 'BTCUSDT',
  },
  {
    newsId: 5,
    title: 'Macro traders wait for inflation data',
    sourceName: 'CryptoPanic',
    sentiment: 'neutral',
    keywords: 'Macro, CPI',
    keywordList: ['Macro', 'CPI'],
    publishedOn: hoursAgo(3),
    priceAtPublish: '64990.10',
    ticker: 'BTCUSDT',
  },
];

export const mockImpactTable: ImpactTableRow[] = [
  {
    newsId: 1,
    title: 'Bitcoin ETF flow turns positive',
    sentiment: 'positive',
    ticker: 'BTCUSDT',
    publishedOn: hoursAgo(18),
    changePercent15m: '1.24',
    changePercent1h: '2.81',
  },
  {
    newsId: 2,
    title: 'Exchange reserves fall again',
    sentiment: 'neutral',
    ticker: 'BTCUSDT',
    publishedOn: hoursAgo(12),
    changePercent15m: null,
    changePercent1h: '0.44',
  },
  {
    newsId: 3,
    title: 'Regulators discuss stablecoin reserve rules',
    sentiment: 'negative',
    ticker: 'BTCUSDT',
    publishedOn: hoursAgo(9),
    changePercent15m: '-0.72',
    changePercent1h: '-1.38',
  },
  {
    newsId: 4,
    title: 'Institutional desk reports higher Bitcoin demand',
    sentiment: 'positive',
    ticker: 'BTCUSDT',
    publishedOn: hoursAgo(6),
    changePercent15m: '0.48',
    changePercent1h: '1.12',
  },
  {
    newsId: 5,
    title: 'Macro traders wait for inflation data',
    sentiment: 'neutral',
    ticker: 'BTCUSDT',
    publishedOn: hoursAgo(3),
    changePercent15m: null,
    changePercent1h: '-0.10',
  },
];

export const mockSentimentCorrelation: SentimentCorrelation[] = [
  { sentiment: 'positive', newsCount: 24, avgChangePercent15m: '0.82', avgChangePercent1h: '1.67', avgChangePercent4h: '2.41' },
  { sentiment: 'neutral', newsCount: 31, avgChangePercent15m: '0.12', avgChangePercent1h: '0.38', avgChangePercent4h: '0.72' },
  { sentiment: 'negative', newsCount: 18, avgChangePercent15m: '-0.64', avgChangePercent1h: '-1.12', avgChangePercent4h: '-1.86' },
];

export const mockPriceImpact: PriceImpact = {
  newsId: 1,
  title: 'Bitcoin ETF flow turns positive',
  sentiment: 'positive',
  publishedOn: hoursAgo(18),
  ticker: 'BTCUSDT',
  priceAtPublish: '64880.20',
  impact: {
    after5m: { price: '65102.11', changePercent: '0.34' },
    after15m: { price: '65684.04', changePercent: '1.24' },
    after1h: { price: '66703.12', changePercent: '2.81' },
    after4h: null,
  },
};
