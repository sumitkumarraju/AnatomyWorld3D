'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EsophagusModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const esophagusCurve = useMemo(() => {
    const points: THREE.Vector3[] = [
      new THREE.Vector3(0, 1.85, -0.15),    // Pharynx junction
      new THREE.Vector3(0, 1.7, -0.18),
      new THREE.Vector3(-0.01, 1.5, -0.2),
      new THREE.Vector3(-0.02, 1.3, -0.2),
      new THREE.Vector3(-0.01, 1.1, -0.18),
      new THREE.Vector3(0, 0.9, -0.15),
      new THREE.Vector3(0.02, 0.7, -0.1),
      new THREE.Vector3(0.03, 0.6, 0.0),     // Through diaphragm
      new THREE.Vector3(0.03, 0.5, 0.15),    // Connects to stomach
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(esophagusCurve, 30, 0.018, 10, false);
  }, [esophagusCurve]);

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();
    // Peristalsis wave
    materialRef.current.emissiveIntensity = isSelected
      ? 0.25 + Math.sin(t * 3) * 0.08
      : 0.08 + Math.sin(t * 2) * 0.03;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Main tube */}
      <mesh geometry={tubeGeo} castShadow>
        <meshStandardMaterial
          ref={materialRef}
          color="#e8a0a0"
          emissive="#d08080"
          emissiveIntensity={0.08}
          roughness={0.5}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner lumen (tube within tube) */}
      <mesh>
        <tubeGeometry args={[esophagusCurve, 30, 0.01, 8, false]} />
        <meshStandardMaterial
          color="#c07070"
          transparent
          opacity={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Wireframe */}
      <mesh geometry={tubeGeo} scale={[1.02, 1, 1.02]}>
        <meshBasicMaterial color="#d08080" wireframe transparent opacity={0.05} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 1.2, -0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 1.4, 12]} />
          <meshStandardMaterial
            color="#d08080"
            emissive="#d08080"
            emissiveIntensity={0.3}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
