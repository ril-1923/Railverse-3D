import Sidebar from '@/components/panels/Sidebar';
import BottomBar from '@/components/controls/BottomBar';
import { STATIONS, TRACKS } from '@/data/stations';
import { useStore } from '@/stores/useStore';
import { useNavigate } from 'react-router-dom';
import { Building2, Train, ArrowRight, Hash, GitBranch } from 'lucide-react';
import type { StationInfo } from '@/types';

const TYPE_LABEL: Record<string, string> = {
  central: 'Central Hub',
  mountain: 'Mountain Station',
  industrial: 'Industrial Terminal',
};

const TYPE_GRADIENT: Record<string, string> = {
  central: 'linear-gradient(135deg, #1a3a5a, #2a6b9a)',
  mountain: 'linear-gradient(135deg, #1a3a2a, #3a8a5a)',
  industrial: 'linear-gradient(135deg, #3a2a1a, #9a7a3a)',
};

export default function StationsPage() {
  const selectStation = useStore((s) => s.selectStation);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const navigate = useNavigate();

  const focus = (s: StationInfo) => {
    selectStation(s.id);
    setCameraPreset(
      s.type === 'central' ? 'central-station' : s.type === 'mountain' ? 'mountain-station' : 'industrial-station'
    );
    navigate('/');
  };

  return (
    <div className="rv-page">
      <Sidebar />
      <div className="rv-page-content">
        <div className="rv-page-header">
          <h1>Stations</h1>
          <p>Three distinct railway stations across the RailVerse 3D network.</p>
        </div>

        <div className="rv-stations-grid">
          {STATIONS.map((s) => {
            const connected = TRACKS.filter((t) => s.connectedTrackIds.includes(t.id));
            return (
              <div key={s.id} className="rv-station-card" style={{ background: TYPE_GRADIENT[s.type] }}>
                <div className="rv-station-card-glow" />
                <div className="rv-station-card-icon">
                  {s.type === 'central' ? <Train size={28} /> : <Building2 size={28} />}
                </div>
                <h2>{s.name}</h2>
                <span className="rv-station-type-badge">{TYPE_LABEL[s.type]}</span>
                <p className="rv-station-desc">{s.description}</p>

                <div className="rv-station-stats">
                  <div className="rv-station-stat">
                    <span className="rv-stat-value">{s.platformCount}</span>
                    <span className="rv-stat-label">Platforms</span>
                  </div>
                  <div className="rv-station-stat">
                    <span className="rv-stat-value">{connected.length}</span>
                    <span className="rv-stat-label">Tracks</span>
                  </div>
                  <div className="rv-station-stat">
                    <span className="rv-stat-value">
                      <Hash size={12} />{s.id}
                    </span>
                    <span className="rv-stat-label">ID</span>
                  </div>
                </div>

                <div className="rv-station-connected">
                  <span className="rv-info-sublabel"><GitBranch size={12} /> Connected Tracks</span>
                  {connected.map((t) => (
                    <div key={t.id} className="rv-connected-track">
                      <span>{t.id}</span>
                      <span className="rv-connected-type">{t.type}</span>
                    </div>
                  ))}
                </div>

                <button className="rv-station-focus-btn" onClick={() => focus(s)}>
                  Focus in 3D World <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
