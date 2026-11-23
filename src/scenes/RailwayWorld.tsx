import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/stores/useStore';
import EnvironmentSystem from './Environment';
import Terrain from './Terrain';
import Vegetation from './Vegetation';
import Stations from './railway/stations/Stations';
import Infrastructure from './railway/infrastructure/Infrastructure';
import RailwayTrack from './railway/RailwayTrack';
import CameraController from './cameras/CameraController';
import { TRACK_DEFINITIONS } from './railway/trackPaths';

function SceneContents() {
  const quality = useStore((s) => s.quality);
  const shadows = useStore((s) => s.shadows);
  const showGrid = useStore((s) => s.showGrid);
  const selectStation = useStore((s) => s.selectStation);
  const selectTrack = useStore((s) => s.selectTrack);

  const shadowEnabled = shadows !== 'none';

  return (
    <>
      <EnvironmentSystem />
      <CameraController />
      <Terrain />
      <Vegetation count={quality === 'low' ? 80 : 220} area={170} />
      <Stations />
      <Infrastructure />
      {TRACK_DEFINITIONS.map((def) => (
        <RailwayTrack key={def.id} def={def} />
      ))}
      {showGrid && (
        <gridHelper args={[400, 80, '#4a6b3a', '#36502a']} position={[0, 0.1, 0]} />
      )}
      {/* Click on empty space deselects */}
      <mesh
        visible={false}
        position={[0, -5, 0]}
        onClick={() => {
          selectStation(null);
          selectTrack(null);
        }}
      >
        <boxGeometry args={[1000, 0.1, 1000]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export default function RailwayWorld() {
  const quality = useStore((s) => s.quality);
  const shadows = useStore((s) => s.shadows);

  const dpr: [number, number] = quality === 'low' ? [1, 1] : quality === 'medium' ? [1, 1.5] : [1, 2];
  const shadowsEnabled = shadows !== 'none';
  const shadowType = shadows === 'hard' ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

  return (
    <Canvas
      shadows={shadowsEnabled ? { type: shadowType } : false}
      dpr={dpr}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      camera={{ position: [80, 90, 120], fov: 50, near: 0.5, far: 600 }}
      onPointerMissed={() => {}}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
