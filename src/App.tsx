import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from '@/components/layout/TopNav';
import OverviewPage from '@/pages/OverviewPage';
import NetworkPage from '@/pages/NetworkPage';
import StationsPage from '@/pages/StationsPage';
import InfrastructurePage from '@/pages/InfrastructurePage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="rv-app">
        <TopNav />
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
