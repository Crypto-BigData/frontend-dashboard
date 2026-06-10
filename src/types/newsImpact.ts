export type NewsMarker = {
  newsId: number;
  title: string;
  sourceName: string;
  sentiment: string;
  keywords: string;
  keywordList: string[];
  publishedOn: number;
  priceAtPublish: string | null;
  ticker: string;
};

export type PriceImpactWindow = {
  price: string | null;
  changePercent: string | number | null;
};

export type PriceImpact = {
  newsId: number;
  title: string;
  sentiment: string;
  publishedOn: number;
  ticker: string;
  priceAtPublish: string | null;
  impact: {
    after5m: PriceImpactWindow | null;
    after15m: PriceImpactWindow | null;
    after1h: PriceImpactWindow | null;
    after4h: PriceImpactWindow | null;
  };
};

export type ImpactTableRow = {
  newsId: number;
  title: string;
  sentiment: string;
  ticker: string;
  publishedOn: number;
  changePercent15m: string | number | null;
  changePercent1h: string | number | null;
};

export type SentimentCorrelation = {
  sentiment: string;
  newsCount: number;
  avgChangePercent15m: string | number | null;
  avgChangePercent1h: string | number | null;
  avgChangePercent4h: string | number | null;
};
