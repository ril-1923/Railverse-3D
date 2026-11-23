export type EnvironmentMode = 'day' | 'sunset' | 'night';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type ShadowSetting = 'none' | 'soft' | 'hard';

export type StationType = 'central' | 'mountain' | 'industrial';

export type TrackType =
  | 'straight'
  | 'curved'
  | 'parallel'
  | 'yard'
  | 'platform'
  | 'bridge';

export type InfrastructureType =
  | 'signal'
  | 'crossing'
  | 'warning-sign'
  | 'pole'
  | 'platform-light'
  | 'fence'
  | 'bridge'
  | 'shed'
  | 'bench'
  | 'display'
  | 'water-tower'
  | 'equipment';

export type CameraPreset =
  | 'overview'
  | 'central-station'
  | 'mountain-station'
  | 'industrial-station'
  | 'railway-yard'
  | 'mountain-landscape';

export type CameraMode = 'orbit' | 'pan' | 'zoom';

export interface StationInfo {
  id: string;
  name: string;
  type: StationType;
  platformCount: number;
  description: string;
  position: [number, number, number];
  connectedTrackIds: string[];
}

export interface TrackInfo {
  id: string;
  type: TrackType;
  length: number;
  startStationId: string | null;
  endStationId: string | null;
  description: string;
}

export interface InfrastructureInfo {
  id: string;
  type: InfrastructureType;
  name: string;
  description: string;
  stationId: string | null;
}

export interface GraphicsSettings {
  quality: GraphicsQuality;
  shadows: ShadowSetting;
  cameraSensitivity: number;
  environment: EnvironmentMode;
  showFps: boolean;
  showGrid: boolean;
  reducedMotion: boolean;
}

export interface CameraView {
  id: CameraPreset;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}
