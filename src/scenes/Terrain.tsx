import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '@/stores/useStore';

function noiseHeight(x: number, z: number, base: number, amp: number, freq: number): number {
  return (
    base +
    Math.sin(x * freq) * Math.cos(z * freq * 0.8) * amp +
    Math.sin(x * freq * 2.3 + 1.2) * Math.cos(z * freq * 1.7) * amp * 0.4
  );
}

export default function Terrain() {
  const quality = useStore((s) => s.quality);

  const { geometry, grassMat, rockMat } = useMemo(() => {
    const size = 400;
    const segs = quality === 'low' ? 64 : quality === 'medium' ? 96 : 128;
    const geo = new THREE.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const grass = new THREE.Color('#4a6b3a');
    const grassDark = new THREE.Color('#36502a');
    const rock = new THREE.Color('#7a6f63');
    const snow = new THREE.Color('#d8dde0');
    const sand = new THREE.Color('#a8946a');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Base rolling hills
      let h = noiseHeight(x, z, 0, 3.2, 0.018);

      // Mountain ranges in the NW and edges
      const distFromCenter = Math.sqrt(x * x + z * z);
      const mountainMask = Math.max(0, Math.min(1, (distFromCenter - 110) / 60));
      const mountainH = noiseHeight(x, z, 0, 34, 0.012) * mountainMask;
      h += mountainH;

      // Flatten near stations and tracks (embankment valleys)
      const flattenZones: [number, number, number][] = [
        [0, 0, 30], // central
        [-120, -90, 28], // mountain
        [110, 60, 30], // industrial
      ];
      let flatten = 0;
      for (const [cx, cz, r] of flattenZones) {
        const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
        if (d < r) flatten = Math.max(flatten, 1 - d / r);
      }
      // track corridor flatten along central-mountain and central-industrial
      const corridorHalf = 8;
      const inCorridor =
        Math.abs(z - 0) < corridorHalf && x > -130 && x < 160 ? 1 - Math.abs(z) / corridorHalf : 0;
      flatten = Math.max(flatten, inCorridor * 0.7);
      h = h * (1 - flatten * 0.85);

      // Water body depression in the SE
      const waterDist = Math.sqrt((x - 150) ** 2 + (z + 50) ** 2);
      if (waterDist < 35) {
        h = Math.min(h, -1.2 - (1 - waterDist / 35) * 1.5);
      }

      pos.setY(i, h);

      // Color by height
      const c = new THREE.Color();
      if (h < -0.5) {
        c.copy(sand).lerp(grassDark, THREE.MathUtils.clamp((h + 2) / 1.5, 0, 1));
      } else if (h < 6) {
        c.copy(grassDark).lerp(grass, THREE.MathUtils.clamp(h / 6, 0, 1));
      } else if (h < 20) {
        c.copy(grass).lerp(rock, THREE.MathUtils.clamp((h - 6) / 14, 0, 1));
      } else if (h < 30) {
        c.copy(rock);
      } else {
        c.copy(rock).lerp(snow, THREE.MathUtils.clamp((h - 30) / 12, 0, 1));
      }
      colors.push(c.r, c.g, c.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const gMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
    const rMat = new THREE.MeshStandardMaterial({ color: '#6e6256', roughness: 1, flatShading: true });

    return { geometry: geo, grassMat: gMat, rockMat: rMat };
  }, [quality]);

  void rockMat;

  return (
    <group>
      <mesh geometry={geometry} material={grassMat} receiveShadow castShadow />
      {/* Water body */}
      <mesh position={[150, -1.0, -50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[33, 32]} />
        <meshStandardMaterial color="#3a6b88" metalness={0.4} roughness={0.2} transparent opacity={0.82} />
      </mesh>
      {/* River - a thin box running from water toward industrial */}
      <mesh position={[130, -0.6, 20]} rotation={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.3, 90]} />
        <meshStandardMaterial color="#3a6b88" metalness={0.4} roughness={0.2} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}
