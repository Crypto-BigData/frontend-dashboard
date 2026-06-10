import type { NewsItem } from '../types/news';

const nowSeconds = Math.floor(Date.now() / 1000);

export const mockNews: NewsItem[] = Array.from({ length: 36 }, (_, index) => {
  const sentiment = index % 3 === 0 ? 'positive' : index % 3 === 1 ? 'neutral' : 'negative';
  const categories = index % 2 === 0 ? ['Bitcoin', 'Markets'] : ['Ethereum', 'Regulation'];

  return {
    id: index + 1,
    type: 'article',
    guid: `mock-${index + 1}`,
    url: 'https://example.com/news',
    publishedOn: nowSeconds - index * 3600,
    imageUrl: '',
    title: index % 2 === 0 ? 'Bitcoin holds key level as volume expands' : 'Ethereum traders watch liquidity shift',
    subtitle: 'Market desk update for crypto analysts.',
    authors: 'Market Desk',
    sourceId: 'mock',
    sourceName: index % 2 === 0 ? 'CoinDesk' : 'CryptoPanic',
    keywords: categories.join(', '),
    categories: JSON.stringify(categories),
    sentiment,
    rawBody: 'Mock article body with market context, sentiment notes, and price action summary.',
    authorList: ['Market Desk'],
    keywordList: categories,
    categoryList: categories,
  };
});
