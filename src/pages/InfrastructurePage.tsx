import Sidebar from '@/components/panels/Sidebar';
import BottomBar from '@/components/controls/BottomBar';
import { INFRASTRUCTURE, STATIONS } from '@/data/stations';
import { useStore } from '@/stores/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { InfrastructureType } from '@/types';

const INFRA_ICONS: Record<InfrastructureType, string> = {
  signal: '🚦',
  crossing: '⛔',
  'warning-sign': '⚠',
  pole: '⚡',
  'platform-light': '💡',
  fence: '🚧',
  bridge: '🌉',
  shed: '🏠',
  bench: '🪑',
  display: '📺',
  'water-tower': '🗼',
  equipment: '⚙',
};

export default function InfrastructurePage() {
  const selectInfrastructure = useStore((s) => s.selectInfrastructure);
  const navigate = useNavigate();

  const focus = (id: string) => {
    selectInfrastructure(id);
    navigate('/');
  };

  const grouped = INFRASTRUCTURE.reduce<Record<string, typeof INFRASTRUCTURE>>((acc, item) => {
    const key = item.stationId ?? 'network';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="rv-page">
      <Sidebar />
      <div className="rv-page-content">
        <div className="rv-page-header">
          <h1>Infrastructure</h1>
          <p>Selectable railway infrastructure across the network.</p>
        </div>

        <div className="rv-infra-sections">
          {Object.entries(grouped).map(([key, items]) => {
            const station = STATIONS.find((s) => s.id === key);
            const title = station ? station.name : 'Network-Wide';
            return (
              <div key={key} className="rv-infra-section">
                <h2 className="rv-infra-section-title">{title}</h2>
                <div className="rv-infra-grid">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      className="rv-infra-card"
                      onClick={() => focus(item.id)}
                    >
                      <div className="rv-infra-icon">{INFRA_ICONS[item.type]}</div>
                      <div className="rv-infra-info">
                        <span className="rv-infra-name">{item.name}</span>
                        <span className="rv-infra-type">{item.type}</span>
                        <span className="rv-infra-desc">{item.description}</span>
                      </div>
                      <ArrowRight size={16} className="rv-infra-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
