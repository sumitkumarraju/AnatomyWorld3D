'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BodyOutlineModel({
  onClick,
  isSelected = false,
}: {
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Create a simplified human torso outline using parametric geometry
  const torsoGeo = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Profile from neck to hips
      let x: number;
      if (t < 0.1) {
        x = 0.08 + t * 0.8; // Neck
      } else if (t < 0.3) {
        x = 0.16 + (t - 0.1) * 1.5; // Shoulders widening
      } else if (t < 0.6) {
        x = 0.46 - (t - 0.3) * 0.3; // Chest to waist
      } else if (t < 0.8) {
        x = 0.37 + (t - 0.6) * 0.4; // Waist to hips
      } else {
        x = 0.45 - (t - 0.8) * 0.6; // Hips to legs
      }
      const y = 2.3 - t * 3.0;
      points.push(new THREE.Vector2(x, y));
    }

    const geo = new THREE.LatheGeometry(points, 24);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Head sphere
  const headGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.16, 16, 16);
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.02;
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Torso outline */}
      <mesh geometry={torsoGeo}>
        <meshStandardMaterial
          color="#88aacc"
          emissive="#6699bb"
          emissiveIntensity={0.05}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe outline */}
      <mesh geometry={torsoGeo}>
        <meshBasicMaterial
          color="#4488aa"
          wireframe
          transparent
          opacity={isSelected ? 0.15 : 0.06}
        />
      </mesh>

      {/* Head outline */}
      <mesh geometry={headGeo} position={[0, 2.4, 0]}>
        <meshBasicMaterial
          color="#4488aa"
          wireframe
          transparent
          opacity={isSelected ? 0.15 : 0.06}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.15, 8]} />
        <meshBasicMaterial
          color="#4488aa"
          wireframe
          transparent
          opacity={isSelected ? 0.12 : 0.05}
        />
      </mesh>
    </group>
  );
}
