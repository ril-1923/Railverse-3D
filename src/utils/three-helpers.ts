import * as THREE from 'three';

export const reusable = {
  geometries: {
    box: new THREE.BoxGeometry(1, 1, 1),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 12),
    cone: new THREE.ConeGeometry(1, 1, 8),
    sphere: new THREE.SphereGeometry(1, 12, 10),
  },
  materials: {
    steel: new THREE.MeshStandardMaterial({ color: '#9ba4b5', metalness: 0.9, roughness: 0.35 }),
    railSteel: new THREE.MeshStandardMaterial({ color: '#c7ccd3', metalness: 0.95, roughness: 0.25 }),
    sleeperConcrete: new THREE.MeshStandardMaterial({ color: '#6b6f75', roughness: 0.9 }),
    sleeperWood: new THREE.MeshStandardMaterial({ color: '#5a4632', roughness: 0.95 }),
    ballast: new THREE.MeshStandardMaterial({ color: '#6e6a63', roughness: 1 }),
    concrete: new THREE.MeshStandardMaterial({ color: '#b8b5ad', roughness: 0.85 }),
    glass: new THREE.MeshStandardMaterial({ color: '#8fd4e8', metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.55 }),
    platformStone: new THREE.MeshStandardMaterial({ color: '#9a9690', roughness: 0.95 }),
    roof: new THREE.MeshStandardMaterial({ color: '#3a4250', metalness: 0.5, roughness: 0.6 }),
    brick: new THREE.MeshStandardMaterial({ color: '#8a6b5a', roughness: 0.95 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#2b2f36', metalness: 0.7, roughness: 0.5 }),
    red: new THREE.MeshStandardMaterial({ color: '#b23a3a', roughness: 0.7 }),
    yellow: new THREE.MeshStandardMaterial({ color: '#d9a93a', roughness: 0.7 }),
    white: new THREE.MeshStandardMaterial({ color: '#e8e8e0', roughness: 0.8 }),
    black: new THREE.MeshStandardMaterial({ color: '#1a1d22', roughness: 0.8 }),
    water: new THREE.MeshStandardMaterial({ color: '#3a6b88', metalness: 0.4, roughness: 0.2, transparent: true, opacity: 0.85 }),
  },
};

export function trackPath(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}
