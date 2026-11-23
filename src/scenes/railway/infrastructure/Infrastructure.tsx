import { useMemo } from 'react';
import * as THREE from 'three';
import { TRACK_DEFINITIONS } from '../trackPaths';

export default function Infrastructure() {
  const polePositions = useMemo(() => {
    const pos: { pos: [number, number, number]; rot: number }[] = [];
    const mainTrack = TRACK_DEFINITIONS.find((t) => t.id === 't-central-main');
    if (mainTrack) {
      const curve = mainTrack.curve;
      const len = curve.getLength();
      const count = Math.floor(len / 12);
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const p = curve.getPointAt(t);
        const tan = curve.getTangentAt(t);
        pos.push({ pos: [p.x + 2.4, p.y, p.z], rot: Math.atan2(tan.x, tan.z) });
      }
    }
    return pos;
  }, []);

  const fencePositions = useMemo(() => {
    const pos: { pos: [number, number, number]; rot: number }[] = [];
    const track = TRACK_DEFINITIONS.find((t) => t.id === 't-central-main');
    if (track) {
      const curve = track.curve;
      const len = curve.getLength();
      const count = Math.floor(len / 4);
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const p = curve.getPointAt(t);
        const tan = curve.getTangentAt(t);
        pos.push({ pos: [p.x + 3.5, p.y, p.z], rot: Math.atan2(tan.x, tan.z) });
      }
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Signals */}
      <Signal position={[60, 0, -3]} />
      <Signal position={[-100, 0, -80]} />

      {/* Level crossing */}
      <LevelCrossing position={[40, 0, 0]} />

      {/* Water tower near industrial */}
      <WaterTower position={[95, 0, 75]} />

      {/* Maintenance shed near yard */}
      <MaintenanceShed position={[-30, 0, 18]} />

      {/* Catenary poles along main track */}
      {polePositions.map((p, i) => (
        <CatenaryPole key={`pole-${i}`} position={p.pos} rotation={p.rot} />
      ))}

      {/* Fences along main track */}
      {fencePositions.map((p, i) => (
        <FenceSegment key={`fence-${i}`} position={p.pos} rotation={p.rot} />
      ))}

      {/* Warning signs */}
      <WarningSign position={[35, 0, 5]} rotation={Math.PI / 2} />
      <WarningSign position={[-90, 0, -70]} rotation={Math.PI / 2} />

      {/* River bridge (already referenced as bridge track, add support piers */}
      <BridgeSupports />
    </group>
  );
}

function Signal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 6, 8]} />
        <meshStandardMaterial color="#2b2f36" metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 6.2, 0.15]}>
        <boxGeometry args={[0.5, 1.2, 0.3]} />
        <meshStandardMaterial color="#1a1d22" />
      </mesh>
      <mesh position={[0, 6.5, 0.32]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#ff3a3a" emissive="#ff3a3a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 6.0, 0.32]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#3aff3a" emissive="#3aff3a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function LevelCrossing({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Gate posts */}
      {[-4, 4].map((x) => (
        <mesh key={x} castShadow position={[x, 1.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
          <meshStandardMaterial color="#2b2f36" metalness={0.6} />
        </mesh>
      ))}
      {/* Gate bars */}
      <mesh castShadow position={[-2, 2.8, 0]}>
        <boxGeometry args={[4, 0.12, 0.12]} />
        <meshStandardMaterial color="#b23a3a" />
      </mesh>
      <mesh castShadow position={[2, 2.8, 0]}>
        <boxGeometry args={[4, 0.12, 0.12]} />
        <meshStandardMaterial color="#b23a3a" />
      </mesh>
      {/* Road */}
      <mesh receiveShadow position={[0, 0.05, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#3a3d42" roughness={0.95} />
      </mesh>
    </group>
  );
}

function WaterTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} castShadow position={[x, 2, x === -1.5 ? -1.5 : 1.5]}>
          <cylinderGeometry args={[0.12, 0.12, 4, 6]} />
          <meshStandardMaterial color="#2b2f36" metalness={0.5} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 5, 0]}>
        <cylinderGeometry args={[2, 2, 4, 12]} />
        <meshStandardMaterial color="#5a4632" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 7.2, 0]}>
        <coneGeometry args={[2.2, 1.2, 12]} />
        <meshStandardMaterial color="#4a3522" roughness={0.9} />
      </mesh>
    </group>
  );
}

function MaintenanceShed({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <boxGeometry args={[12, 4, 8]} />
        <meshStandardMaterial color="#8a7560" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 4.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[4.2, 4.2, 12, 8, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#5a5650" metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CatenaryPole({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 7, 6]} />
        <meshStandardMaterial color="#4a4f56" metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 6.5, 0]}>
        <boxGeometry args={[3, 0.12, 0.12]} />
        <meshStandardMaterial color="#4a4f56" metalness={0.6} />
      </mesh>
    </group>
  );
}

function FenceSegment({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[4, 1.2, 0.06]} />
        <meshStandardMaterial color="#6b6f75" metalness={0.4} />
      </mesh>
      {[-1.8, 0, 1.8].map((x) => (
        <mesh key={x} castShadow position={[x, 0.6, 0]}>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#4a4f56" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function WarningSign({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
        <meshStandardMaterial color="#2b2f36" />
      </mesh>
      <mesh castShadow position={[0, 3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial color="#d9a93a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BridgeSupports() {
  const track = TRACK_DEFINITIONS.find((t) => t.id === 't-industrial-yard-2');
  if (!track) return null;
  const curve = track.curve;
  const len = curve.getLength();
  const count = Math.floor(len / 12);
  const piers: [number, number, number][] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const p = curve.getPointAt(t);
    if (p.y < 1) continue;
    piers.push([p.x, p.y / 2, p.z]);
  }
  return (
    <group>
      {piers.map((pos, i) => (
        <mesh key={i} castShadow position={pos}>
          <boxGeometry args={[1.5, pos[1] * 2 + 2, 1.5]} />
          <meshStandardMaterial color="#9a9690" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
