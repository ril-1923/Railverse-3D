import { useStore } from '@/stores/useStore';
import { STATIONS, TRACKS } from '@/data/stations';
import { X } from 'lucide-react';

export default function RailwayMap() {
  const mapOpen = useStore((s) => s.mapOpen);
  const toggleMap = useStore((s) => s.toggleMap);
  const selectStation = useStore((s) => s.selectStation);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const selectedStationId = useStore((s) => s.selectedStationId);

  if (!mapOpen) return null;

  // Scale world coords (x: -160..170, z: -160..150) to 0..520 viewBox
  const scaleX = (x: number) => ((x + 180) / 360) * 520 + 20;
  const scaleZ = (z: number) => ((z + 170) / 340) * 400 + 30;

  const stationColors: Record<string, string> = {
    central: '#4a9eff',
    mountain: '#3ab582',
    industrial: '#d99a3a',
  };

  return (
    <div className="rv-map-overlay">
      <div className="rv-map-panel">
        <div className="rv-map-header">
          <h3>Railway Network Map</h3>
          <button onClick={toggleMap} aria-label="Close map">
            <X size={18} />
          </button>
        </div>
        <svg viewBox="0 0 560 460" className="rv-map-svg">
          {/* Background terrain hint */}
          <rect x="0" y="0" width="560" height="460" fill="#0d1117" />
          <rect x="0" y="0" width="560" height="460" fill="url(#mapGradient)" opacity={0.6} />
          <defs>
            <radialGradient id="mapGradient">
              <stop offset="0%" stopColor="#1a2538" />
              <stop offset="100%" stopColor="#0a0e15" />
            </radialGradient>
          </defs>

          {/* Track connections */}
          {TRACKS.filter((t) => t.startStationId && t.endStationId).map((t) => {
            const s = STATIONS.find((st) => st.id === t.startStationId);
            const e = STATIONS.find((st) => st.id === t.endStationId);
            if (!s || !e) return null;
            return (
              <line
                key={t.id}
                x1={scaleX(s.position[0])}
                y1={scaleZ(s.position[2])}
                x2={scaleX(e.position[0])}
                y2={scaleZ(e.position[2])}
                stroke="#5a6b7a"
                strokeWidth={2}
                strokeDasharray="6 3"
              />
            );
          })}

          {/* Non-station track stubs */}
          {TRACKS.filter((t) => !t.endStationId).map((t) => {
            const s = STATIONS.find((st) => st.id === t.startStationId);
            if (!s) return null;
            const ex = s.position[0] + (t.type === 'curved' ? 30 : 50);
            const ez = s.position[2] + (t.type === 'curved' ? -20 : 0);
            return (
              <line
                key={t.id}
                x1={scaleX(s.position[0])}
                y1={scaleZ(s.position[2])}
                x2={scaleX(ex)}
                y2={scaleZ(ez)}
                stroke="#3a4250"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Mountain range hint */}
          <path
            d={`M ${scaleX(-160)} ${scaleZ(-160)} L ${scaleX(-80)} ${scaleZ(-130)} L ${scaleX(-60)} ${scaleZ(-150)} L ${scaleX(-20)} ${scaleZ(-160)} Z`}
            fill="#2a3a2a"
            opacity={0.5}
          />

          {/* Water hint */}
          <circle cx={scaleX(150)} cy={scaleZ(-50)} r={22} fill="#2a4a6a" opacity={0.6} />

          {/* Stations */}
          {STATIONS.map((s) => {
            const cx = scaleX(s.position[0]);
            const cy = scaleZ(s.position[2]);
            const isSel = selectedStationId === s.id;
            return (
              <g
                key={s.id}
                className="rv-map-station"
                onClick={() => {
                  selectStation(s.id);
                  setCameraPreset(
                    s.type === 'central' ? 'central-station' : s.type === 'mountain' ? 'mountain-station' : 'industrial-station'
                  );
                }}
              >
                {isSel && <circle cx={cx} cy={cy} r={14} fill="none" stroke="#ffd27a" strokeWidth={2} opacity={0.7} />}
                <circle cx={cx} cy={cy} r={9} fill={stationColors[s.type]} stroke="#e8e8e0" strokeWidth={2} />
                <text x={cx} y={cy - 16} textAnchor="middle" fill="#e8e8e0" fontSize={11} fontWeight={600}>
                  {s.name}
                </text>
                <text x={cx} y={cy + 24} textAnchor="middle" fill="#8a9aaa" fontSize={9}>
                  {s.platformCount} platforms
                </text>
              </g>
            );
          })}
        </svg>
        <div className="rv-map-legend">
          {STATIONS.map((s) => (
            <div key={s.id} className="rv-map-legend-item">
              <span className="rv-map-legend-dot" style={{ background: stationColors[s.type] }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
