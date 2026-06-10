import { Activity, BarChart3, Bot, Newspaper, TrendingUp } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Overview', to: '/overview', icon: TrendingUp },
  { label: 'Chart', to: '/chart', icon: BarChart3 },
  { label: 'News', to: '/news', icon: Newspaper },
  { label: 'News Impact', to: '/news-impact', icon: Activity },
  { label: 'Chatbot', to: '/chatbot', icon: Bot },
];

export function DashboardLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Crypto BigData</p>
          <h1>Intelligence Dashboard</h1>
        </div>
        <nav className="nav-tabs" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
