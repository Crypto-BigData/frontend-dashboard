export type Sentiment = 'positive' | 'neutral' | 'negative' | string;

export type RawNewsItem = {
  id: number | string;
  type?: string | null;
  guid?: string | null;
  url?: string | null;
  publishedOn?: number | null;
  imageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  authors?: string | null;
  sourceId?: string | null;
  sourceName?: string | null;
  keywords?: string | null;
  categories?: string | null;
  sentiment?: Sentiment | null;
  sentimentScore?: string | number | null;
  rawBody?: string | null;
};

export type NewsItem = RawNewsItem & {
  authorList: string[];
  keywordList: string[];
  categoryList: string[];
};

export type NewsPageResult = {
  data: NewsItem[];
  total: number;
  totalPages?: number;
};

export type NewsQuery = {
  page: number;
  pageSize: number;
  fromTime?: number;
  toTime?: number;
  search?: string;
  sentiment?: string;
  category?: string;
  source?: string;
};
