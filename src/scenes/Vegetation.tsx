import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '@/stores/useStore';

interface VegProps {
  count?: number;
  area?: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Vegetation({ count = 220, area = 180, seed = 42 }: VegProps) {
  const quality = useStore((s) => s.quality);
  const treeCount = quality === 'low' ? Math.floor(count * 0.4) : quality === 'medium' ? Math.floor(count * 0.7) : count;

  const { pineMatrices, oakMatrices, bushMatrices } = useMemo(() => {
    const rand = seededRandom(seed);
    const pine: THREE.Matrix4[] = [];
    const oak: THREE.Matrix4[] = [];
    const bush: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();
    const dummy = new THREE.Object3D();

    function terrainH(x: number, z: number): number {
      let h = Math.sin(x * 0.018) * Math.cos(z * 0.0144) * 3.2 + Math.sin(x * 0.0414 + 1.2) * Math.cos(z * 0.0306) * 1.28;
      const dist = Math.sqrt(x * x + z * z);
      const mask = Math.max(0, Math.min(1, (dist - 110) / 60));
      h += Math.sin(x * 0.012) * Math.cos(z * 0.0096) * 34 * mask;
      // flatten near stations
      const zones: [number, number, number][] = [
        [0, 0, 32],
        [-120, -90, 30],
        [110, 60, 32],
      ];
      let fl = 0;
      for (const [cx, cz, r] of zones) {
        const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
        if (d < r) fl = Math.max(fl, 1 - d / r);
      }
      if (Math.abs(z) < 8 && x > -130 && x < 160) fl = Math.max(fl, 1 - Math.abs(z) / 8);
      h = h * (1 - fl * 0.85);
      return h;
    }

    for (let i = 0; i < treeCount; i++) {
      const x = (rand() - 0.5) * area * 2;
      const z = (rand() - 0.5) * area * 2;
      const y = terrainH(x, z);
      if (y < -0.3 || y > 32) continue;
      // avoid water
      const waterDist = Math.sqrt((x - 150) ** 2 + (z + 50) ** 2);
      if (waterDist < 38) continue;

      const scale = 0.8 + rand() * 1.6;
      const isPine = rand() > 0.4;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rand() * Math.PI * 2, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      m.copy(dummy.matrix);
      if (isPine) pine.push(m.clone());
      else oak.push(m.clone());
    }

    const bushCount = Math.floor(treeCount * 0.6);
    for (let i = 0; i < bushCount; i++) {
      const x = (rand() - 0.5) * area * 2;
      const z = (rand() - 0.5) * area * 2;
      const y = terrainH(x, z);
      if (y < 0 || y > 25) continue;
      const scale = 0.5 + rand() * 0.9;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rand() * Math.PI * 2, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      m.copy(dummy.matrix);
      bushMatricesRow(bush, m.clone());
    }

    function bushMatricesRow(arr: THREE.Matrix4[], mat: THREE.Matrix4) {
      arr.push(mat);
    }

    return { pineMatrices: pine, oakMatrices: oak, bushMatrices: bush };
  }, [treeCount, area, seed]);

  return (
    <group>
      {/* Pine trees - cone + trunk */}
      {pineMatrices.map((mat, i) => (
        <PineTree key={`pine-${i}`} matrix={mat} />
      ))}
      {oakMatrices.map((mat, i) => (
        <OakTree key={`oak-${i}`} matrix={mat} />
      ))}
      {bushMatrices.map((mat, i) => (
        <Bush key={`bush-${i}`} matrix={mat} />
      ))}
    </group>
  );
}

function PineTree({ matrix }: { matrix: THREE.Matrix4 }) {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  matrix.decompose(pos, quat, scl);
  return (
    <group position={pos} quaternion={quat} scale={scl}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 1.2, 6]} />
        <meshStandardMaterial color="#4a3522" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 1.8, 0]}>
        <coneGeometry args={[0.9, 2.4, 8]} />
        <meshStandardMaterial color="#2f4a2a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.8, 0]}>
        <coneGeometry args={[0.65, 1.6, 8]} />
        <meshStandardMaterial color="#36552f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function OakTree({ matrix }: { matrix: THREE.Matrix4 }) {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  matrix.decompose(pos, quat, scl);
  return (
    <group position={pos} quaternion={quat} scale={scl}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.6, 6]} />
        <meshStandardMaterial color="#5a4632" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 2.1, 0]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#4a6b3a" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Bush({ matrix }: { matrix: THREE.Matrix4 }) {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  matrix.decompose(pos, quat, scl);
  return (
    <group position={pos} quaternion={quat} scale={scl}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#3a5a30" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}
