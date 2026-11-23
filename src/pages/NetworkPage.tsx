import Sidebar from '@/components/panels/Sidebar';
import BottomBar from '@/components/controls/BottomBar';
import RailwayMap from '@/components/panels/RailwayMap';
import { STATIONS, TRACKS } from '@/data/stations';
import { useStore } from '@/stores/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GitBranch, Building2 } from 'lucide-react';

export default function NetworkPage() {
  const selectStation = useStore((s) => s.selectStation);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const navigate = useNavigate();

  const focusStation = (id: string, type: string) => {
    selectStation(id);
    setCameraPreset(
      type === 'central' ? 'central-station' : type === 'mountain' ? 'mountain-station' : 'industrial-station'
    );
    navigate('/');
  };

  return (
    <div className="rv-page rv-network">
      <Sidebar />
      <div className="rv-page-content">
        <div className="rv-page-header">
          <h1>Railway Network</h1>
          <p>Interactive map of the RailVerse 3D network — stations, tracks and connections.</p>
        </div>

        <div className="rv-network-grid">
          <div className="rv-card rv-network-map-card">
            <RailwayMap />
            {!useStore.getState().mapOpen && (
              <div className="rv-map-placeholder">
                <button className="rv-primary-btn" onClick={() => useStore.getState().toggleMap()}>
                  Open Interactive Map
                </button>
              </div>
            )}
          </div>

          <div className="rv-card">
            <h2 className="rv-card-title"><Building2 size={18} /> Stations</h2>
            <div className="rv-network-list">
              {STATIONS.map((s) => (
                <button key={s.id} className="rv-network-item" onClick={() => focusStation(s.id, s.type)}>
                  <div>
                    <span className="rv-network-item-name">{s.name}</span>
                    <span className="rv-network-item-sub">{s.platformCount} platforms · {s.type}</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="rv-card">
            <h2 className="rv-card-title"><GitBranch size={18} /> Tracks</h2>
            <div className="rv-network-list">
              {TRACKS.map((t) => {
                const s = STATIONS.find((st) => st.id === t.startStationId);
                const e = STATIONS.find((st) => st.id === t.endStationId);
                return (
                  <div key={t.id} className="rv-network-item static">
                    <div>
                      <span className="rv-network-item-name">{t.id}</span>
                      <span className="rv-network-item-sub">
                        {t.type} · {t.length}m · {s?.name ?? '—'} → {e?.name ?? '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
