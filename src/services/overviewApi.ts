import { mockMarketSummary, mockTopMovers, mockVolumeSpikes } from '../mocks/overview.mock';
import type { MarketSummary, TopMover, VolumeSpike } from '../types/overview';
import { apiGet, USE_MOCK } from './apiClient';

type ListResponse<T> = { data: T[] } | T[];

function unwrapList<T>(response: ListResponse<T>): T[] {
  return Array.isArray(response) ? response : response.data;
}

export const overviewApi = {
  getMarketSummary(): Promise<MarketSummary> {
    if (USE_MOCK) return Promise.resolve(mockMarketSummary);
    return apiGet<MarketSummary>('/overview/market-summary');
  },

  async getTopMovers(): Promise<TopMover[]> {
    if (USE_MOCK) return mockTopMovers;
    return unwrapList(await apiGet<ListResponse<TopMover>>('/overview/top-movers'));
  },

  async getVolumeSpikes(threshold = 2, limit = 10): Promise<VolumeSpike[]> {
    if (USE_MOCK) return mockVolumeSpikes.slice(0, limit);

    return unwrapList(
      await apiGet<ListResponse<VolumeSpike>>('/overview/volume-spike', {
        threshold,
        limit,
      }),
    );
  },
};
