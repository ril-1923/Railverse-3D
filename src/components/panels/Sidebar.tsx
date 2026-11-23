import { useStore } from '@/stores/useStore';
import { STATIONS, TRACKS } from '@/data/stations';
import { CAMERA_VIEWS } from '@/data/stations';
import { Map as MapIcon, Building2, GitBranch, Wrench, Camera, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const selectStation = useStore((s) => s.selectStation);
  const selectTrack = useStore((s) => s.selectTrack);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const cameraPreset = useStore((s) => s.cameraPreset);

  return (
    <aside className={`rv-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <button className="rv-sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      {sidebarOpen && (
        <div className="rv-sidebar-content">
          <SidebarSection title="Railway Map" icon={MapIcon}>
            <button className="rv-sidebar-item" onClick={() => useStore.getState().toggleMap()}>
              Open Interactive Map
            </button>
          </SidebarSection>

          <SidebarSection title="Stations" icon={Building2}>
            {STATIONS.map((s) => (
              <button
                key={s.id}
                className="rv-sidebar-item"
                onClick={() => {
                  selectStation(s.id);
                  setCameraPreset(
                    s.type === 'central' ? 'central-station' : s.type === 'mountain' ? 'mountain-station' : 'industrial-station'
                  );
                }}
              >
                {s.name}
              </button>
            ))}
          </SidebarSection>

          <SidebarSection title="Railway Tracks" icon={GitBranch}>
            {TRACKS.map((t) => (
              <button key={t.id} className="rv-sidebar-item" onClick={() => selectTrack(t.id)}>
                <span className="rv-track-id">{t.id}</span>
                <span className="rv-track-type">{t.type}</span>
              </button>
            ))}
          </SidebarSection>

          <SidebarSection title="Railway Infrastructure" icon={Wrench}>
            <span className="rv-sidebar-hint">Select infrastructure from the Infrastructure page</span>
          </SidebarSection>

          <SidebarSection title="Camera Views" icon={Camera}>
            {CAMERA_VIEWS.map((v) => (
              <button
                key={v.id}
                className={`rv-sidebar-item ${cameraPreset === v.id ? 'active' : ''}`}
                onClick={() => setCameraPreset(v.id)}
              >
                {v.name}
              </button>
            ))}
          </SidebarSection>
        </div>
      )}
    </aside>
  );
}

function SidebarSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rv-sidebar-section">
      <div className="rv-sidebar-section-title">
        <Icon size={14} />
        <span>{title}</span>
      </div>
      <div className="rv-sidebar-section-body">{children}</div>
    </div>
  );
}
