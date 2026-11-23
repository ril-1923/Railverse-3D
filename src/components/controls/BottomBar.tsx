import { useStore } from '@/stores/useStore';
import { CAMERA_VIEWS } from '@/data/stations';
import { Camera, ZoomIn, ZoomOut, RotateCcw, Sun, Sunset, Moon, Circle, type LucideIcon } from 'lucide-react';
import type { EnvironmentMode } from '@/types';

export default function BottomBar() {
  const cameraMode = useStore((s) => s.cameraMode);
  const setCameraMode = useStore((s) => s.setCameraMode);
  const environment = useStore((s) => s.environment);
  const setEnvironment = useStore((s) => s.setEnvironment);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const resetCamera = useStore((s) => s.resetCamera);

  return (
    <div className="rv-bottombar">
      <div className="rv-bottombar-group">
        <span className="rv-bottombar-label">
          <Camera size={14} /> Camera
        </span>
        {(['orbit', 'pan', 'zoom'] as const).map((m) => (
          <button
            key={m}
            className={`rv-chip ${cameraMode === m ? 'active' : ''}`}
            onClick={() => setCameraMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="rv-bottombar-divider" />

      <div className="rv-bottombar-group">
        <button className="rv-chip" onClick={() => zoomBy(-15)}>
          <ZoomOut size={14} /> Zoom Out
        </button>
        <button className="rv-chip" onClick={() => zoomBy(15)}>
          <ZoomIn size={14} /> Zoom In
        </button>
        <button className="rv-chip" onClick={resetCamera}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="rv-bottombar-divider" />

      <div className="rv-bottombar-group">
        <span className="rv-bottombar-label">Environment</span>
        <EnvButton mode="day" current={environment} onClick={setEnvironment} icon={Sun} />
        <EnvButton mode="sunset" current={environment} onClick={setEnvironment} icon={Sunset} />
        <EnvButton mode="night" current={environment} onClick={setEnvironment} icon={Moon} />
      </div>

      <div className="rv-bottombar-divider" />

      <div className="rv-bottombar-group">
        <span className="rv-bottombar-label">Preset</span>
        <select
          className="rv-select"
          value={useStore.getState().cameraPreset}
          onChange={(e) => setCameraPreset(e.target.value as typeof CAMERA_VIEWS[number]['id'])}
        >
          {CAMERA_VIEWS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rv-bottombar-spacer" />

      <div className="rv-bottombar-group">
        <span className="rv-status-dot" />
        <span className="rv-bottombar-label">
          <Circle size={8} /> Stage 1 — World Online
        </span>
      </div>
    </div>
  );
}

function EnvButton({
  mode,
  current,
  onClick,
  icon: Icon,
}: {
  mode: EnvironmentMode;
  current: EnvironmentMode;
  onClick: (m: EnvironmentMode) => void;
  icon: LucideIcon;
}) {
  return (
    <button
      className={`rv-chip ${current === mode ? 'active' : ''}`}
      onClick={() => onClick(mode)}
    >
      <Icon size={14} /> {mode}
    </button>
  );
}

function zoomBy(delta: number) {
  // Approximate zoom by adjusting the canvas via a custom event; OrbitControls handles wheel natively
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: delta * 10, bubbles: true }));
}
