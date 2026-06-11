# Crypto BigData Frontend Dashboard

## 1. Giới thiệu

`frontend-dashboard` là React/Vite dashboard cho hệ thống Crypto BigData.

Các page đã có:

- Overview
- Chart
- News
- News Impact
- Chatbot

Frontend gọi backend qua service layer trong `src/services` và dùng API prefix `/api`.

## 2. Tính năng hiện tại

- Overview: market summary, top movers, volume spike, latest signals, latest news
- Chart: OHLCV candlestick chart và volume chart
- Technical indicators: MA20, MA50, RSI, EMA20, EMA50, Bollinger Bands
- Signal Overlay trên chart
- News: list, pagination, filter, detail modal
- News Impact: markers, price impact panel, impact table, sentiment correlation
- Chatbot Page gọi backend chatbot API
- Mock mode và API mode

## 3. Yêu cầu môi trường

- Node.js 20+
- npm
- Docker optional
- Backend API local chạy ở `http://localhost:3000`

## 4. Cấu hình env

Tạo `.env` từ `.env.example`:

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true
```

Giải thích:

- `VITE_API_BASE_URL=/api` để dùng Vite proxy trong dev hoặc Nginx proxy trong Docker.
- `VITE_USE_MOCK=true` để demo UI bằng mock data trong `src/mocks`.
- `VITE_USE_MOCK=false` để gọi backend thật qua `/api`.
- Khi chạy Docker production static build, biến Vite thường được bake tại build time, không phải runtime.
- Không đặt OpenAI key hoặc backend secret trong frontend env.

## 5. Chạy local development

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:5173
```

## 6. Chạy với backend thật local

Backend:

```txt
http://localhost:3000/api
```

Frontend `.env`:

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
```

Chạy frontend:

```bash
npm run dev
```

Trong dev, Vite proxy chuyển `/api` sang backend local.

## 7. Build production

```bash
npm run build
npm run preview
```

## 8. Chạy bằng Docker

Build image:

```bash
docker build -t crypto-frontend-dashboard .
```

Run:

```bash
docker run --rm -p 8080:80 --add-host=host.docker.internal:host-gateway crypto-frontend-dashboard
```

Ví dụ dùng port `8088`:

```bash
docker run --rm -p 8088:80 --add-host=host.docker.internal:host-gateway crypto-frontend-dashboard
```

Mở:

```txt
http://localhost:8080
```

Nginx trong container serve React SPA và fallback route về `index.html`, nên các URL sau chạy trực tiếp:

- `http://localhost:8080/overview`
- `http://localhost:8080/chart`
- `http://localhost:8080/news`
- `http://localhost:8080/news-impact`
- `http://localhost:8080/chatbot`

Nếu dùng backend local trên Windows/Mac, Nginx proxy `/api` sang:

```txt
http://host.docker.internal:3000/api
```

Nếu chạy Docker trên Linux, có thể cần:

```bash
docker run --rm -p 8080:80 --add-host=host.docker.internal:host-gateway crypto-frontend-dashboard
```

## 9. API notes

- Tất cả API đi qua `/api`.
- `fromTime` và `toTime` gửi bằng milliseconds.
- `publishedOn` có thể là seconds hoặc milliseconds; frontend đã xử lý an toàn.
- Price, volume, OHLC có thể là string; frontend parse an toàn trước khi tính toán/vẽ chart.
- News Impact nullable fields fallback `N/A` hoặc `-`.
- Component không gọi API trực tiếp; API đi qua `src/services`.
- Frontend không gọi OpenAI trực tiếp và không chứa API key.

## 10. Mock mode

- Khi `VITE_USE_MOCK=true`, frontend dùng mock data trong `src/mocks`.
- Khi `VITE_USE_MOCK=false`, frontend gọi backend thật qua `/api`.
- Nếu backend thật chưa có news data thì News page có thể empty; đó không phải lỗi frontend.

## 11. Known issues

- Google Translate hoặc extension trình duyệt có thể mutate DOM React và gây lỗi `removeChild`.
- App đã thêm `notranslate` trong `index.html`.
- Nếu vẫn lỗi, hãy test bằng Incognito hoặc tắt extension.

## 12. Scripts

Các script hiện có trong `package.json`:

- `npm run dev`: chạy Vite dev server
- `npm run build`: typecheck và build production
- `npm run lint`: chạy ESLint
- `npm run preview`: preview static production build bằng Vite
