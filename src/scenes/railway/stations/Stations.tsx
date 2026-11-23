import { useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore } from '@/stores/useStore';
import { STATIONS } from '@/data/stations';
import type { StationInfo } from '@/types';

export default function Stations() {
  return (
    <group>
      {STATIONS.map((s) => (
        <Station key={s.id} info={s} />
      ))}
    </group>
  );
}

function Station({ info }: { info: StationInfo }) {
  const selectedStationId = useStore((s) => s.selectedStationId);
  const selectStation = useStore((s) => s.selectStation);
  const selected = selectedStationId === info.id;
  const highlightRef = useRef<THREE.Mesh>(null);

  if (info.type === 'central') return <CentralStation info={info} selected={selected} onSelect={selectStation} highlightRef={highlightRef} />;
  if (info.type === 'mountain') return <MountainStation info={info} selected={selected} onSelect={selectStation} />;
  return <IndustrialStation info={info} selected={selected} onSelect={selectStation} />;
}

interface StationProps {
  info: StationInfo;
  selected: boolean;
  onSelect: (id: string) => void;
  highlightRef?: React.RefObject<THREE.Mesh | null>;
}

function CentralStation({ info, selected, onSelect }: StationProps) {
  const [px, , pz] = info.position;
  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(info.id);
      }}
    >
      {/* Main building */}
      <group position={[0, 0, -16]}>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <boxGeometry args={[36, 6, 12]} />
          <meshStandardMaterial color="#cfcabd" roughness={0.8} />
        </mesh>
        {/* Glass front */}
        <mesh position={[0, 3.2, 6.05]}>
          <boxGeometry args={[30, 4, 0.2]} />
          <meshStandardMaterial color="#8fd4e8" metalness={0.3} roughness={0.1} transparent opacity={0.5} />
        </mesh>
        {/* Roof */}
        <mesh castShadow position={[0, 6.6, 0]}>
          <boxGeometry args={[38, 0.6, 14]} />
          <meshStandardMaterial color="#3a4250" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Entrance canopy */}
        <mesh castShadow position={[0, 4.2, 8]}>
          <boxGeometry args={[20, 0.3, 4]} />
          <meshStandardMaterial color="#4a5260" metalness={0.5} roughness={0.6} />
        </mesh>
        <Text position={[0, 7.5, 0]} fontSize={1.4} color="#1a1d22" anchorX="center" anchorY="middle">
          CENTRAL STATION
        </Text>
      </group>

      {/* 4 Platforms */}
      {[0, 8, -8, 16].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <mesh receiveShadow castShadow position={[10, 0.6, 0]}>
            <boxGeometry args={[60, 1.2, 4]} />
            <meshStandardMaterial color="#9a9690" roughness={0.9} />
          </mesh>
          {/* Platform roof on some platforms */}
          {(i === 0 || i === 3) && (
            <group position={[10, 0, 0]}>
              <mesh castShadow position={[0, 4.5, -1.8]}>
                <boxGeometry args={[50, 0.25, 0.25]} />
                <meshStandardMaterial color="#2b2f36" metalness={0.6} />
              </mesh>
              <mesh castShadow position={[0, 4.5, 1.8]}>
                <boxGeometry args={[50, 0.25, 0.25]} />
                <meshStandardMaterial color="#2b2f36" metalness={0.6} />
              </mesh>
              <mesh castShadow position={[0, 5.2, 0]}>
                <boxGeometry args={[50, 0.2, 4.2]} />
                <meshStandardMaterial color="#3a4250" metalness={0.4} roughness={0.6} />
              </mesh>
            </group>
          )}
          {/* Benches */}
          {[-10, 10, 30].map((bx, bi) => (
            <mesh key={bi} castShadow position={[bx, 1.0, 0]}>
              <boxGeometry args={[2.4, 0.4, 0.8]} />
              <meshStandardMaterial color="#5a4632" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Footbridge */}
      <group position={[5, 0, 8]}>
        <mesh castShadow position={[0, 6, 0]}>
          <boxGeometry args={[8, 0.3, 3]} />
          <meshStandardMaterial color="#4a5260" metalness={0.5} />
        </mesh>
        {[-3.5, 3.5].map((x) => (
          <mesh key={x} castShadow position={[x, 3, 0]}>
            <boxGeometry args={[0.3, 6, 3]} />
            <meshStandardMaterial color="#4a5260" metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Station clock */}
      <group position={[-18, 0, -2]}>
        <mesh castShadow position={[0, 4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
          <meshStandardMaterial color="#2b2f36" metalness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 8.3, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
          <meshStandardMaterial color="#e8e8e0" roughness={0.6} />
        </mesh>
      </group>

      {/* Platform signs */}
      {[0, 8, -8, 16].map((z, i) => (
        <Text key={i} position={[28, 2.2, z]} fontSize={0.7} color="#ffd27a" anchorX="center">
          {`Platform ${i + 1}`}
        </Text>
      ))}

      {/* Platform display */}
      <mesh position={[10, 3.5, 16]}>
        <boxGeometry args={[6, 1.2, 0.15]} />
        <meshStandardMaterial color="#1a2a2a" emissive="#2affaa" emissiveIntensity={selected ? 0.8 : 0.4} />
      </mesh>

      {selected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[34, 36, 48]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function MountainStation({ info, selected, onSelect }: StationProps) {
  const [px, , pz] = info.position;
  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(info.id);
      }}
    >
      {/* Small station building */}
      <group position={[0, 0, -8]}>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxGeometry args={[14, 4, 8]} />
          <meshStandardMaterial color="#b8a890" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 4.4, 0]}>
          <boxGeometry args={[15, 0.5, 9]} />
          <meshStandardMaterial color="#5a4632" roughness={0.8} />
        </mesh>
        {/* Roof pitch */}
        <mesh castShadow position={[0, 5.6, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[7.5, 2, 4]} />
          <meshStandardMaterial color="#6b3a2a" roughness={0.8} />
        </mesh>
        <Text position={[0, 4.8, 4.1]} fontSize={0.8} color="#1a1d22" anchorX="center">
          MOUNTAIN STATION
        </Text>
      </group>

      {/* 2 Platforms */}
      {[0, 7].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <mesh receiveShadow castShadow position={[6, 0.5, 0]}>
            <boxGeometry args={[36, 1, 3]} />
            <meshStandardMaterial color="#9a9690" roughness={0.9} />
          </mesh>
          {/* Shelter on platform 1 */}
          {i === 0 && (
            <group position={[6, 0, 0]}>
              <mesh castShadow position={[0, 3.5, -1.3]}>
                <boxGeometry args={[10, 0.2, 0.2]} />
                <meshStandardMaterial color="#2b2f36" />
              </mesh>
              <mesh castShadow position={[0, 3.5, 1.3]}>
                <boxGeometry args={[10, 0.2, 0.2]} />
                <meshStandardMaterial color="#2b2f36" />
              </mesh>
              <mesh castShadow position={[0, 4, 0]}>
                <boxGeometry args={[10, 0.2, 3]} />
                <meshStandardMaterial color="#3a4250" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Signage */}
      <Text position={[6, 3, 7]} fontSize={0.6} color="#ffd27a" anchorX="center">
        Platform 2
      </Text>

      {selected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[18, 20, 48]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function IndustrialStation({ info, selected, onSelect }: StationProps) {
  const [px, , pz] = info.position;
  return (
    <group
      position={[px, 0, pz]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(info.id);
      }}
    >
      {/* Warehouse */}
      <group position={[-20, 0, -12]}>
        <mesh castShadow receiveShadow position={[0, 3, 0]}>
          <boxGeometry args={[24, 6, 14]} />
          <meshStandardMaterial color="#7a756c" roughness={0.9} />
        </mesh>
        {/* Curved roof */}
        <mesh castShadow position={[0, 6.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[7, 7, 24, 12, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#5a5650" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Cargo storage buildings */}
      {[-20, -8].map((x, i) => (
        <mesh key={i} castShadow receiveShadow position={[x, 1.5, 12]}>
          <boxGeometry args={[8, 3, 6]} />
          <meshStandardMaterial color="#8a6b5a" roughness={0.9} />
        </mesh>
      ))}

      {/* Loading platforms / 3 freight tracks */}
      {[0, -6, 6].map((z, i) => (
        <mesh key={i} receiveShadow castShadow position={[10, 0.4, z]}>
          <boxGeometry args={[40, 0.8, 3]} />
          <meshStandardMaterial color="#6b6f75" roughness={0.9} />
        </mesh>
      ))}

      {/* Containers */}
      {[
        [20, 8, '#b23a3a'],
        [24, 8, '#3a6b88'],
        [28, 8, '#d9a93a'],
        [22, 14, '#4a6b3a'],
        [26, 14, '#b23a3a'],
      ].map(([x, z, color], i) => (
        <mesh key={i} castShadow position={[x as number, 1.6, z as number]}>
          <boxGeometry args={[5, 2.6, 2.6]} />
          <meshStandardMaterial color={color as string} roughness={0.8} metalness={0.3} />
        </mesh>
      ))}

      <Text position={[0, 7, -20]} fontSize={1} color="#e8e8e0" anchorX="center">
        INDUSTRIAL TERMINAL
      </Text>

      {selected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[24, 26, 48]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
