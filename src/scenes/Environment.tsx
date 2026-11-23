import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EnvironmentMode } from '@/types';
import { useStore } from '@/stores/useStore';

interface EnvConfig {
  skyTop: string;
  skyBottom: string;
  sunColor: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: string;
  ambientIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
}

const CONFIGS: Record<EnvironmentMode, EnvConfig> = {
  day: {
    skyTop: '#3a7bd5',
    skyBottom: '#b8d8f0',
    sunColor: '#fff4e0',
    sunIntensity: 2.2,
    sunPosition: [80, 120, 60],
    ambientColor: '#bcd4e8',
    ambientIntensity: 0.5,
    fogColor: '#b8d8f0',
    fogNear: 120,
    fogFar: 360,
    hemiSky: '#b8d8f0',
    hemiGround: '#4a6b3a',
    hemiIntensity: 0.6,
  },
  sunset: {
    skyTop: '#2a3a6a',
    skyBottom: '#e89a5a',
    sunColor: '#ff9a5a',
    sunIntensity: 1.6,
    sunPosition: [40, 30, -60],
    ambientColor: '#d98a5a',
    ambientIntensity: 0.45,
    fogColor: '#d98a5a',
    fogNear: 100,
    fogFar: 320,
    hemiSky: '#e89a5a',
    hemiGround: '#5a4632',
    hemiIntensity: 0.5,
  },
  night: {
    skyTop: '#05080f',
    skyBottom: '#101a2a',
    sunColor: '#9ab4d8',
    sunIntensity: 0.4,
    sunPosition: [-40, 80, -40],
    ambientColor: '#1a2538',
    ambientIntensity: 0.25,
    fogColor: '#0a1220',
    fogNear: 80,
    fogFar: 280,
    hemiSky: '#101a2a',
    hemiGround: '#05080f',
    hemiIntensity: 0.3,
  },
};

export default function EnvironmentSystem() {
  const mode = useStore((s) => s.environment);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  const target = CONFIGS[mode];

  const current = useRef({
    sunIntensity: target.sunIntensity,
    ambIntensity: target.ambientIntensity,
    hemiIntensity: target.hemiIntensity,
  });

  const sunColor = useMemo(() => new THREE.Color(target.sunColor), [target.sunColor]);
  const ambColor = useMemo(() => new THREE.Color(target.ambientColor), [target.ambientColor]);
  const hemiSky = useMemo(() => new THREE.Color(target.hemiSky), [target.hemiSky]);
  const hemiGround = useMemo(() => new THREE.Color(target.hemiGround), [target.hemiGround]);
  const fogColor = useMemo(() => new THREE.Color(target.fogColor), [target.fogColor]);

  useFrame(() => {
    const c = current.current;
    c.sunIntensity += (target.sunIntensity - c.sunIntensity) * 0.05;
    c.ambIntensity += (target.ambientIntensity - c.ambIntensity) * 0.05;
    c.hemiIntensity += (target.hemiIntensity - c.hemiIntensity) * 0.05;

    if (sunRef.current) {
      sunRef.current.intensity = c.sunIntensity;
      sunRef.current.color.lerp(sunColor, 0.05);
    }
    if (ambRef.current) {
      ambRef.current.intensity = c.ambIntensity;
      ambRef.current.color.lerp(ambColor, 0.05);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = c.hemiIntensity;
      hemiRef.current.color.lerp(hemiSky, 0.05);
      (hemiRef.current as THREE.HemisphereLight).groundColor.lerp(hemiGround, 0.05);
    }
    if (fogRef.current) {
      fogRef.current.color.lerp(fogColor, 0.05);
      fogRef.current.near += (target.fogNear - fogRef.current.near) * 0.05;
      fogRef.current.far += (target.fogFar - fogRef.current.far) * 0.05;
    }
  });

  return (
    <group>
      <fog ref={fogRef} attach="fog" args={[target.fogColor, target.fogNear, target.fogFar]} />
      <ambientLight ref={ambRef} intensity={target.ambientIntensity} color={target.ambientColor} />
      <hemisphereLight ref={hemiRef} intensity={target.hemiIntensity} color={target.hemiSky} groundColor={target.hemiGround} />
      <directionalLight
        ref={sunRef}
        position={target.sunPosition}
        intensity={target.sunIntensity}
        color={target.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-bias={-0.0005}
      />
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[450, 32, 16]} />
        <shaderMaterial
          side={THREE.BackSide}
          uniforms={{
            topColor: { value: new THREE.Color(target.skyTop) },
            bottomColor: { value: new THREE.Color(target.skyBottom) },
            offset: { value: 33 },
            exponent: { value: 0.6 },
          }}
          vertexShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition + offset).y;
              gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
          `}
        />
      </mesh>
      {/* Station lights at night */}
      {mode === 'night' && <NightLights />}
    </group>
  );
}

function NightLights() {
  const points: [number, number, number][] = [
    [0, 5, -12],
    [0, 5, 4],
    [0, 5, 12],
    [-120, 4, -8],
    [110, 4, 0],
  ];
  return (
    <group>
      {points.map((p, i) => (
        <pointLight key={i} position={p} color="#ffd27a" intensity={20} distance={40} decay={2} />
      ))}
    </group>
  );
}
