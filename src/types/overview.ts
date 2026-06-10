export type MarketSummary = {
  btcPrice: string;
  btcChange24h: string;
  ethPrice: string;
  ethChange24h: string;
  generalSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

export type TopMover = {
  ticker: string;
  lastPrice: string;
  priceChangePercent24h: string;
  type: 'gainer' | 'loser' | string;
};

export type VolumeSpike = {
  ticker: string;
  lastVolume24h: string;
  averageVolume7d: string;
  spikeRatio: string;
};
