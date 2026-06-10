import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ChartPage } from '../pages/ChartPage';
import { ChatbotPage } from '../pages/ChatbotPage';
import { NewsImpactPage } from '../pages/NewsImpactPage';
import { NewsPage } from '../pages/NewsPage';
import { OverviewPage } from '../pages/OverviewPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news-impact" element={<NewsImpactPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}
