import Sidebar from '@/components/panels/Sidebar';
import BottomBar from '@/components/controls/BottomBar';
import { useStore } from '@/stores/useStore';
import type { GraphicsQuality, ShadowSetting, EnvironmentMode } from '@/types';
import { Gauge, Sun, Sunset, Moon, Layers, Sliders, Eye, Sparkles, type LucideIcon } from 'lucide-react';

export default function SettingsPage() {
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  const shadows = useStore((s) => s.shadows);
  const setShadows = useStore((s) => s.setShadows);
  const sensitivity = useStore((s) => s.cameraSensitivity);
  const setSensitivity = useStore((s) => s.setCameraSensitivity);
  const environment = useStore((s) => s.environment);
  const setEnvironment = useStore((s) => s.setEnvironment);
  const showGrid = useStore((s) => s.showGrid);
  const toggleGrid = useStore((s) => s.toggleGrid);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const toggleReducedMotion = useStore((s) => s.toggleReducedMotion);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const rightPanelOpen = useStore((s) => s.rightPanelOpen);
  const toggleRightPanel = useStore((s) => s.toggleRightPanel);

  return (
    <div className="rv-page">
      <Sidebar />
      <div className="rv-page-content">
        <div className="rv-page-header">
          <h1>Settings</h1>
          <p>Configure graphics, environment and interface preferences.</p>
        </div>

        <div className="rv-settings-grid">
          <SettingCard title="Graphics Quality" icon={Gauge}>
            <p className="rv-setting-hint">Higher quality renders more trees and sharper shadows.</p>
            <div className="rv-btn-group">
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  className={`rv-chip ${quality === q ? 'active' : ''}`}
                  onClick={() => setQuality(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </SettingCard>

          <SettingCard title="Shadows" icon={Layers}>
            <p className="rv-setting-hint">Soft shadows look better but cost more performance.</p>
            <div className="rv-btn-group">
              {(['none', 'soft', 'hard'] as ShadowSetting[]).map((sh) => (
                <button
                  key={sh}
                  className={`rv-chip ${shadows === sh ? 'active' : ''}`}
                  onClick={() => setShadows(sh)}
                >
                  {sh}
                </button>
              ))}
            </div>
          </SettingCard>

          <SettingCard title="Camera Sensitivity" icon={Sliders}>
            <p className="rv-setting-hint">Adjust how quickly the camera rotates and zooms.</p>
            <input
              type="range"
              min={0.3}
              max={2}
              step={0.1}
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="rv-slider"
            />
            <span className="rv-slider-value">{sensitivity.toFixed(1)}x</span>
          </SettingCard>

          <SettingCard title="Environment Mode" icon={Sparkles}>
            <p className="rv-setting-hint">Switch between day, sunset and night lighting.</p>
            <div className="rv-btn-group">
              <button
                className={`rv-chip ${environment === 'day' ? 'active' : ''}`}
                onClick={() => setEnvironment('day')}
              >
                <Sun size={14} /> Day
              </button>
              <button
                className={`rv-chip ${environment === 'sunset' ? 'active' : ''}`}
                onClick={() => setEnvironment('sunset')}
              >
                <Sunset size={14} /> Sunset
              </button>
              <button
                className={`rv-chip ${environment === 'night' ? 'active' : ''}`}
                onClick={() => setEnvironment('night')}
              >
                <Moon size={14} /> Night
              </button>
            </div>
          </SettingCard>

          <SettingCard title="Interface Preferences" icon={Eye}>
            <div className="rv-toggle-list">
              <ToggleRow label="Show grid helper" value={showGrid} onChange={toggleGrid} />
              <ToggleRow label="Reduced motion (instant camera)" value={reducedMotion} onChange={toggleReducedMotion} />
              <ToggleRow label="Left sidebar" value={sidebarOpen} onChange={toggleSidebar} />
              <ToggleRow label="Right info panel" value={rightPanelOpen} onChange={toggleRightPanel} />
            </div>
          </SettingCard>

          <SettingCard title="Environment Quick Switch" icon={Sun}>
            <p className="rv-setting-hint">Live preview of each environment's lighting tone.</p>
            <div className="rv-env-preview">
              {(['day', 'sunset', 'night'] as EnvironmentMode[]).map((m) => (
                <button
                  key={m}
                  className={`rv-env-preview-card ${environment === m ? 'active' : ''}`}
                  onClick={() => setEnvironment(m)}
                >
                  <div className={`rv-env-preview-swatch rv-env-${m}`} />
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </SettingCard>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

function SettingCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rv-card rv-setting-card">
      <h2 className="rv-card-title">
        <Icon size={18} /> {title}
      </h2>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="rv-toggle-row">
      <span>{label}</span>
      <button className={`rv-toggle ${value ? 'on' : 'off'}`} onClick={onChange} aria-label={label}>
        <span className="rv-toggle-knob" />
      </button>
    </div>
  );
}
