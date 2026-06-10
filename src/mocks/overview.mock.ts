import type { MarketSummary, TopMover, VolumeSpike } from '../types/overview';

export const mockMarketSummary: MarketSummary = {
  btcPrice: '65432.12',
  btcChange24h: '2.5',
  ethPrice: '3456.78',
  ethChange24h: '-1.2',
  generalSentiment: { positive: 48, neutral: 34, negative: 18 },
};

export const mockTopMovers: TopMover[] = [
  { ticker: 'SOLUSDT', lastPrice: '145.20', priceChangePercent24h: '15.4', type: 'gainer' },
  { ticker: 'BNBUSDT', lastPrice: '620.11', priceChangePercent24h: '8.2', type: 'gainer' },
  { ticker: 'DOGEUSDT', lastPrice: '0.18', priceChangePercent24h: '6.4', type: 'gainer' },
  { ticker: 'ADAUSDT', lastPrice: '0.46', priceChangePercent24h: '-5.1', type: 'loser' },
  { ticker: 'XRPUSDT', lastPrice: '0.61', priceChangePercent24h: '-3.9', type: 'loser' },
];

export const mockVolumeSpikes: VolumeSpike[] = [
  { ticker: 'DOGEUSDT', lastVolume24h: '1500000.00', averageVolume7d: '500000.00', spikeRatio: '3.0' },
  { ticker: 'SOLUSDT', lastVolume24h: '890000.00', averageVolume7d: '360000.00', spikeRatio: '2.47' },
  { ticker: 'BTCUSDT', lastVolume24h: '2400000.00', averageVolume7d: '1300000.00', spikeRatio: '1.85' },
];
