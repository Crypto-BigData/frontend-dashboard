import {
  mockImpactTable,
  mockNewsMarkers,
  mockPriceImpact,
  mockSentimentCorrelation,
} from '../mocks/newsImpact.mock';
import type { ImpactTableRow, NewsMarker, PriceImpact, SentimentCorrelation } from '../types/newsImpact';
import { apiGet, USE_MOCK } from './apiClient';

type NewsImpactQuery = {
  ticker: string;
  fromTime?: number;
  toTime?: number;
  limit?: number;
};

type ListResponse<T> = { data: T[] } | T[];

function unwrapList<T>(response: ListResponse<T>): T[] {
  return Array.isArray(response) ? response : response.data;
}

function splitKeywords(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeMarker(marker: NewsMarker): NewsMarker {
  return {
    newsId: marker.newsId,
    title: marker.title ?? '-',
    sourceName: marker.sourceName ?? '-',
    sentiment: marker.sentiment ?? 'neutral',
    keywords: marker.keywords ?? '',
    keywordList: marker.keywordList?.length ? marker.keywordList : splitKeywords(marker.keywords),
    publishedOn: marker.publishedOn,
    priceAtPublish: marker.priceAtPublish ?? null,
    ticker: marker.ticker ?? '-',
  };
}

function normalizeImpactTableRow(row: ImpactTableRow): ImpactTableRow {
  return {
    newsId: row.newsId,
    title: row.title ?? '-',
    sentiment: row.sentiment ?? 'neutral',
    ticker: row.ticker ?? '-',
    publishedOn: row.publishedOn,
    changePercent15m: row.changePercent15m ?? null,
    changePercent1h: row.changePercent1h ?? null,
  };
}

function normalizePriceImpact(impact: PriceImpact): PriceImpact {
  return {
    ...impact,
    title: impact.title ?? '-',
    sentiment: impact.sentiment ?? 'neutral',
    priceAtPublish: impact.priceAtPublish ?? null,
    impact: {
      after5m: impact.impact?.after5m ?? null,
      after15m: impact.impact?.after15m ?? null,
      after1h: impact.impact?.after1h ?? null,
      after4h: impact.impact?.after4h ?? null,
    },
  };
}

export const newsImpactApi = {
  async getMarkers(query: NewsImpactQuery): Promise<NewsMarker[]> {
    if (USE_MOCK) return mockNewsMarkers.slice(0, query.limit ?? mockNewsMarkers.length).map(normalizeMarker);

    return unwrapList(await apiGet<ListResponse<NewsMarker>>('/news-impact/markers', query)).map(normalizeMarker);
  },

  async getPriceImpact(newsId: number, ticker: string): Promise<PriceImpact> {
    if (USE_MOCK) {
      const marker = mockNewsMarkers.find((item) => item.newsId === newsId);
      return normalizePriceImpact({
        ...mockPriceImpact,
        newsId,
        ticker,
        title: marker?.title ?? mockPriceImpact.title,
        sentiment: marker?.sentiment ?? mockPriceImpact.sentiment,
        publishedOn: marker?.publishedOn ?? mockPriceImpact.publishedOn,
        priceAtPublish: marker?.priceAtPublish ?? mockPriceImpact.priceAtPublish,
      });
    }

    return normalizePriceImpact(await apiGet<PriceImpact>(`/news-impact/price-impact/${newsId}`, { ticker }));
  },

  async getImpactTable(query: NewsImpactQuery): Promise<ImpactTableRow[]> {
    if (USE_MOCK) return mockImpactTable.slice(0, query.limit ?? mockImpactTable.length).map(normalizeImpactTableRow);

    return unwrapList(await apiGet<ListResponse<ImpactTableRow>>('/news-impact/impact-table', query)).map(normalizeImpactTableRow);
  },

  async getSentimentCorrelation(query: Omit<NewsImpactQuery, 'limit'>): Promise<SentimentCorrelation[]> {
    if (USE_MOCK) return mockSentimentCorrelation;

    return unwrapList(
      await apiGet<ListResponse<SentimentCorrelation>>('/news-impact/sentiment-correlation', query),
    );
  },
};
