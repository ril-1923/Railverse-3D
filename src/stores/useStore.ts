import { create } from 'zustand';
import type {
  EnvironmentMode,
  GraphicsQuality,
  ShadowSetting,
  CameraPreset,
  StationType,
  TrackType,
  InfrastructureType,
} from '@/types';
import { CAMERA_VIEWS } from '@/data/stations';

interface AppState {
  selectedStationId: string | null;
  selectedTrackId: string | null;
  selectedInfrastructureId: string | null;
  cameraPreset: CameraPreset;
  cameraMode: 'orbit' | 'pan' | 'zoom';
  environment: EnvironmentMode;
  quality: GraphicsQuality;
  shadows: ShadowSetting;
  cameraSensitivity: number;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  mapOpen: boolean;
  showGrid: boolean;
  reducedMotion: boolean;

  selectStation: (id: string | null) => void;
  selectTrack: (id: string | null) => void;
  selectInfrastructure: (id: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setCameraMode: (mode: 'orbit' | 'pan' | 'zoom') => void;
  setEnvironment: (mode: EnvironmentMode) => void;
  setQuality: (q: GraphicsQuality) => void;
  setShadows: (s: ShadowSetting) => void;
  setCameraSensitivity: (n: number) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleMap: () => void;
  toggleGrid: () => void;
  toggleReducedMotion: () => void;
  resetCamera: () => void;
}

export const useStore = create<AppState>((set) => ({
  selectedStationId: null,
  selectedTrackId: null,
  selectedInfrastructureId: null,
  cameraPreset: 'overview',
  cameraMode: 'orbit',
  environment: 'day',
  quality: 'high',
  shadows: 'soft',
  cameraSensitivity: 1,
  sidebarOpen: true,
  rightPanelOpen: true,
  mapOpen: false,
  showGrid: false,
  reducedMotion: false,

  selectStation: (id) =>
    set({ selectedStationId: id, selectedTrackId: null, selectedInfrastructureId: null, rightPanelOpen: true }),
  selectTrack: (id) =>
    set({ selectedTrackId: id, selectedStationId: null, selectedInfrastructureId: null, rightPanelOpen: true }),
  selectInfrastructure: (id) =>
    set({ selectedInfrastructureId: id, selectedStationId: null, selectedTrackId: null, rightPanelOpen: true }),
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setEnvironment: (mode) => set({ environment: mode }),
  setQuality: (q) => set({ quality: q }),
  setShadows: (s) => set({ shadows: s }),
  setCameraSensitivity: (n) => set({ cameraSensitivity: n }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  toggleMap: () => set((s) => ({ mapOpen: !s.mapOpen })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
  resetCamera: () => set({ cameraPreset: 'overview' }),
}));

export { CAMERA_VIEWS };
export type { StationType, TrackType, InfrastructureType };
