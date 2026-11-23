import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useStore } from '@/stores/useStore';
import { CAMERA_VIEWS } from '@/data/stations';

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const cameraPreset = useStore((s) => s.cameraPreset);
  const sensitivity = useStore((s) => s.cameraSensitivity);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const selectStation = useStore((s) => s.selectStation);

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  useEffect(() => {
    const view = CAMERA_VIEWS.find((v) => v.id === cameraPreset) ?? CAMERA_VIEWS[0];
    targetPos.current.set(...view.position);
    targetLook.current.set(...view.target);
    isAnimating.current = true;
    // Clear selection when going to overview
    if (cameraPreset === 'overview') {
      selectStation(null);
    }
  }, [cameraPreset, selectStation]);

  useFrame(() => {
    if (isAnimating.current && controlsRef.current) {
      const lerpFactor = reducedMotion ? 1 : 0.06;
      camera.position.lerp(targetPos.current, lerpFactor);
      controlsRef.current.target.lerp(targetLook.current, lerpFactor);
      controlsRef.current.update();
      if (camera.position.distanceTo(targetPos.current) < 0.5) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as never}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={sensitivity}
      panSpeed={sensitivity * 0.8}
      zoomSpeed={sensitivity * 1.2}
      minDistance={15}
      maxDistance={260}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
      }}
    />
  );
}
