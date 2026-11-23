import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TrackDefinition } from './trackPaths';
import { reusable } from '@/utils/three-helpers';
import { useStore } from '@/stores/useStore';

const RAIL_GAUGE = 1.435; // standard gauge
const RAIL_HEIGHT = 0.18;
const RAIL_WIDTH = 0.07;
const SLEEPER_SPACING = 0.65;
const SLEEPER_W = 0.28;
const SLEEPER_H = 0.16;
const SLEEPER_L = 2.6;

interface RailwayTrackProps {
  def: TrackDefinition;
}

export default function RailwayTrack({ def }: RailwayTrackProps) {
  const selectedTrackId = useStore((s) => s.selectedTrackId);
  const selectTrack = useStore((s) => s.selectTrack);
  const selected = selectedTrackId === def.id;

  const railMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { railLeftMat, railRightMat, sleeperMat, ballastMat } = useMemo(() => {
    return {
      railLeftMat: reusable.materials.railSteel.clone(),
      railRightMat: reusable.materials.railSteel.clone(),
      sleeperMat: reusable.materials.sleeperConcrete.clone(),
      ballastMat: reusable.materials.ballast.clone(),
    };
  }, []);

  useFrame(() => {
    const target = selected ? '#ffd27a' : '#c7ccd3';
    railLeftMat.color.lerp(new THREE.Color(target), 0.15);
    railRightMat.color.lerp(new THREE.Color(target), 0.15);
  });

  const { railLeftPositions, railRightPositions, sleeperPositions, sleeperRotations, ballastGeo, length } = useMemo(() => {
    const curve = def.curve;
    const totalLen = curve.getLength();
    const segments = Math.max(8, Math.floor(totalLen / 0.5));
    const pts = curve.getSpacedPoints(segments);

    const railLeft: THREE.Matrix4[] = [];
    const railRight: THREE.Matrix4[] = [];
    const sleeperPos: THREE.Vector3[] = [];
    const sleeperRot: number[] = [];

    const halfGauge = RAIL_GAUGE / 2 + RAIL_WIDTH / 2;
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4();

    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i];
      const next = pts[i + 1];
      const dir = new THREE.Vector3().subVectors(next, p).normalize();
      const perp = new THREE.Vector3().crossVectors(dir, up).normalize();

      const leftP = p.clone().add(perp.clone().multiplyScalar(halfGauge));
      const rightP = p.clone().add(perp.clone().multiplyScalar(-halfGauge));
      const segLen = p.distanceTo(next);

      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      m.compose(leftP, q, new THREE.Vector3(RAIL_WIDTH, segLen, RAIL_WIDTH));
      railLeft.push(m.clone());
      m.compose(rightP, q, new THREE.Vector3(RAIL_WIDTH, segLen, RAIL_WIDTH));
      railRight.push(m.clone());
    }

    const sleeperCount = Math.floor(totalLen / SLEEPER_SPACING);
    for (let i = 0; i < sleeperCount; i++) {
      const t = i / sleeperCount;
      const p = curve.getPointAt(Math.min(t, 0.999));
      const tangent = curve.getTangentAt(Math.min(t, 0.999));
      const angle = Math.atan2(tangent.x, tangent.z);
      sleeperPos.push(p.clone().setY(p.y + 0.02));
      sleeperRot.push(angle);
    }

    // ballast as a tube along curve flattened
    const ballastGeo = new THREE.TubeGeometry(curve, segments, 2.0, 6, false);

    return {
      railLeftPositions: railLeft,
      railRightPositions: railRight,
      sleeperPositions: sleeperPos,
      sleeperRotations: sleeperRot,
      ballastGeo,
      length: totalLen,
    };
  }, [def]);

  const sleeperMatRef = useMemo(() => reusable.materials.sleeperConcrete, []);

  void railMatRef;
  void length;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        selectTrack(def.id);
      }}
    >
      {/* Ballast bed */}
      <mesh geometry={ballastGeo} material={ballastMat} receiveShadow castShadow position={[0, -0.12, 0]} scale={[1, 0.15, 1]} />

      {/* Sleepers - instanced */}
      <instancedMesh
        ref={(ref) => {
          if (!ref) return;
          const dummy = new THREE.Object3D();
          sleeperPositions.forEach((p, i) => {
            dummy.position.copy(p);
            dummy.rotation.set(0, sleeperRotations[i], 0);
            dummy.scale.set(SLEEPER_L, SLEEPER_H, SLEEPER_W);
            dummy.updateMatrix();
            ref.setMatrixAt(i, dummy.matrix);
          });
          ref.instanceMatrix.needsUpdate = true;
        }}
        args={[undefined, undefined, sleeperPositions.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={sleeperMatRef} attach="material" />
      </instancedMesh>

      {/* Left rail - instanced segments */}
      <instancedMesh
        ref={(ref) => {
          if (!ref) return;
          railLeftPositions.forEach((mat, i) => ref.setMatrixAt(i, mat));
          ref.instanceMatrix.needsUpdate = true;
        }}
        args={[undefined, undefined, railLeftPositions.length]}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={railLeftMat} attach="material" />
      </instancedMesh>

      {/* Right rail - instanced segments */}
      <instancedMesh
        ref={(ref) => {
          if (!ref) return;
          railRightPositions.forEach((mat, i) => ref.setMatrixAt(i, mat));
          ref.instanceMatrix.needsUpdate = true;
        }}
        args={[undefined, undefined, railRightPositions.length]}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={railRightMat} attach="material" />
      </instancedMesh>
    </group>
  );
}
