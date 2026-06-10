import { mockNews } from '../mocks/news.mock';
import type { NewsItem, NewsPageResult, NewsQuery, RawNewsItem } from '../types/news';
import { apiGet, USE_MOCK } from './apiClient';

type NewsListResponse = { data: RawNewsItem[] } | RawNewsItem[];
type NewsPaginatedResponse = { data?: RawNewsItem[]; total?: number; totalPages?: number };

function splitCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCategories(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : splitCsv(value);
  } catch {
    return splitCsv(value);
  }
}

function normalizeNews(raw: RawNewsItem): NewsItem {
  return {
    ...raw,
    title: raw.title ?? '-',
    subtitle: raw.subtitle ?? '',
    sourceName: raw.sourceName ?? '-',
    sentiment: raw.sentiment ?? 'neutral',
    rawBody: raw.rawBody ?? '',
    authorList: splitCsv(raw.authors),
    keywordList: splitCsv(raw.keywords),
    categoryList: parseCategories(raw.categories),
  };
}

function unwrapList(response: NewsListResponse): RawNewsItem[] {
  return Array.isArray(response) ? response : response.data;
}

export const newsApi = {
  async getNews(query: NewsQuery): Promise<NewsPageResult> {
    if (USE_MOCK) {
      const start = (query.page - 1) * query.pageSize;
      return {
        data: mockNews.slice(start, start + query.pageSize),
        total: mockNews.length,
      };
    }

    const response = await apiGet<NewsPaginatedResponse | RawNewsItem[]>('/news', {
      page: query.page,
      pageSize: query.pageSize,
      fromTime: query.fromTime,
      toTime: query.toTime,
      search: query.search || undefined,
      sentiment: query.sentiment && query.sentiment !== 'All' ? query.sentiment : undefined,
      category: query.category && query.category !== 'All' ? query.category : undefined,
      source: query.source && query.source !== 'All' ? query.source : undefined,
    });

    if (Array.isArray(response)) {
      return {
        data: response.map(normalizeNews),
        total: response.length,
      };
    }

    const rows = response.data ?? [];

    return {
      data: rows.map(normalizeNews),
      total: response.total ?? rows.length,
      totalPages: response.totalPages,
    };
  },

  async getLatestNews(limit = 10, fromTime?: number, toTime?: number): Promise<NewsItem[]> {
    if (USE_MOCK) return mockNews.slice(0, limit);

    const response = await apiGet<NewsListResponse>('/news/limit', {
      limit,
      fromTime,
      toTime,
    });

    return unwrapList(response).map(normalizeNews);
  },
};
