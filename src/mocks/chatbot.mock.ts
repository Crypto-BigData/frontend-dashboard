import type { ChatbotReply } from '../types/chatbot';

function inferMockAnswer(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('volume')) {
    return 'Trong dữ liệu demo, volume spike nổi bật nhất là BTCUSDT với mức tăng khối lượng bất thường so với trung bình gần đây. Bạn nên đối chiếu thêm chart volume trước khi kết luận tín hiệu giao dịch.';
  }

  if (normalized.includes('eth') && (normalized.includes('tin') || normalized.includes('news'))) {
    return 'Trong dữ liệu demo, ETH có một số tin tiêu cực liên quan đến market sentiment. Tuy nhiên đây là mock response nên chỉ dùng để kiểm tra giao diện chatbot.';
  }

  if (normalized.includes('bitcoin') || normalized.includes('btc')) {
    return 'BTC đang có tín hiệu cần theo dõi trong dữ liệu demo: xu hướng giá, volume và sentiment đều nên được xem cùng nhau. Tôi không dự đoán giá tương lai, chỉ tóm tắt dữ liệu quan sát được.';
  }

  return 'Tóm tắt demo: thị trường crypto đang có biến động, một số ticker có volume spike và sentiment tin tức phân hóa. Hãy dùng Overview, Chart và News Impact để kiểm tra số liệu chi tiết.';
}

export function getMockChatbotReply(message: string): ChatbotReply {
  return {
    answer: inferMockAnswer(message),
    metadata: {
      sources: ['Mock market summary', 'Mock news sentiment', 'Mock signals'],
      toolCalls: ['getKlines', 'getNewsLimit'],
    },
  };
}
