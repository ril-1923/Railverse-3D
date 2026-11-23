import * as THREE from 'three';
import type { TrackType } from '@/types';
import { trackPath } from '@/utils/three-helpers';

export interface TrackDefinition {
  id: string;
  type: TrackType;
  curve: THREE.CatmullRomCurve3;
  offset?: number; // lateral offset for parallel tracks
}

const STATION_POS: Record<string, [number, number, number]> = {
  central: [0, 0, 0],
  mountain: [-120, 0, -90],
  industrial: [110, 0, 60],
};

function v(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

function straightTrack(id: string, start: THREE.Vector3, end: THREE.Vector3, offset = 0): TrackDefinition {
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  const fwd = dir.clone().normalize();
  const perp = new THREE.Vector3(-fwd.z, 0, fwd.x).multiplyScalar(offset);
  const pts = [start.clone().add(perp), end.clone().add(perp)];
  void len;
  return { id, type: 'straight', curve: trackPath(pts), offset };
}

function curvedTrack(id: string, start: THREE.Vector3, end: THREE.Vector3, lift = 0, offset = 0): TrackDefinition {
  const mid = start.clone().lerp(end, 0.5);
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const perp = new THREE.Vector3(-dir.z, 0, dir.x);
  mid.add(perp.multiplyScalar(25 + lift));
  mid.y += lift;
  const fwd = new THREE.Vector3().subVectors(end, start).normalize();
  const side = new THREE.Vector3(-fwd.z, 0, fwd.x).multiplyScalar(offset);
  const pts = [start.clone().add(side), mid.clone().add(side), end.clone().add(side)];
  return { id, type: 'curved', curve: trackPath(pts), offset };
}

export function buildTrackDefinitions(): TrackDefinition[] {
  const c = v(...STATION_POS.central);
  const m = v(...STATION_POS.mountain);
  const ind = v(...STATION_POS.industrial);

  const tracks: TrackDefinition[] = [];

  // Central main straight east
  tracks.push(straightTrack('t-central-main', c, c.clone().add(new THREE.Vector3(160, 0, 0))));
  // Central -> Mountain curved
  tracks.push(curvedTrack('t-central-mountain', c, m, 12));
  // Central -> Industrial curved
  tracks.push(curvedTrack('t-central-industrial', c, ind, -10));
  // Central yard sidings (parallel tracks)
  tracks.push(straightTrack('t-central-yard-1', c.clone().add(new THREE.Vector3(-20, 0, 6)), c.clone().add(new THREE.Vector3(60, 0, 6))));
  tracks.push(straightTrack('t-central-yard-2', c.clone().add(new THREE.Vector3(-20, 0, 12)), c.clone().add(new THREE.Vector3(60, 0, 12)), 0));
  // Mountain curve continuation
  tracks.push(curvedTrack('t-mountain-curve', m, m.clone().add(new THREE.Vector3(-50, 8, -60)), 18));
  // Industrial yard siding
  tracks.push(straightTrack('t-industrial-yard-1', ind.clone().add(new THREE.Vector3(0, 0, -6)), ind.clone().add(new THREE.Vector3(70, 0, -6))));
  // Industrial bridge track
  tracks.push(curvedTrack('t-industrial-yard-2', ind, ind.clone().add(new THREE.Vector3(50, 0, 90)), 8));

  return tracks;
}

export const TRACK_DEFINITIONS = buildTrackDefinitions();

export function getTrackDefinition(id: string): TrackDefinition | undefined {
  return TRACK_DEFINITIONS.find((t) => t.id === id);
}
