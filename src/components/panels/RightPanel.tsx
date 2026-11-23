import { useStore } from '@/stores/useStore';
import { STATIONS, TRACKS, INFRASTRUCTURE } from '@/data/stations';
import { X, Building2, GitBranch, Wrench, Train, Hash, Ruler, ArrowRight, type LucideIcon } from 'lucide-react';

export default function RightPanel() {
  const open = useStore((s) => s.rightPanelOpen);
  const toggle = useStore((s) => s.toggleRightPanel);
  const selectedStationId = useStore((s) => s.selectedStationId);
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const selectedInfraId = useStore((s) => s.selectedInfrastructureId);
  const setCameraPreset = useStore((s) => s.setCameraPreset);

  if (!open) {
    return (
      <button className="rv-rightpanel-open-btn" onClick={toggle} aria-label="Open info panel">
        <Train size={18} />
      </button>
    );
  }

  const station = STATIONS.find((s) => s.id === selectedStationId);
  const track = TRACKS.find((t) => t.id === selectedTrackId);
  const infra = INFRASTRUCTURE.find((i) => i.id === selectedInfraId);

  const hasSelection = station || track || infra;

  return (
    <aside className="rv-rightpanel">
      <div className="rv-rightpanel-header">
        <span>Information</span>
        <button className="rv-rightpanel-close" onClick={toggle} aria-label="Close panel">
          <X size={16} />
        </button>
      </div>
      <div className="rv-rightpanel-body">
        {!hasSelection && (
          <div className="rv-rightpanel-empty">
            <Train size={32} />
            <p>Select a station, track, or infrastructure object to view its details.</p>
          </div>
        )}
        {station && (
          <div className="rv-info-block">
            <div className="rv-info-icon"><Building2 size={20} /></div>
            <h3>{station.name}</h3>
            <div className="rv-info-grid">
              <InfoRow icon={Hash} label="Station ID" value={station.id} />
              <InfoRow label="Station Type" value={station.type} />
              <InfoRow label="Platforms" value={String(station.platformCount)} />
              <InfoRow label="Connected Tracks" value={String(station.connectedTrackIds.length)} />
            </div>
            <div className="rv-info-connected">
              <span className="rv-info-sublabel">Connected Tracks</span>
              {station.connectedTrackIds.map((tid) => {
                const t = TRACKS.find((tt) => tt.id === tid);
                return (
                  <div key={tid} className="rv-connected-track">
                    <GitBranch size={12} />
                    <span>{tid}</span>
                    {t && <span className="rv-connected-type">{t.type}</span>}
                  </div>
                );
              })}
            </div>
            <p className="rv-info-desc">{station.description}</p>
            <button
              className="rv-info-action"
              onClick={() =>
                setCameraPreset(
                  station.type === 'central'
                    ? 'central-station'
                    : station.type === 'mountain'
                    ? 'mountain-station'
                    : 'industrial-station'
                )
              }
            >
              Focus Camera <ArrowRight size={14} />
            </button>
          </div>
        )}
        {track && (
          <div className="rv-info-block">
            <div className="rv-info-icon"><GitBranch size={20} /></div>
            <h3>Track {track.id}</h3>
            <div className="rv-info-grid">
              <InfoRow icon={Hash} label="Track ID" value={track.id} />
              <InfoRow label="Track Type" value={track.type} />
              <InfoRow icon={Ruler} label="Length" value={`${track.length} m`} />
              <InfoRow
                label="From"
                value={track.startStationId ? STATIONS.find((s) => s.id === track.startStationId)?.name ?? track.startStationId : '—'}
              />
              <InfoRow
                label="To"
                value={track.endStationId ? STATIONS.find((s) => s.id === track.endStationId)?.name ?? track.endStationId : '—'}
              />
            </div>
            <p className="rv-info-desc">{track.description}</p>
          </div>
        )}
        {infra && (
          <div className="rv-info-block">
            <div className="rv-info-icon"><Wrench size={20} /></div>
            <h3>{infra.name}</h3>
            <div className="rv-info-grid">
              <InfoRow icon={Hash} label="ID" value={infra.id} />
              <InfoRow label="Type" value={infra.type} />
              <InfoRow
                label="Station"
                value={infra.stationId ? STATIONS.find((s) => s.id === infra.stationId)?.name ?? infra.stationId : 'Network-wide'}
              />
            </div>
            <p className="rv-info-desc">{infra.description}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rv-info-row">
      <span className="rv-info-label">
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <span className="rv-info-value">{value}</span>
    </div>
  );
}
